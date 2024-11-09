import { defineFunction } from '@aws-amplify/backend';

export const getCategorias = defineFunction({
  name: 'getCategorias',
  entry: './handler.ts'
});