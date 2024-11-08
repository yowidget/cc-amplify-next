import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data,  MODEL_ID, categorizeFunction } from './data/resource.js';
import { Stack } from "aws-cdk-lib";
import {
  Policy,
  Effect,
  PolicyStatement,
} from "aws-cdk-lib/aws-iam";


// Functions
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

//DynamoDbStream
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";



const backend = defineBackend({
  auth,
  data,
  myDynamoDBFunction,
  categorizeFunction,
}); 


//Para DynamoDBStream
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
          'ses:SendEmail', 'ses:SendRawEmail',
          'ses:TagResource', 'ses:CreateEmailIdentity',
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




backend.categorizeFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
    ],
  })
);