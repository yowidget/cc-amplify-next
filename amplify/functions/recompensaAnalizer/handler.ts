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
        `Eres un clasificador de recompensas, asi como tambien analizas que palabras tienen una relacion directa con la recompensa clasificada.
        Se te dará una lista de categorias ([{id: string, nombre: string},...]), una lista de preferencias ([{id: string, nombre: string, categoriaId: string},...]) y un texto que representa una recompensa.
        Usaras de auxiliares dos arreglos de texto vacios, uno de categorias que llamaremos categorias-output y otro de preferencias que llamaremos preferencias-output, ambos son de la forma: ["", "",...].
        La respuesta debe de ser un objeto con la siguiente estructura:
        {categorias: categorias-output, preferencias: preferencias-output}
        No contestes mas de lo que se te pide, asegurate de que lo unico en la respuesta sea el objeto mencionado.
        Primero identifica 1 o 2 categorias que tengan relacion con el texto, si el texto no tiene relacion con ninguna categoria, o no identificas el contenido del texto, agrega el id de categoria cuyo nombre es "Transacciones No Relevantes" al arreglo de categorias-output y responde con el arreglo de categorias-output con el unico registro y el arreglo de preferencias-output vacio.
        En caso contrario, si identificas una o dos categorias, agrega al arreglo de categorias-output los id's de las categorias identificadas. 
        Despues identifica las preferencias (cuyo valor categoriaId sea igual a algun id de la/las categorias relacionadas) que tengan relacion con el texto, agrea los identificadores de las preferencias identificadas al arreglo de preferencias-output, si no identificas ninguna preferencia, no agregues nada al arreglo de preferencias-output.
        Asegurate de que las preferencias identificadas tengan relacion con las categorias identificadas mediante el campo categoriaId de las preferencias.
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
      max_tokens: 3000,
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