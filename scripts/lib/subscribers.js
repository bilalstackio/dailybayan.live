import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_DIR = path.resolve(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.xlsx");
const SHEET_NAME = "subscribers";

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function createWorkbookWithHeaders() {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet([["email", "subscribed_at", "status"]]);
  xlsx.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
  xlsx.writeFile(workbook, SUBSCRIBERS_FILE);
}

function ensureWorkbook() {
  ensureDataDir();

  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    createWorkbookWithHeaders();
    return;
  }

  const workbook = xlsx.readFile(SUBSCRIBERS_FILE);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    const worksheet = xlsx.utils.aoa_to_sheet([["email", "subscribed_at", "status"]]);
    xlsx.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);
    xlsx.writeFile(workbook, SUBSCRIBERS_FILE);
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validateEmail(email) {
  return EMAIL_PATTERN.test(normalizeEmail(email));
}

function readWorkbookRows() {
  ensureWorkbook();
  const workbook = xlsx.readFile(SUBSCRIBERS_FILE);
  const worksheet = workbook.Sheets[SHEET_NAME];
  return xlsx.utils.sheet_to_json(worksheet, { defval: "" });
}

function writeWorkbookRows(rows) {
  ensureWorkbook();
  const workbook = xlsx.readFile(SUBSCRIBERS_FILE);
  const worksheet = xlsx.utils.json_to_sheet(rows, { header: ["email", "subscribed_at", "status"] });
  workbook.Sheets[SHEET_NAME] = worksheet;
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    workbook.SheetNames.push(SHEET_NAME);
  }
  xlsx.writeFile(workbook, SUBSCRIBERS_FILE);
}

export function getSubscribers() {
  return readWorkbookRows().map((row) => ({
    email: normalizeEmail(row.email),
    subscribed_at: String(row.subscribed_at || ""),
    status: row.status === "unsubscribed" ? "unsubscribed" : "active"
  }));
}

export function getActiveSubscriberEmails() {
  return getSubscribers()
    .filter((subscriber) => subscriber.email && subscriber.status === "active")
    .map((subscriber) => subscriber.email);
}

export function upsertSubscriber(rawEmail) {
  const email = normalizeEmail(rawEmail);
  if (!validateEmail(email)) {
    throw new Error("Invalid email address.");
  }

  const rows = getSubscribers();
  const existingIndex = rows.findIndex((row) => row.email === email);
  const subscribedAt = new Date().toISOString();

  if (existingIndex === -1) {
    rows.push({ email, subscribed_at: subscribedAt, status: "active" });
    writeWorkbookRows(rows);
    return { status: "added", email };
  }

  const existing = rows[existingIndex];
  if (existing.status !== "active") {
    rows[existingIndex] = { ...existing, status: "active", subscribed_at: subscribedAt };
    writeWorkbookRows(rows);
    return { status: "reactivated", email };
  }

  return { status: "exists", email };
}

export function getSubscribersFilePath() {
  ensureWorkbook();
  return SUBSCRIBERS_FILE;
}
