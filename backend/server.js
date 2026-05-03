import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Horizon, Networks } from "@stellar/stellar-sdk";


import calendarRouter from "./calendar.js";
import web3Router from "./web3.js";
import coursesRouter from "./courses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(express.json());


app.use("/api", calendarRouter);
app.use("/api", web3Router);
app.use("/api", coursesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, network: "testnet", timestamp: new Date().toISOString() });
});

app.get("/api/account/:address", async (req, res) => {
  const { address } = req.params;

  if (!/^G[A-Z2-7]{55}$/.test(address)) {
    return res.status(400).json({ error: "Geçersiz Stellar adresi" });
  }

  try {
    const account = await horizon.loadAccount(address);
    const xlm = account.balances.find((b) => b.asset_type === "native");
    const tokens = account.balances.filter((b) => b.asset_type !== "native");

    return res.json({
      address,
      xlmBalance: xlm?.balance ?? "0",
      sequence: account.sequence,
      subentryCount: account.subentry_count,
      tokens: tokens.map((t) => ({
        asset: `${t.asset_code}:${t.asset_issuer}`,
        balance: t.balance,
      })),
      networkPassphrase: Networks.TESTNET,
    });
  } catch (err) {
    if (err?.response?.status === 404) {
      return res.status(404).json({ error: "Hesap bulunamadı (fonlanmamış)" });
    }
    console.error(err);
    return res.status(500).json({ error: "Horizon bağlantı hatası" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend: http://localhost:${PORT}`);
  console.log(`Health:  http://localhost:${PORT}/api/health`);
});
