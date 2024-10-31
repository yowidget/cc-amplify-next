import { defineFunction } from '@aws-amplify/backend';

export const clasificaConcepto = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'clasifica-concepto',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  timeoutSeconds: 60 // defaults to 10
});