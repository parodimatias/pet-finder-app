import * as sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail(msg: { to; from; subject; text; html }) {
  try {
    const response = sgMail.send(msg);
    console.log("Email sent");
    return response;
  } catch (error) {
    console.error(error);
  }
}
