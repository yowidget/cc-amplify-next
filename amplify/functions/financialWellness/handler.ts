import { ResponseType } from "aws-cdk-lib/aws-apigateway";
import type { Schema } from "../../data/resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput
} from "@aws-sdk/client-bedrock-runtime";
import { error } from "console";

const client = new BedrockRuntimeClient();

export const handler: Schema["recompensaAnalizer"]["functionHandler"] = async (
  event,
  context
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
    modelId: process.env.MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      system:
        `Eres un financial advisor y le daras consejos a un usuario sobre como mejorar su salud financiera, basado en sus transacciones y su historial de gastos que se te proporcionara en el prompt.
          `,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: JSON.stringify(prompt),
            },
          ],
        },
      ],
      max_tokens: 10000,
      temperature: 0.5,
    }),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);

  const data = JSON.parse(Buffer.from(response.body).toString());

  return data

  // const finalData = JSON.parse(`${data.content[0].text}`);

  // if (typeof data.content === "object") return finalData;
  // throw error ("La respuesta del modelo no fue en el formato establecido: Array<object>");





  // const finalData = JSON.parse(`${data.content[0].text}`);

  // if (typeof data.content === "object") return response;
  // throw error ("La respuesta del modelo no fue en el formato establecido: Array<object>");

  // data.items = data.items.map((item: any) => {
  //   if (typeof item === "string") {
  //     const jsonItem = JSON.parse(item);

  //     if (typeof jsonItem === "object") {
  //       if (jsonItem.text) {
  //         jsonItem?.text
  //       }

  //     }
  //   }
  //   return item;
  // });

  
}