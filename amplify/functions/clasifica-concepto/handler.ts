import type { Schema } from "../../data/resource"

export const handler: Schema["clasificaConcepto"]["functionHandler"]  = async (event, context) => {
  // arguments typed from `.arguments()`
  const { concepto } = event.arguments;
  // your function code goes here
  return `clasificaConcepto,  ${concepto}!!`;
};
