import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput
} from "@aws-sdk/client-bedrock-runtime";

// export const handler: Schema["categorize"]["functionHandler"] = async (
//   event,
//   context
// ) => {
//   const prompt = event.arguments.prompt;

//   const commandInvokeCategorize = () => {

//     const input = {
//       // modelId: process.env.MODEL_ID,
//       modelId: "ai21.jamba-1-5-large-v1:0",
//       contentType: "application/json",
//       accept: "application/json",
//       body: JSON.stringify({
//         messages: [
//           {
//             role: "user",
//             content: `
// Necesito que me ayudes a clasificar los siguientes textos (separados con ",") a tu criterio y base de conocimientos: ${prompt}
// Las posibles categorías son: 
// alimentacion_y_bebidas
// ropa_y_accesorios
// electronica_y_tecnologia
// hogar_y_jardin
// salud_y_belleza
// transporte
// entretenimiento_y_ocio
// viajes
// servicios_financieros
// educacion
// suscripciones
// donaciones_y_caridad
// transacciones_no_relevantes

// Por favor, clasifica los textos en el siguiente formato:
// [
// {
// "text": "texto1",
// "category": "categoria1"
// },
// {
// "text": "texto2",
// "category": "categoria2"
// },
// ...
// }]

// No incluyas nada mas de lo que se te pide, y asegurate de que cada texto tenga una categoria asignada. Gracias por tu ayuda!
//           `,

//           },
//         ],
//         max_tokens: 2000,
//         temperature: 0.5,
//       }),
//     };
//     const command = new InvokeModelCommand(input);
//     return command
//   }

//   try {
//     const client = new BedrockRuntimeClient({ region: "us-east-1" });
//     const undecodedResponse = await client.send(commandInvokeCategorize());
//     const response = JSON.parse(Buffer.from(undecodedResponse.body).toString("utf8"))
//     const data = JSON.parse(response.choices[0].message.content);
//     console.log("Response from model:", response);
//     console.log("Categorized data:", data);
//     return {
//       response: response,
//       categorizedData: data,
//     };



//   } catch (error) {
//     console.error("Error invoking model:", error);
//     throw error;
//   }



// };

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
// Necesito que me ayudes a clasificar los textos (separados con ",") a tu criterio y base de conocimientos
// Las posibles categorías son: 
// alimentacion_y_bebidas
// ropa_y_accesorios
// electronica_y_tecnologia
// hogar_y_jardin
// salud_y_belleza
// transporte
// entretenimiento_y_ocio
// viajes
// servicios_financieros
// educacion
// suscripciones
// donaciones_y_caridad
// transacciones_no_relevantes

// Por favor, clasifica los textos en el siguiente formato:
// [{"text": "texto1","category": "categoria1"},{"text": "texto2","category": "categoria2"},...}]

// No incluyas nada mas de lo que se te pide, y asegurate de que cada texto tenga una categoria asignada. Gracias por tu ayuda!
//           `,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    }),
  } as InvokeModelCommandInput;

  try {
    const command = new InvokeModelCommand(input);

    const response = await client.send(command);

    // Parse the response and return the generated haiku
    const data = JSON.parse(Buffer.from(response.body).toString());

    return {
      categorizedData: JSON.parse(data.content[0].text)
    }
  } catch (error) {
    return {
      error: JSON.stringify(error)
    }
  }


};