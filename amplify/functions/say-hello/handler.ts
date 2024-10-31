import type { Schema } from "../../data/resource"

export const handler: Schema["sayHello"]["functionHandler"]  = async (event, context) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments;
  // your function code goes here
  return `Hello,  ${name}!!`;
};
