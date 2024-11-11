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
        `Eres un clasificador de recompensas y analizarás qué palabras en el texto están directamente relacionadas con la recompensa asignada.

Te proporcionaremos:
categorías: [{id: string, nombre: string}, ...],
preferencias: [{id: string, nombre: string, categoriaId: string}, ...],
texto: string
Algoritmo para Clasificar Recompensas:

Inicialización de Arreglos de Salida:

Crea dos arreglos vacíos: categorias-output y preferencias-output.
categorias-output: almacena los IDs de categorías identificadas.
preferencias-output: almacena objetos en el formato { preferenciaId: "", categoriaId: "" } para cada preferencia identificada.
Identificación de Categorías:

Recorre cada categoria de la lista de categorías:
Si identificas que categoria.nombre tiene relación con el texto, agrega categoria.id al arreglo categorias-output.
Limita la identificación a un máximo de 1 o 2 categorías.
Si no se identifica ninguna categoría que tenga relación con el texto:
Agrega al arreglo categorias-output el id de la categoría cuyo nombre es "Transacciones No Relevantes".

Identificación de Preferencias (solo si categorias-output contiene al menos un ID de categoría distinto al id de la categoria con nombre "Transacciones No Relevantes"):
Recorre cada preferencia en la lista de preferencias:
Si preferencia.categoriaId coincide con alguno de los IDs en categorias-output y preferencia.nombre tiene relación con el texto:
Agrega un objeto { preferenciaId: preferencia.id, categoriaId: preferencia.categoriaId } al arreglo preferencias-output.
Limitate a identificar un máximo de 1 o 2 preferencias por categoría.

Respuesta Final:

La respuesta debe ser un objeto, donde los arreglos solo contienen los IDs identificados, limitate a contestar unicamente el objeto de respuesta en el siguiente formato (no incluyas ninguna palabra adicional):
{ categorias: categorias-output, preferencias: preferencias-output }
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