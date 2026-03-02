import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const LOG_PATH = path.join(DATA_DIR, "notifications-log.json");

const DEFAULT_LOG = {
  lastNotifiedVideoKey: "",
  lastNotifiedAt: "",
  lastNotifiedVideoTitle: "",
  lastNotifiedVideoUrl: ""
};

function ensureLogFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOG_PATH)) {
    fs.writeFileSync(LOG_PATH, JSON.stringify(DEFAULT_LOG, null, 2));
  }
}

export function readNotifyLog() {
  ensureLogFile();
  try {
    const content = fs.readFileSync(LOG_PATH, "utf8");
    const parsed = JSON.parse(content);
    return { ...DEFAULT_LOG, ...parsed };
  } catch {
    return { ...DEFAULT_LOG };
  }
}

export function writeNotifyLog(nextLog) {
  ensureLogFile();
  fs.writeFileSync(LOG_PATH, JSON.stringify({ ...DEFAULT_LOG, ...nextLog }, null, 2));
}

export function getNotifyLogPath() {
  ensureLogFile();
  return LOG_PATH;
}
