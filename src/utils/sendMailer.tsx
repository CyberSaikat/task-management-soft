import {Resend} from "resend";

const API_KEY = process.env.RESEND_API_KEY;

export default async function SendMailer(
  email: string,
  subject: string,
  html: string,
) {
  const resend = new Resend(API_KEY);

  return await resend.emails.send({
    from: "Codes Engineer <noreply@codes.engineer>",
    replyTo: "saikatroydot@gmail.com",
    to: email,
    subject: subject,
    html: html,
  });
}
