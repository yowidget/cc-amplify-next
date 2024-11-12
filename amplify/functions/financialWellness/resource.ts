import { defineFunction } from '@aws-amplify/backend';


export const financialWellness = defineFunction({
    entry: "./handler.ts",
    name: "financialWellness",
    timeoutSeconds: 60
  });