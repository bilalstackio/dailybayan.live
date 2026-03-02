import { getActiveSubscriberEmails } from "./lib/subscribers.js";
import { sendEmail } from "./lib/mailer.js";
import { readNotifyLog, writeNotifyLog } from "./lib/notifyLog.js";
import { buildVideoKey, getLatestTodayBayan } from "./lib/videos.js";

function buildSubject(day) {
  if (day) {
    return `New Today's Bayan - Ramadan Day ${day}`;
  }
  return "New Today's Bayan Update";
}

function buildMessage(latest) {
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  return [
    "Assalamu Alaikum,",
    "",
    "A new Today's Bayan video is now available.",
    "",
    `Title: ${latest.video.title}`,
    `Watch: ${latest.video.youtubeUrl}`,
    `Website: ${siteUrl}`,
    "",
    "JazakAllahu Khair"
  ].join("\n");
}

async function main() {
  const latest = getLatestTodayBayan();
  const videoKey = buildVideoKey(latest.video);

  if (!videoKey) {
    throw new Error("Could not determine a unique key for latest Today’s Bayan video.");
  }

  const notifyLog = readNotifyLog();
  if (notifyLog.lastNotifiedVideoKey === videoKey) {
    console.log("No notification sent: latest Today’s Bayan already notified.");
    return;
  }

  const recipients = getActiveSubscriberEmails();
  if (!recipients.length) {
    console.log("No active subscribers found. Notification skipped.");
    return;
  }

  const subject = buildSubject(latest.day);
  const text = buildMessage(latest);

  const results = await Promise.allSettled(
    recipients.map((recipientEmail) =>
      sendEmail({
        to: recipientEmail,
        subject,
        text
      })
    )
  );

  const sentCount = results.filter((result) => result.status === "fulfilled").length;
  const failed = results
    .map((result, index) => ({ result, email: recipients[index] }))
    .filter((entry) => entry.result.status === "rejected");

  if (sentCount > 0) {
    writeNotifyLog({
      lastNotifiedVideoKey: videoKey,
      lastNotifiedAt: new Date().toISOString(),
      lastNotifiedVideoTitle: latest.video.title,
      lastNotifiedVideoUrl: latest.video.youtubeUrl
    });
  }

  console.log(`Sent updates: ${sentCount}/${recipients.length}`);

  if (failed.length) {
    failed.forEach((entry) => {
      console.error(`Failed to send to ${entry.email}: ${entry.result.reason?.message || "Unknown error"}`);
    });
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
