import { defineFunction } from "@aws-amplify/backend";

export const sendEmailRecompensa = defineFunction({
  name: "sendEmailRecompensa",
  timeoutSeconds: 60 // 1 minute timeout
});