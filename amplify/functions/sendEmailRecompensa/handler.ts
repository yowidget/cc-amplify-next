import { SESv2Client, SendEmailCommand, CreateEmailIdentityCommand } from "@aws-sdk/client-sesv2";
const client = new SESv2Client({ region: process.env.REGION });

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
  try {
    await sendEmail("Recompensa", `Has recibido una recibido una recompensa por la transacción ${event.transaccionId}`, event.userEmail);
  } catch (error) {
    console.error("Error al enviar el correo", error);
  }
  return "Hello World";
};
