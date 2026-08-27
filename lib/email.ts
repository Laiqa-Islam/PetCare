import nodemailer from "nodemailer";

type EmailPayload = { to: string; subject: string; text: string };

function getMailtrapTransport() {
  const host = process.env.MAILTRAP_HOST;
  const port = Number(process.env.MAILTRAP_PORT || 2525);
  const user = process.env.MAILTRAP_USER;
  const pass = process.env.MAILTRAP_PASS;

  if (!host || !user || !pass || !Number.isInteger(port)) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, text }: EmailPayload) {
  const transport = getMailtrapTransport();
  const from = process.env.EMAIL_FROM;
  if (!transport || !from) return { delivered: false, reason: "Mailtrap SMTP is not configured" };

  try {
    const info = await transport.sendMail({ from, to, subject, text });
    return { delivered: true, messageId: info.messageId };
  } catch (error) {
    return { delivered: false, reason: error instanceof Error ? error.message : "Email delivery failed" };
  }
}
