import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { SESv2Client, SendEmailCommand, CreateEmailIdentityCommand } from "@aws-sdk/client-sesv2";
const client = new SESv2Client({ region: process.env.REGION });
async function sendEmail(subject: string, body: string) {
  const input = {
    // SendEmailRequest
    FromEmailAddress: "arturo@molaca.com",
    // FromEmailAddressIdentityArn: "STRING_VALUE",
    Destination: {
      // Destination
      ToAddresses: [
        // EmailAddressList
        "velez.arturo@gmail.com",
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

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});



export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);

    if (record.eventName === "INSERT") {
      if (record.eventName === "INSERT") {
        try {

           logger.info(`Sending email`);    
          const sesResult = await sendEmail(
            "New Transacción",
            JSON.stringify(record.dynamodb?.NewImage)
          );
          logger.info(`Sending email result: ${JSON.stringify(sesResult)}`);

          // const input = { // CreateEmailIdentityRequest
          //   EmailIdentity: "arturo.velez@wallia.io", // required
          //   Tags: [ // TagList
          //     { // Tag
          //       Key: "project", // required
          //       Value: "capital", // required
          //     },
          //   ],

          //   ConfigurationSetName: "molaca-config-set",
          // };
          // const command = new CreateEmailIdentityCommand(input);
          // const response = await client.send(command);
          // logger.info(`Sending id request: ${JSON.stringify(response)}`);
          
        } catch (error) {
          console.error("Error envio email", error);
        }
      }
      // business logic to process new records
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
    }
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
    batchItemFailures: [],
  };
};
