import express from "express";

const router = express.Router();

// Kullanıcı cüzdan adresi ile giriş (Web3 mantığı)
router.post("/web3/login", async (req, res) => {
  const { address } = req.body;
  if (!/^G[A-Z2-7]{55}$/.test(address)) {
    return res.status(400).json({ error: "Geçersiz Stellar adresi" });
  }
  // Burada backend, kullanıcıya bir nonce dönebilir, imza doğrulama yapılabilir.
  res.json({ ok: true, address });
});

// Kullanıcıya özel veri kaydetme (örnek: notlar, takvim ID'leri vs.)
const userData = {};

router.post("/web3/userdata", (req, res) => {
  const { address, data } = req.body;
  if (!/^G[A-Z2-7]{55}$/.test(address)) {
    return res.status(400).json({ error: "Geçersiz adres" });
  }
  userData[address] = { ...(userData[address] || {}), ...data };
  res.json({ ok: true });
});

router.get("/web3/userdata/:address", (req, res) => {
  const { address } = req.params;
  if (!/^G[A-Z2-7]{55}$/.test(address)) {
    return res.status(400).json({ error: "Geçersiz adres" });
  }
  res.json(userData[address] || {});
});

export default router;
