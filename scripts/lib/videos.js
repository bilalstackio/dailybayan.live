import fs from "node:fs";
import path from "node:path";

const VIDEOS_PATH = path.resolve(process.cwd(), "public", "videos.json");

function readVideosJson() {
  const fileContent = fs.readFileSync(VIDEOS_PATH, "utf8");
  return JSON.parse(fileContent);
}

function extractDay(text) {
  const value = String(text || "");
  const match =
    value.match(/ramadan\s*(\d{1,2})/i) ||
    value.match(/(\d{1,2})\s*ramadan/i) ||
    value.match(/day\s*(\d{1,2})/i);
  return match ? Number(match[1]) : null;
}

export function getLatestTodayBayan() {
  const content = readVideosJson();
  const dailyBayanSection = (content.sections || []).find((section) => section.id === "dailybayan");

  if (!dailyBayanSection) {
    throw new Error('No section with id "dailybayan" found in public/videos.json.');
  }

  const latestVideo = (dailyBayanSection.videos || [])[0];
  if (!latestVideo || !latestVideo.youtubeUrl) {
    throw new Error('No videos found in "dailybayan" section.');
  }

  const day = extractDay(latestVideo.title) || extractDay(dailyBayanSection.title);

  return {
    sectionId: dailyBayanSection.id,
    sectionTitle: dailyBayanSection.title || "Today's Bayan",
    day,
    video: {
      id: latestVideo.id || "",
      title: latestVideo.title || "Today's Bayan",
      youtubeUrl: latestVideo.youtubeUrl
    }
  };
}

export function buildVideoKey(video) {
  return String(video?.id || video?.youtubeUrl || video?.title || "").trim();
}
