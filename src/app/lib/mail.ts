import nodemailer from "nodemailer";

/*
 * Sends the site's emails from hello@pradipta.online through Titan's SMTP
 * server, so visitors see mail from the same domain as the website. WordPress
 * only stores the requests.
 *
 * Needs SMTP_USER (the mailbox, e.g. hello@pradipta.online) and SMTP_PASSWORD.
 * SMTP_HOST and SMTP_PORT default to Titan's (smtp.titan.email, 465).
 */

export const SENDER_NAME = "Pradipta Das";

export type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: { name: string; address: string };
  attachments?: { filename: string; content: Buffer; contentType: string }[];
};

let transport: ReturnType<typeof nodemailer.createTransport> | undefined;

function getTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) throw new Error("SMTP_USER and SMTP_PASSWORD must be set to send email");

  const port = Number(process.env.SMTP_PORT) || 465;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.titan.email",
    port,
    // 465 is TLS from the start; 587 upgrades with STARTTLS.
    secure: port === 465,
    auth: { user, pass },
    // A form shouldn't hang on a slow mail server.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transport;
}

// The mailbox the site sends from, which is also where notifications go.
export const siteMailbox = () => process.env.SMTP_USER ?? "";

// Header values from visitor input, kept to one short line.
export const oneLine = (value: string, max = 120) => value.replace(/[\r\n<>"]+/g, " ").trim().slice(0, max);

export async function sendMail(mail: Mail): Promise<void> {
  await getTransport().sendMail({
    from: { name: SENDER_NAME, address: siteMailbox() },
    to: mail.to,
    replyTo: mail.replyTo,
    subject: oneLine(mail.subject, 200),
    text: mail.text,
    attachments: mail.attachments,
  });
}
