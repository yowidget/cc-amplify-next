import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { Stack } from "aws-cdk-lib";
import {
  Role,
  ServicePrincipal,
  PolicyDocument,
  Policy,
  Effect,
  PolicyStatement,
} from "aws-cdk-lib/aws-iam";

// Functions
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";
import { sendEmailRecompensa } from "./functions/sendEmailRecompensa/resource";
import { data, MODEL_ID, categorizeFunction } from "./data/resource.js";

//DynamoDbStream
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";

//Storage
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  myDynamoDBFunction,
  sendEmailRecompensa,
  categorizeFunction,
});

backend.sendEmailRecompensa.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"],
  })
);
backend.sendEmailRecompensa.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [`arn:aws:bedrock:*::foundation-model/${MODEL_ID}`],
  })
);

backend.categorizeFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [`arn:aws:bedrock:*::foundation-model/${MODEL_ID}`],
  })
);
const ebSchedulerDS = backend.data.addHttpDataSource(
  // name of the data source that needs to be passed to my amplify/data/resource.ts file
  "ebSchedulerDS",
  "https://scheduler.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "scheduler",
    },
  }
);
ebSchedulerDS.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["scheduler:CreateSchedule"],
    resources: ["*"],
  })
);
// create a role a scheduler to invoke the function

const schedulerRole = new Role(
  Stack.of(backend.data),
  "createMessageSchedulerRole",
  {
    assumedBy: new ServicePrincipal("scheduler.amazonaws.com"),
    inlinePolicies: {
      invokeFunction: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: ["lambda:InvokeFunction"],
            resources: [
              backend.sendEmailRecompensa.resources.lambda.functionArn,
            ],
          }),
        ],
      }),
    },
  }
);

// pass the role from the ebScheduler to the schedulerRole
ebSchedulerDS.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ["iam:PassRole"],
    resources: [schedulerRole.roleArn],
  })
);

//set the role and the function's arn to env vars
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  SCHEDULE_FUNCTION_ROLE_ARN: schedulerRole.roleArn,
  SCHEDULE_FUNCTION_ARN:
    backend.sendEmailRecompensa.resources.lambda.functionArn,
};

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
          "ses:SendEmail",
          "ses:SendRawEmail",
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
