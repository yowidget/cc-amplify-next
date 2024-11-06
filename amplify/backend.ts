import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { Stack } from "aws-cdk-lib";
import {
  Policy,
  Effect,
  PolicyStatement,
  PolicyDocument,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

// Eventos
import { aws_events } from "aws-cdk-lib";
// import * as sns from "aws-cdk-lib/aws-sns";
// import * as sqs from "aws-cdk-lib/aws-sqs";

// Functions
import { sayHello } from "./functions/say-hello/resource";
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

//DynamoDbStream
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";

const backend = defineBackend({
  auth,
  data,
  sayHello,
  myDynamoDBFunction,
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


// Create a new stack for the EventBridge data source
const eventStack = backend.createStack("EventBridgeDataSource");
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
const rule = new aws_events.CfnRule(eventStack, "MyOrderRule_widget2", {
  eventBusName: eventBus.eventBusName,
  name: "broadcastOrderStatusChange_widget2",
  eventPattern: {
    source: ["amplify.orders"],
    /* The shape of the event pattern must match EventBridge's event message structure.
    So, this field must be spelled as "detail-type". Otherwise, events will not trigger the rule.

    https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html
    */
    ["detail-type"]: ["OrderStatusChange"],
    detail: {
      orderId: [{ exists: true }],
      status: ["OrderPending", "OrderShipped", "OrderDelivered"],
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
          $message:String!
          $orderId:String!
          $status:String!
        ) {
          publishOrderFromEventBridge(orderId:$orderId,status:$status,message:$message) {
            message
            orderId
            status
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