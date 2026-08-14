/* global process */

const TELEGRAM_API_BASE = "https://api.telegram.org/bot";

function sendJson(res, statusCode, payload) {
  if (typeof res.status === "function") {
    return res.status(statusCode).json(payload);
  }

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const { name, phone, problem } = req.body ?? {};
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedPhone = typeof phone === "string" ? phone.trim() : "";
  const normalizedProblem = typeof problem === "string" ? problem.trim() : "";

  if (!normalizedName || !normalizedPhone) {
    return sendJson(res, 400, { error: "Name and phone are required" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram contact form environment variables are missing");
    return sendJson(res, 500, { error: "Telegram integration is not configured" });
  }

  const lines = [`Ism: ${normalizedName}`, `Telefon: ${normalizedPhone}`];
  if (normalizedProblem) lines.push(`Muammo: ${normalizedProblem}`);

  try {
    const telegramResponse = await fetch(
      `${TELEGRAM_API_BASE}${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
        }),
      },
    );

    const telegramResult = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram rejected contact form", telegramResult);
      return sendJson(res, 502, { error: "Telegram message could not be sent" });
    }

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Telegram contact form request failed", error);
    return sendJson(res, 502, { error: "Telegram message could not be sent" });
  }
}
