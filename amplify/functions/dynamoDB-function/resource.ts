import { defineFunction } from "@aws-amplify/backend";

export const myDynamoDBFunction = defineFunction({
  name: "dynamoDB-function",
  timeoutSeconds: 60 // 1 minute timeout
});