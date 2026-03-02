import http from "node:http";
import dotenv from "dotenv";
import { upsertSubscriber, validateEmail } from "../scripts/lib/subscribers.js";

dotenv.config();

const PORT = Number(process.env.SUBSCRIBE_PORT || 8787);
const ORIGIN = process.env.SUBSCRIBE_ALLOWED_ORIGIN || "*";

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
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

  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/subscribe") {
    try {
      const rawBody = await readRequestBody(req);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const email = String(body.email || "").trim();

      if (!validateEmail(email)) {
        sendJson(res, 400, { error: "Please enter a valid email address." });
        return;
      }

      const result = upsertSubscriber(email);
      const messageByStatus = {
        added: "Thanks. You are subscribed for updates.",
        reactivated: "Welcome back. Your subscription is active again.",
        exists: "You are already subscribed."
      };

      sendJson(res, 200, {
        status: result.status,
        message: messageByStatus[result.status] || "Subscription updated."
      });
      return;
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Failed to subscribe." });
      return;
    }
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Subscribe API listening on http://localhost:${PORT}`);
});
