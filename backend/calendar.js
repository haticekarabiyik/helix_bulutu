import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

function hasGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  return Boolean(
    clientId &&
      clientSecret &&
      redirectUri &&
      !clientId.startsWith("your-") &&
      !clientSecret.startsWith("your-")
  );
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function buildReviewEvent(topic, reason = "quiz_wrong") {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(20, 0, 0, 0);

  return {
    summary: `Helix tekrar: ${topic}`,
    description:
      reason === "quiz_wrong"
        ? `${topic} konusu icin quiz sonucuna gore otomatik tekrar oturumu.`
        : `${topic} konusu icin planlanan tekrar oturumu.`,
    start: start.toISOString(),
    end: addMinutes(start, 30).toISOString(),
  };
}

function validateEvent(event) {
  if (!event?.summary || !event?.start || !event?.end) {
    return "summary, start ve end alanlari gerekli";
  }

  const start = new Date(event.start);
  const end = new Date(event.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "start ve end gecerli tarih olmali";
  }

  if (end <= start) {
    return "end tarihi start tarihinden sonra olmali";
  }

  return null;
}

async function insertCalendarEvent(accessToken, event) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { dateTime: event.start },
      end: { dateTime: event.end },
    },
  });

  return { eventId: response.data.id, htmlLink: response.data.htmlLink };
}

router.get("/google/auth-url", (_req, res) => {
  if (!hasGoogleConfig()) {
    return res.status(500).json({ error: "Google Calendar env ayarlari eksik" });
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  res.json({ url });
});

router.get("/google/callback", async (req, res) => {
  if (!hasGoogleConfig()) {
    return res.status(500).json({ error: "Google Calendar env ayarlari eksik" });
  }

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "No code" });

  try {
    const { tokens } = await oauth2Client.getToken(String(code));
    const frontendUrl = new URL(process.env.FRONTEND_URL || "http://localhost:5173");

    if (tokens.access_token) {
      frontendUrl.searchParams.set("googleAccessToken", tokens.access_token);
    }

    if (tokens.expiry_date) {
      frontendUrl.searchParams.set("googleTokenExpiresAt", String(tokens.expiry_date));
    }

    res.redirect(frontendUrl.toString());
  } catch (err) {
    res.status(500).json({ error: "Google token alinamadi", details: String(err) });
  }
});

router.post("/calendar/event", async (req, res) => {
  const { accessToken, event } = req.body;
  if (!accessToken) return res.status(401).json({ error: "Google access token gerekli" });
  const validationError = validateEvent(event);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const calendarEvent = await insertCalendarEvent(accessToken, event);
    res.json(calendarEvent);
  } catch (err) {
    res.status(500).json({ error: "Takvim API hatasi", details: String(err) });
  }
});

router.post("/study-plan/review-event", async (req, res) => {
  const { accessToken, topic, reason } = req.body;
  if (!accessToken) return res.status(401).json({ error: "Google access token gerekli" });
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "topic alani gerekli" });
  }

  const event = buildReviewEvent(topic.slice(0, 80), reason);

  try {
    const calendarEvent = await insertCalendarEvent(accessToken, event);
    res.json({ ...calendarEvent, event });
  } catch (err) {
    res.status(500).json({ error: "Takvim API hatasi", details: String(err) });
  }
});

export default router;
