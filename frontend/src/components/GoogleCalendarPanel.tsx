import { useEffect, useMemo, useState } from "react";
import styles from "./GoogleCalendarPanel.module.css";

type CalendarEventResponse = {
  eventId: string;
  htmlLink?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "helix:google-calendar-token";
const TOKEN_EXPIRY_KEY = "helix:google-calendar-token-expires-at";

const reviewTopics = [
  "Vektorel Toplama",
  "Coulomb Yasasi",
  "Elektrik Alani",
  "Elektrik Potansiyeli",
  "Ohm Yasasi",
  "Elektrik Devreleri",
  "Sigaclar",
  "Newton'un 2. Yasasi",
  "Is ve Enerji",
  "Momentum",
  "Basinc",
  "Dalgalar",
  "Optik",
  "Termodinamik",
  "Manyetizma",
  "Karma Fizik Denemesi",
];

function makeStudyEvent() {
  const start = new Date(Date.now() + 10 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    summary: "Helix calisma oturumu",
    description: "Helix uygulamasindan eklenen test calisma etkinligi.",
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

type GoogleCalendarPanelProps = {
  suggestedTopic?: string | null;
};

export default function GoogleCalendarPanel({ suggestedTopic }: GoogleCalendarPanelProps) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [status, setStatus] = useState<"idle" | "connecting" | "creating">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [calendarLink, setCalendarLink] = useState<string | null>(null);
  const [reviewTopic, setReviewTopic] = useState(reviewTopics[0]);

  const isConnected = useMemo(() => {
    if (!accessToken) return false;

    const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRY_KEY));
    return !expiresAt || expiresAt > Date.now();
  }, [accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("googleAccessToken");
    const expiresAt = params.get("googleTokenExpiresAt");

    if (!token) return;

    localStorage.setItem(TOKEN_KEY, token);
    if (expiresAt) localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
    setAccessToken(token);
    setMessage("Google Calendar baglantisi hazir.");

    params.delete("googleAccessToken");
    params.delete("googleTokenExpiresAt");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, []);

  useEffect(() => {
    if (suggestedTopic && reviewTopics.includes(suggestedTopic)) {
      setReviewTopic(suggestedTopic);
      setMessage(`${suggestedTopic} icin tekrar planlama onerisi hazir.`);
    }
  }, [suggestedTopic]);

  const connectGoogle = async () => {
    setStatus("connecting");
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/google/auth-url`);
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Google baglanti adresi alinamadi.");
      }

      const data = (await response.json()) as { url: string };
      window.location.href = data.url;
    } catch (err) {
      setStatus("idle");
      setMessage(err instanceof Error ? err.message : "Google baglantisi baslatilamadi.");
    }
  };

  const postCalendarRequest = async (path: string, body: unknown, successMessage: string) => {
    if (!accessToken) return;

    setStatus("creating");
    setMessage(null);
    setCalendarLink(null);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error ?? "Takvim etkinligi eklenemedi.");
      }

      const data = (await response.json()) as CalendarEventResponse;
      setCalendarLink(data.htmlLink ?? null);
      setMessage(successMessage);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Takvim etkinligi eklenemedi.");
    } finally {
      setStatus("idle");
    }
  };

  const createEvent = () => {
    postCalendarRequest(
      "/calendar/event",
      {
        accessToken,
        event: makeStudyEvent(),
      },
      "Test etkinligi Google Calendar'a eklendi."
    );
  };

  const scheduleReview = () => {
    postCalendarRequest(
      "/study-plan/review-event",
      {
        accessToken,
        topic: reviewTopic,
        reason: "quiz_wrong",
      },
      `${reviewTopic} icin yarina tekrar etkinligi eklendi.`
    );
  };

  const disconnectGoogle = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setAccessToken(null);
    setCalendarLink(null);
    setMessage("Google Calendar baglantisi kaldirildi.");
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Google Calendar</p>
          <h2>Calisma Takvimi</h2>
        </div>
        {isConnected ? (
          <button className={styles.secondaryButton} onClick={disconnectGoogle}>
            Baglantiyi Kes
          </button>
        ) : (
          <button className={styles.primaryButton} onClick={connectGoogle} disabled={status === "connecting"}>
            {status === "connecting" ? "Baglaniyor..." : "Google'a Baglan"}
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={createEvent} disabled={!isConnected || status === "creating"}>
          {status === "creating" ? "Ekleniyor..." : "Test Etkinligi Ekle"}
        </button>
        <span className={isConnected ? styles.connected : styles.disconnected}>
          {isConnected ? "Bagli" : "Bagli degil"}
        </span>
      </div>

      <div className={styles.reviewBox}>
        <select value={reviewTopic} onChange={(event) => setReviewTopic(event.target.value)}>
          {reviewTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <button className={styles.secondaryButton} onClick={scheduleReview} disabled={!isConnected || status === "creating"}>
          Yarina Tekrar Planla
        </button>
      </div>

      {message && <div className={styles.notice}>{message}</div>}
      {calendarLink && (
        <a className={styles.calendarLink} href={calendarLink} target="_blank" rel="noreferrer">
          Google Calendar'da Ac
        </a>
      )}
    </section>
  );
}
