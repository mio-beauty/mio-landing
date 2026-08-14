/* global process */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import contactHandler from "./api/contact.js";

function contactApiDevMiddleware(env) {
  return {
    name: "contact-api-dev-middleware",
    configureServer(server) {
      if (env.TELEGRAM_BOT_TOKEN) {
        process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
      }
      if (env.TELEGRAM_CHAT_ID) {
        process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
      }

      server.middlewares.use("/api/contact", (req, res, next) => {
        if (req.method !== "POST") return contactHandler(req, res);

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            req.body = JSON.parse(body || "{}");
            await contactHandler(req, res);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
          }
        });
        req.on("error", next);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [contactApiDevMiddleware(env), react(), tailwindcss()],
  server: {
    host: true, 
    port: 5173,
  },
  };
});
