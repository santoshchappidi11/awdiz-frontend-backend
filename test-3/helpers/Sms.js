import twilio from "twilio";

export const sendTwilioMessage = async (toNumber, messageBody) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNTSID,
      process.env.TWILIO_AUTHTOKEN
    );

    const message = client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_FROM_NUMBER,
      to: `+91${toNumber}`,
    });
    return message.sid;
  } catch (error) {
    throw new Error("Failed to send Twilio message!");
  }
};
