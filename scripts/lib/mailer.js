import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function createTransport() {
  const host = requiredEnv("SMTP_HOST");
  const port = Number(requiredEnv("SMTP_PORT"));
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function sendEmail({ to, subject, text }) {
  const from = requiredEnv("MAIL_FROM");
  const transporter = createTransport();
  await transporter.sendMail({
    from,
    to,
    subject,
    text
  });
}
