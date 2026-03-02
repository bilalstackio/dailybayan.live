import { sendEmail } from "./lib/mailer.js";

function getFlagValue(flag) {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return "";
  }
  return process.argv[index + 1];
}

async function main() {
  const email = getFlagValue("--email");
  if (!email) {
    throw new Error("Usage: npm run notify:test -- --email user@example.com");
  }

  await sendEmail({
    to: email,
    subject: "Daily Bayan notification test",
    text: "This is a test email from your Daily Bayan notification system."
  });

  console.log(`Test email sent to ${email}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
