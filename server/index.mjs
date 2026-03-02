import http from "node:http";
import dotenv from "dotenv";
import { upsertSubscriber, validateEmail } from "../scripts/lib/subscribers.js";

dotenv.config();

const PORT = Number(process.env.PORT || process.env.SUBSCRIBE_PORT || 8787);
const DEFAULT_ALLOWED_ORIGINS = [
  "https://dailybayan.live",
  "https://www.dailybayan.live",
  "http://localhost:5173"
];
const ALLOWED_ORIGINS = String(process.env.SUBSCRIBE_ALLOWED_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function getAllowedOrigins() {
  if (ALLOWED_ORIGINS.length) {
    return ALLOWED_ORIGINS;
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

function resolveCorsOrigin(requestOrigin) {
  const allowedOrigins = getAllowedOrigins();
  if (!requestOrigin) {
    return allowedOrigins[0] || "*";
  }
  if (allowedOrigins.includes("*")) {
    return "*";
  }
  if (allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }
  return "";
}

function setCorsHeaders(res, requestOrigin) {
  const allowedOrigin = resolveCorsOrigin(requestOrigin);
  if (!allowedOrigin) {
    return false;
  }
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  return true;
}

function sendJson(res, statusCode, payload, requestOrigin) {
  setCorsHeaders(res, requestOrigin);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const requestOrigin = String(req.headers.origin || "");
  const isCorsAllowed = setCorsHeaders(res, requestOrigin);

  if (req.method === "OPTIONS") {
    if (!isCorsAllowed && requestOrigin) {
      res.writeHead(403);
      res.end();
      return;
    }
    res.writeHead(204);
    res.end();
    return;
  }

  if (!isCorsAllowed && requestOrigin) {
    sendJson(res, 403, { error: "Origin is not allowed for this API." }, requestOrigin);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true }, requestOrigin);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/subscribe") {
    try {
      const rawBody = await readRequestBody(req);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const email = String(body.email || "").trim();

      if (!validateEmail(email)) {
        sendJson(res, 400, { error: "Please enter a valid email address." }, requestOrigin);
        return;
      }

      const result = upsertSubscriber(email);
      const messageByStatus = {
        added: "Thanks. You are subscribed for updates.",
        reactivated: "Welcome back. Your subscription is active again.",
        exists: "You are already subscribed."
      };

      sendJson(
        res,
        200,
        {
          status: result.status,
          message: messageByStatus[result.status] || "Subscription updated."
        },
        requestOrigin
      );
      return;
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Failed to subscribe." }, requestOrigin);
      return;
    }
  }

  sendJson(res, 404, { error: "Not found" }, requestOrigin);
});

server.listen(PORT, () => {
  console.log(`Subscribe API listening on http://localhost:${PORT}`);
});
