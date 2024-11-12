import { type Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";
import { getTransaccion, listRecompensas } from "./graphql/queries";
import { configureAmplify } from "./configureAmplify";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
const client = new SESv2Client({ region: process.env.REGION });

const clientBedrock = new BedrockRuntimeClient();

async function getRecomendacion(recompensas:string, transaccion: string) {
  const prompt = `Recomienda una recompensa relacionada a la transacción "${transaccion}"`;
  let systemText = "Eres un agente de servicio al cliente especializado en recompensas para tarjetas de crédito de viajeros frecuentes. Un cliente ha realizado una transacción y se le recomendará una lista de recompensas." ;
  systemText += `Las recompensas disponibles son: ${recompensas}`;
  systemText += "El cliente ha realizado una transacción por el concepto que se te entrega. Genera el mensaje para un correo electrónico para avisar de 3 recompensas recomendadas.";
  const input: InvokeModelCommandInput = {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      system: systemText,
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
  };

  const command = new InvokeModelCommand(input);
  const response = await clientBedrock.send(command);
  const data = JSON.parse(Buffer.from(response.body).toString());

  return data.content[0].text;
}
async function sendEmail(subject: string, body: string, email: string) {
  const input = {
    // SendEmailRequest
    FromEmailAddress: "capital@molaca.com",
    // FromEmailAddressIdentityArn: "STRING_VALUE",
    Destination: {
      // Destination
      ToAddresses: [
        // EmailAddressList
        email,
      ],
    },
    ReplyToAddresses: ["arturo@molaca.com"],
    Content: {
      // EmailContent
      Simple: {
        // Message
        Subject: {
          // Content
          Data: subject, // required
          // Charset: "STRING_VALUE",
        },
        Body: {
          // Body
          Text: {
            Data: `${body}`, // required
            // Charset: "STRING_VALUE",
          },
          Html: {
            Data: `${body}`, // required
            // Charset: "STRING_VALUE",
          },
        },
      },
    },
  };

  console.log({ input });
  const command = new SendEmailCommand(input);
  const response = await client.send(command);
  console.log({ response });

  return response;
}

export const handler = async (event: {
  transaccionId: string;
  userEmail: string;
}) => {
  console.log("event", event);
  console.log("transaccionId", event.transaccionId);
  console.log("userEmail", event.userEmail);
  await configureAmplify();
  const client = generateClient<Schema>({
    authMode: "iam",
  });
  console.log("client", client);
  const { data } = await client.graphql({
    query: getTransaccion,
    variables: { id: event.transaccionId },
  });
  console.log("data", data);
  const recompensas = await client.graphql({
    query: listRecompensas,

    // variables: {
    //   filter: { categoriaId: { eq: data?.getTransaccion?.categoriaId } },
    // },
  });
  console.log("recompensas", recompensas);
  const nombreRecompensas = recompensas.data?.listRecompensas?.items.map(
    (recompensa) => recompensa?.nombre
  );
  console.log("nombreRecompensas", nombreRecompensas);
  const recomendacion = await getRecomendacion(
    nombreRecompensas.join(", "),
    data?.getTransaccion?.concepto || ""
  );
  // console.log("recompensas", recompensas.data?.listRecompensas?.items);
  //console.log("the data from the request", data);

  try {
    await sendEmail(
      "Recomendación de recompensas",
      `${recomendacion}`,
      event.userEmail
    );
  } catch (error) {
    console.error("Error al enviar el correo", error);
  }
  return "Hello World";
};
