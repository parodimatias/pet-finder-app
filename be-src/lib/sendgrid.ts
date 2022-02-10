import * as sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendMail(msg: { to; from; subject; text; html }) {
  sgMail
    .send(msg)
    .then((res) => {
      console.log(res);
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
