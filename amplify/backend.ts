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
import { CustomNotifications } from "./custom/CustomNotifications/resource";
import {  MODEL_ID, generateHaikuFunction } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  sayHello,
  myDynamoDBFunction,
  generateHaikuFunction
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      `arn:aws:bedrock:*::foundation-model/${MODEL_ID}`,
    ],
  })
);
// Create a new stack for the EventBridge data source
const eventStack = backend.createStack("MyExternalDataSources");
// Reference or create an EventBridge EventBus
const eventBus = aws_events.EventBus.fromEventBusName(
  eventStack,
  "MyEventBus",
  "default"
);

backend.data.addEventBridgeDataSource("MyEventBridgeDataSource", eventBus);

// Create a policy statement to allow invoking the AppSync API's mutations
const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ["appsync:GraphQL"],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Mutation/*`],
});

// Create a role for the EventBus to assume
const eventBusRole = new Role(eventStack, "AppSyncInvokeRole", {
  assumedBy: new ServicePrincipal("events.amazonaws.com"),
  inlinePolicies: {
    PolicyStatement: new PolicyDocument({
      statements: [policyStatement],
    }),
  },
});

// Create an EventBridge rule to route events to the AppSync API
const rule = new aws_events.CfnRule(eventStack, "MyOrderRule", {
  eventBusName: eventBus.eventBusName,
  name: "broadcastOrderStatusChange",
  eventPattern: {
    source: ["amplify.orders"],
    /* The shape of the event pattern must match EventBridge's event message structure.
    So, this field must be spelled as "detail-type". Otherwise, events will not trigger the rule.

    https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html
    */
    ["detail-type"]: ["OrderStatusChange"],
    detail: {
      orderId: [{ exists: true }],
      status: ["PENDING", "SHIPPED", "DELIVERED"],
      message: [{ exists: true }],
    },
  },
  targets: [
    {
      id: "orderStatusChangeReceiver",
      arn: backend.data.resources.cfnResources.cfnGraphqlApi
        .attrGraphQlEndpointArn,
      roleArn: eventBusRole.roleArn,
      appSyncParameters: {
        graphQlOperation: `
        mutation PublishOrderFromEventBridge(
          $orderId: String!
          $status: String!
          $message: String!
        ) {
          publishOrderFromEventBridge(orderId: $orderId, status: $status, message: $message) {
            orderId
            status
            message
          }
        }`,
      },
      inputTransformer: {
        inputPathsMap: {
          orderId: "$.detail.orderId",
          status: "$.detail.status",
          message: "$.detail.message",
        },
        inputTemplate: JSON.stringify({
          orderId: "<orderId>",
          status: "<status>",
          message: "<message>",
        }),
      },
    },
  ],
});

const customNotifications = new CustomNotifications(
  backend.createStack("CustomNotifications"),
  "CustomNotifications",
  { sourceAddress: "arturo@molaca.com" }
);

backend.addOutput({
  custom: {
    topicArn: customNotifications.topic.topicArn,
    topicName: customNotifications.topic.topicName,
  },
});

const customResourceStack = backend.createStack("MyCustomResources");

new sqs.Queue(customResourceStack, "CustomQueue");
new sns.Topic(customResourceStack, "CustomTopic");

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
