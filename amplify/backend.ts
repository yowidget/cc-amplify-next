import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { Stack } from "aws-cdk-lib";
import {
  Policy,
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { aws_events } from "aws-cdk-lib";

import { sayHello } from "./functions/say-hello/resource";
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

const backend = defineBackend({
  auth,
  data,
  sayHello,
  myDynamoDBFunction,
});

// Create a policy statement to allow invoking the AppSync API's mutations
const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ["appsync:GraphQL"],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Mutation/*`],
});



const transaccionTable = backend.data.resources.tables["Transaccion"];
const policy = new Policy(
  Stack.of(transaccionTable),
  "MyDynamoDBFunctionStreamingPolicy",
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: ["*"],
      }),
    ],
  }
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
  Stack.of(transaccionTable),
  "MyDynamoDBFunctionTodoEventStreamMapping",
  {
    target: backend.myDynamoDBFunction.resources.lambda,
    eventSourceArn: transaccionTable.tableStreamArn,
    startingPosition: StartingPosition.LATEST,
  }
);

mapping.node.addDependency(policy);
