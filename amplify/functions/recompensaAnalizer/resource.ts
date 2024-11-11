import { defineFunction } from '@aws-amplify/backend';

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const recompensaAnalizer = defineFunction({
    entry: "./handler.ts",
    environment: {
      MODEL_ID,
    },
    timeoutSeconds: 60
  });