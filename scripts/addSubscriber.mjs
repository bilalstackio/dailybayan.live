import { upsertSubscriber } from "./lib/subscribers.js";

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
    throw new Error("Usage: npm run subscribe:add -- --email user@example.com");
  }

  const result = upsertSubscriber(email);
  if (result.status === "added") {
    console.log(`Subscriber added: ${result.email}`);
    return;
  }

  if (result.status === "reactivated") {
    console.log(`Subscriber reactivated: ${result.email}`);
    return;
  }

  console.log(`Subscriber already active: ${result.email}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
