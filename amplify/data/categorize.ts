import { ResponseType } from "aws-cdk-lib/aws-apigateway";
import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput
} from "@aws-sdk/client-bedrock-runtime";
import { error } from "console";

const client = new BedrockRuntimeClient();

export const handler: Schema["categorize"]["functionHandler"] = async (
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
        `
Necesito que me ayudes a clasificar los textos del array de textos que se te proporcionará a tu criterio y base de conocimientos.
Las posibles categorías son: 
Alimentación y Bebidas
Delivery de Comida
Ropa y Accesorios
Electrónica y Tecnología
Hogar y Jardín
Salud y Belleza
Transporte
Entretenimiento y Ocio
Vuelos
Hoteleria
Servicios Financieros
Seguros
Educación
Suscripciones
Donaciones y Caridad
Impuestos y Tarifas
Inversiones
Servicios Públicos
Cuotas o Membresías
Transacciones No Relevantes

Clasifica los textos y entregame la relacion de cada texto con su categoria en un array de objetos JSON. Cada objeto debe tener la siguiente estructura:
{
  "text": "Texto a clasificar",
  "category": "Categoria asignada"
}

Resultando en la siguiente forma de ejemplo:
[{"text": "Texto 1","category": "Categoria 1"},{"text": "Texto 2","category": "Categoria 2"},...]
Sigue el mismo formato, y sin espacio entre todos los caracteres (a exepcion de los elementos entre parentesis de adentro) y no uses \

Limitate a no contestar nada mas de lo que se te pide, y asegurate de que cada texto tenga una categoria asignada. Gracias por tu ayuda!
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

  const finalData = JSON.parse(`${data.content[0].text}`);

  if (typeof data.content === "object") return finalData;
  throw error ("La respuesta del modelo no fue en el formato establecido: Array<object>");

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