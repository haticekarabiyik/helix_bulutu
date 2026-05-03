# Helix — Stellar Academic

> **Stellar Academic**: Freighter ile Stellar Testnet’e bağlanan, fizik öğrenme modülleri ve **Satın Alma** akışında **klasik XLM ödemesi (Horizon)** kullanan tam yığın bir örnek uygulama. İsteğe bağlı **Soroban** sözleşme ID’leri `.env` ile açılır; kontratsız kurulum için de akış tasarılmıştır.

---

## İçindekiler

1. [Stellar Nedir?](#1-stellar-nedir)
2. [Blockchain (Blok Zinciri) Nedir?](#2-blockchain-blok-zinciri-nedir)
3. [XLM (Lumen) Nedir?](#3-xlm-lumen-nedir)
4. [Cüzdan (Wallet) Nedir?](#4-cüzdan-wallet-nedir)
5. [Freighter Nedir?](#5-freighter-nedir)
6. [Akıllı Sözleşme Nedir?](#6-akıllı-sözleşme-nedir)
7. [Soroban Nedir?](#7-soroban-nedir)
8. [Stellar Neyle Kodlanır?](#8-stellar-neyle-kodlanır)
9. [Testnet ve Mainnet Farkı](#9-testnet-ve-mainnet-farkı)
10. [Proje Mimarisi](#10-proje-mimarisi)
11. [Windows Kurulumu](#11-windows-kurulumu)
12. [Linux Kurulumu](#12-linux-kurulumu)
13. [Projeyi Çalıştırma](#13-projeyi-çalıştırma)
14. [Akıllı Sözleşmeyi Deploy Etme](#14-akıllı-sözleşmeyi-deploy-etme)
15. [Proje Dosya Yapısı](#15-proje-dosya-yapısı)
16. [API Referansı](#16-api-referansı)
17. [Sık Sorulan Sorular](#17-sık-sorulan-sorular)
18. [Ortam değişkenleri (özeti)](#18-ortam-değişkenleri-özeti)

---

## 1. Stellar Nedir?

**Stellar**, 2014 yılında **Jed McCaleb** ve **Joyce Kim** tarafından kurulan, açık kaynaklı bir **merkeziyetsiz ödeme ağıdır**. Amacı; bankası olmayan insanlara, farklı para birimlerini hızlı ve ucuz şekilde birbirine dönüştürme imkânı sunmaktır.

### Stellar'ı Özel Kılan Nedir?

| Özellik | Stellar | Geleneksel Banka Transferi |
|---|---|---|
| İşlem süresi | ~3-5 saniye | 1-5 iş günü |
| İşlem ücreti | ~0.00001 XLM (neredeyse sıfır) | 5–50 USD |
| Çalışma saati | 7/24 | Mesai saatleri |
| Coğrafi sınır | Yok | Ülkeye göre değişir |
| Aracı | Yok (merkeziyetsiz) | Banka, Swift ağı |

### Stellar'ın Kullanım Alanları

- **Para havalesi:** Yurt dışına ucuz ve hızlı para gönderme
- **Tokenizasyon:** Gayrimenkul, hisse senedi, altın gibi varlıkları dijital token'a çevirme
- **Mikro ödeme:** İçerik üreticilerine küçük miktarlarda ödeme
- **DeFi (Merkeziyetsiz Finans):** Banka olmadan borç verme ve alma
- **Kurumsal ödeme:** MoneyGram, IBM gibi şirketler Stellar altyapısını kullanır

### Stellar Vakfı (SDF)

Stellar'ın gelişimini **Stellar Development Foundation (SDF)** yürütür. SDF kâr amacı gütmeyen bir kuruluştur ve ağın açık ve erişilebilir kalmasını sağlar.

---

## 2. Blockchain (Blok Zinciri) Nedir?

Blockchain'i anlamak için önce klasik bir veritabanı düşünün: Bir banka, "Ali'nin hesabında 1000 TL var" bilgisini kendi sunucusunda saklar. Bankaya güveniriz çünkü o kayıtları yönetir.

**Blockchain'de ise bu kayıt binlerce bilgisayara dağıtılır.** Hiçbir merkezi otorite yoktur.

### Nasıl Çalışır?

```
[İşlem gerçekleşir]
        ↓
[İşlem ağdaki bilgisayarlara yayılır]
        ↓
[Bilgisayarlar (validatörler) işlemi doğrular]
        ↓
[Onaylanan işlem bir "blok"a eklenir]
        ↓
[Blok, zincire eklenir → değiştirilemez]
```

### Blockchain'in Temel Özellikleri

- **Şeffaflık:** Tüm işlemler herkese açık görüntülenebilir
- **Değiştirilemezlik:** Eklenen veri silinemez veya değiştirilemez
- **Merkeziyetsizlik:** Tek bir sunucu değil, binlerce bilgisayar
- **Güven:** Sisteme güvenmek için bir kuruma güvenmek zorunda değilsiniz

### Stellar'ın Konsensüs Mekanizması: SCP

Stellar, işlemleri doğrulamak için **Stellar Consensus Protocol (SCP)** kullanır. Enerji tüketen "madencilik" (Bitcoin'deki gibi) yoktur. Bunun yerine güvenilen validatör düğümleri oylama yaparak işlemleri onaylar. Bu yüzden Stellar çok hızlı ve çevre dostudur.

---

## 3. XLM (Lumen) Nedir?

**XLM**, Stellar ağının yerel kripto para birimidir. "Lumen" olarak da bilinir.

### XLM'nin Görevleri

**1. İşlem Ücreti Ödemek**
Her Stellar işlemi çok küçük bir XLM ücreti gerektirir (0.00001 XLM ≈ 0.000003 USD). Bu ücret spam'i önler.

**2. Minimum Bakiye (Base Reserve)**
Bir Stellar hesabının aktif kalması için en az **1 XLM** bulundurması gerekir. Her ek kayıt (trustline, veri girişi vb.) için +0.5 XLM gerekir. Bu, ağı gereksiz hesaplardan korur.

**3. Köprü Para Birimi**
Örneğin TRY → USD dönüşümünde doğrudan piyasa yoksa, sistem otomatik olarak TRY → XLM → USD yolunu kullanabilir.

### XLM Nasıl Edinilir?

- **Testnet için (ücretsiz):** Friendbot aracılığıyla test XLM alınır
- **Mainnet için:** Binance, Coinbase gibi borsalardan satın alınır

---

## 4. Cüzdan (Wallet) Nedir?

Kripto cüzdanı, klasik bir cüzdandan farklıdır. **Paranın kendisini değil, paranıza erişim anahtarlarınızı saklar.**

### Cüzdanın Bileşenleri

```
┌─────────────────────────────────────────────────────┐
│                    STELLAR HESABI                    │
│                                                     │
│  Açık Anahtar (Public Key):                         │
│  GABC...XYZ  ← Banka hesap numaranız gibi           │
│               Herkesle paylaşabilirsiniz            │
│                                                     │
│  Gizli Anahtar (Secret Key / Private Key):          │
│  SABC...XYZ  ← PIN kodunuz/şifreniz gibi            │
│               KİMSEYLE PAYLAŞMAYIN!                 │
└─────────────────────────────────────────────────────┘
```

### Cüzdan Türleri

| Tür | Örnek | Güvenlik | Kolaylık |
|---|---|---|---|
| **Tarayıcı Eklentisi** | Freighter | Orta | Yüksek |
| **Masaüstü Uygulaması** | Solar Wallet | İyi | Orta |
| **Donanım Cüzdanı** | Ledger | Çok Yüksek | Düşük |
| **Kağıt Cüzdan** | Yazdırılmış anahtar | Çok Yüksek | Çok Düşük |
| **Borsa Cüzdanı** | Binance | Düşük* | Çok Yüksek |

> *Borsa cüzdanlarında özel anahtarınız size ait değildir. "Not your keys, not your coins."

### Cüzdan ile Ne Yapabilirsiniz?

- XLM ve diğer Stellar varlıklarını gönderip alabilirsiniz
- Akıllı sözleşmelerle etkileşime girebilirsiniz
- Token'lara güven limiti (trustline) açabilirsiniz
- İşlemleri imzalayabilirsiniz

---

## 5. Freighter Nedir?

**Freighter**, Stellar ağı için geliştirilmiş ücretsiz bir **tarayıcı cüzdan eklentisidir**. MetaMask'ın Ethereum için yaptığını Freighter, Stellar için yapar.

### Freighter'ın Özellikleri

- Chrome, Firefox ve Brave tarayıcılarında çalışır
- Birden fazla hesap yönetimi
- Testnet / Mainnet arasında kolay geçiş
- Web uygulamalarına güvenli bağlantı
- İşlemleri imzalamadan önce kullanıcıya gösterir

### Freighter Nasıl Çalışır?

```
Web Uygulaması            Freighter            Stellar Ağı
     │                       │                      │
     │── "İşlem İmzala" ──►  │                      │
     │                       │ Kullanıcıya Sor      │
     │                       │ [Onayla] / [Reddet]  │
     │  ◄── İmzalı XDR ────  │                      │
     │                       │                      │
     │──────────────── İmzalı İşlemi Gönder ──────► │
```

Uygulama hiçbir zaman gizli anahtarınıza erişemez. Freighter yalnızca imzalanmış işlemi geri döner.

### Freighter Kurulumu

1. Chrome Web Store'a gidin
2. "Freighter Wallet" aratın
3. "Chrome'a Ekle" butonuna tıklayın
4. Eklenti açıldığında yeni bir hesap oluşturun veya mevcut anahtarınızı içe aktarın
5. **Testnet için:** Ayarlar → Ağ → Testnet seçin

---

## 6. Akıllı Sözleşme Nedir?

**Akıllı sözleşme (smart contract)**, blockchain üzerinde çalışan bir bilgisayar programıdır. Normal bir sözleşme gibi kurallar içerir; ancak bu kurallar otomatik olarak, aracıya gerek kalmadan uygulanır.

### Klasik Sözleşme vs Akıllı Sözleşme

```
Klasik Sözleşme:
  Ali → Para Gönder → Banka → Kontrol Et → Mehmet
                        ↑
                   Aracıya güven

Akıllı Sözleşme:
  Ali → Koşul Sağlandı mı? → Evet → Otomatik Transfer → Mehmet
                ↑
          Kod güvencesi (değiştirilemez)
```

### Gerçek Hayat Örneği

**Kira sözleşmesi akıllı sözleşme olsaydı:**
- Her ayın 1'inde kiracının hesabından kira otomatik çekilir
- Ev sahibi kapı şifresini verir; kira ödenirse şifre çalışmaya devam eder
- Ödeme yapılmazsa şifre otomatik iptal olur
- Ne ev sahibi ne kiracı ne de avukat süreci yönetmek zorunda kalır

### Bu Projede Akıllı Sözleşme

Bu projede **sayaç sözleşmesi** yer almaktadır. Basit bir örnek olarak tasarlanmıştır:

- Blockchain üzerinde bir sayı saklar
- Herkes sayıyı artırabilir veya azaltabilir
- Yalnızca admin sıfırlayabilir
- Tüm değişiklikler blockchain'de kalıcıdır, kimse silemez

### Akıllı Sözleşmenin Avantajları

- **Güven:** Kodun ne yapacağı önceden bellidir
- **Şeffaflık:** Kaynak kodu herkese açık
- **Otomasyon:** İnsan müdahalesi gerekmez
- **Maliyet:** Aracı komisyonu yoktur

---

## 7. Soroban Nedir?

**Soroban**, Stellar'ın akıllı sözleşme platformudur. 2023 yılında Stellar ağına entegre edilmiştir.

### Soroban'ın Teknik Altyapısı

Soroban sözleşmeleri **WebAssembly (WASM)** formatında derlenir ve Stellar ağında çalıştırılır. WebAssembly; hız, güvenlik ve taşınabilirlik için tasarlanmış modern bir ikili format standardıdır.

```
Rust Kodu (.rs)
      ↓ derleme
WebAssembly (.wasm)
      ↓ deploy
Stellar Ağı (blockchain)
      ↓ çalıştırma
Sonuç (return value)
```

### Soroban'ın Özellikleri

- **Rust dili:** Güvenli, hızlı sistem programlama dili
- **Deterministik yürütme:** Aynı giriş her zaman aynı çıktıyı verir
- **Kaynak limitleri:** Her işlem CPU ve bellek limitleriyle çalışır
- **3 depolama tipi:**
  - `instance` — sözleşmenin ömrüyle yaşar (global ayarlar)
  - `persistent` — manuel TTL yönetimi (kullanıcı bakiyeleri)
  - `temporary` — süreli, otomatik silinir (önbellekler)

### Soroban vs Ethereum Solidity

| | Soroban (Stellar) | Solidity (Ethereum) |
|---|---|---|
| Dil | Rust | Solidity (kendine özgü) |
| VM | WebAssembly | EVM |
| İşlem ücreti | Çok düşük | Değişken (gas) |
| İşlem hızı | ~5 saniye | ~12 saniye |
| Test araçları | Cargo test | Hardhat / Foundry |

---

## 8. Stellar Neyle Kodlanır?

Stellar ekosistemi birden fazla katmandan oluşur ve her katman farklı teknolojilerle kodlanır.

### Katman 1: Akıllı Sözleşmeler → Rust

```rust
// Örnek: Basit bir sayaç sözleşmesi
#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct SayacSozlesmesi;

#[contractimpl]
impl SayacSozlesmesi {
    pub fn artir(env: Env) -> u32 {
        let deger: u32 = env.storage().instance().get(&"sayac").unwrap_or(0);
        let yeni = deger + 1;
        env.storage().instance().set(&"sayac", &yeni);
        yeni
    }
}
```

**Neden Rust?**
- Bellek güvenliği: Çalışma zamanı hatası olmadan güvenli kod
- Yüksek performans: C/C++ hızında çalışır
- WebAssembly desteği: Kolayca WASM'a derlenir
- Zengin ekosistem: `cargo` paket yöneticisi

### Katman 2: Backend (Sunucu Tarafı) → JavaScript / Node.js

```javascript
// Horizon API ile hesap bilgisi çekme
import { Horizon } from "@stellar/stellar-sdk";

const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");
const hesap = await horizon.loadAccount("GABC...XYZ");
console.log(hesap.balances); // XLM ve token bakiyeleri
```

Alternatif backend dilleri:
- **Python:** `stellar-sdk` kütüphanesi ile
- **Go:** `stellar/go` resmi SDK'sı
- **Java:** Resmi Java SDK

### Katman 3: Frontend (Tarayıcı Tarafı) → React + TypeScript

```typescript
// Freighter ile cüzdan bağlantısı
import { getAddress, signTransaction } from "@stellar/freighter-api";

const { address } = await getAddress();
console.log("Bağlanan adres:", address);
```

### Bu Projenin Teknoloji Yığını

```
┌─────────────────────────────────────────────┐
│  FRONTEND                                   │
│  React 18 + TypeScript + Vite               │
│  @stellar/stellar-sdk  (işlem oluşturma)    │
│  @stellar/freighter-api (cüzdan bağlantısı) │
├─────────────────────────────────────────────┤
│  BACKEND                                    │
│  Node.js + Express                          │
│  @stellar/stellar-sdk (Horizon API)         │
├─────────────────────────────────────────────┤
│  AKILLI SÖZLEŞME                            │
│  Rust + soroban-sdk                         │
│  Stellar CLI (derleme & deploy)             │
├─────────────────────────────────────────────┤
│  STELLAR AĞI (TESTNET)                      │
│  Horizon API  → horizon-testnet.stellar.org │
│  Soroban RPC  → soroban-testnet.stellar.org │
└─────────────────────────────────────────────┘
```

---

## 9. Testnet ve Mainnet Farkı

| | Testnet | Mainnet |
|---|---|---|
| Para | Sahte XLM (değersiz) | Gerçek XLM (piyasa değeri var) |
| Amaç | Geliştirme ve test | Gerçek kullanım |
| Friendbot | Ücretsiz XLM alınabilir | Yok |
| Hesap açma | Friendbot ile ücretsiz | XLM satın alınmalı |
| Explorer | stellar.expert/testnet | stellar.expert/public |
| Risk | Sıfır | Gerçek para kaybı |

> Bu proje **Testnet** üzerinde çalışır. Gerçek para gerekli değildir.

---

## 10. Proje Mimarisi

```
Kullanıcı Tarayıcısı
        │
        │ HTTP (React SPA)
        ▼
┌──────────────┐        ┌──────────────────┐
│   Frontend   │◄──────►│  Freighter Cüzdan│
│  (Vite:5173) │        │  (Tarayıcı Ext.) │
└──────┬───────┘        └──────────────────┘
       │ REST API
       ▼
┌──────────────┐
│   Backend    │
│  (Node:4000) │
└──────┬───────┘
       │ Horizon API / Soroban RPC
       ▼
┌──────────────────────────────┐
│       Stellar Testnet        │
│  ┌────────────┐ ┌─────────┐  │
│  │ Horizon    │ │ Soroban │  │
│  │ (Klasik)   │ │  (RPC)  │  │
│  └────────────┘ └─────────┘  │
└──────────────────────────────┘
```

---

## 11. Windows Kurulumu

### Adım 1: Node.js Kurulumu

Node.js, JavaScript'i tarayıcı dışında çalıştıran bir ortamdır.

1. [https://nodejs.org](https://nodejs.org) adresine gidin
2. **"LTS"** (Long Term Support) sürümünü indirin
3. İndirilen `.msi` dosyasını çalıştırın
4. Kurulumu "Next → Next → Install" şeklinde tamamlayın

Kurulum doğrulama (Komut İstemi / PowerShell):
```cmd
node --version
npm --version
```
Her iki komut da versiyon numarası gösteriyorsa kurulum başarılıdır.

---

### Adım 2: Rust Kurulumu (Akıllı Sözleşme için)

Rust, Soroban akıllı sözleşmelerini yazmak için kullanılır.

1. [https://rustup.rs](https://rustup.rs) adresine gidin
2. `rustup-init.exe` dosyasını indirin ve çalıştırın
3. Komut penceresinde `1` tuşuna basın (varsayılan kurulum)
4. Kurulum tamamlandıktan sonra **yeni bir terminal** açın

```cmd
rustc --version
cargo --version
```

WebAssembly hedefini ekleyin:
```cmd
rustup target add wasm32-unknown-unknown
```

---

### Adım 3: Stellar CLI Kurulumu

Stellar CLI, sözleşme derleme ve deploy işlemleri için kullanılır.

```cmd
cargo install --locked stellar-cli
```

> Bu işlem ilk kurulumda 5-10 dakika sürebilir.

Doğrulama:
```cmd
stellar --version
```

---

### Adım 4: Git Kurulumu

1. [https://git-scm.com](https://git-scm.com) adresine gidin
2. Windows sürümünü indirin ve kurun
3. Kurulum sırasında tüm seçenekleri varsayılan bırakabilirsiniz

```cmd
git --version
```

---

### Adım 5: Freighter Tarayıcı Eklentisi

1. Google Chrome veya Brave tarayıcısını açın
2. [Freighter Wallet](https://www.freighter.app/) sitesine gidin
3. "Download for Chrome" butonuna tıklayın
4. Chrome Web Store'da "Chrome'a Ekle" deyin
5. Eklenti kurulduktan sonra:
   - Yeni cüzdan oluşturun
   - **Güvenli bir yere gizli anahtarınızı kaydedin!**
   - Ayarlar → Ağ → **Testnet** seçin

---

### Adım 6: Projeyi İndirin ve Çalıştırın

```cmd
git clone https://github.com/KULLANICI_ADINIZ/helix.git
cd helix
```

Frontend bağımlılıklarını yükleyin:
```cmd
cd frontend
npm install
cd ..
```

Backend bağımlılıklarını yükleyin:
```cmd
cd backend
npm install
cd ..
```

---

## 12. Linux Kurulumu

### Adım 1: Sistem Güncellemesi

**Ubuntu / Debian:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential pkg-config libssl-dev
```

**Fedora / RHEL:**
```bash
sudo dnf update -y
sudo dnf install -y curl git gcc openssl-devel
```

**Arch Linux:**
```bash
sudo pacman -Syu
sudo pacman -S curl git base-devel openssl
```

---

### Adım 2: Node.js Kurulumu

**nvm (Node Version Manager) ile kurulum önerilir:**

```bash
# nvm'yi indir ve kur
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Terminal'i yenile
source ~/.bashrc  # veya source ~/.zshrc

# LTS sürümü kur
nvm install --lts
nvm use --lts
```

Doğrulama:
```bash
node --version   # v20.x.x veya üzeri olmalı
npm --version
```

---

### Adım 3: Rust Kurulumu

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Yükleyici açıldığında `1` tuşuna basın (varsayılan kurulum).

Terminal'i yenileyin:
```bash
source ~/.cargo/env
```

Doğrulama:
```bash
rustc --version
cargo --version
```

WebAssembly hedefini ekleyin:
```bash
rustup target add wasm32-unknown-unknown
```

---

### Adım 4: Stellar CLI Kurulumu

```bash
cargo install --locked stellar-cli
```

Eğer `~/.cargo/bin` PATH'inizde değilse ekleyin:
```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Doğrulama:
```bash
stellar --version
```

---

### Adım 5: Freighter Tarayıcı Eklentisi

Linux'ta Chrome veya Chromium tarayıcısı kullanabilirsiniz.

**Chrome kurulumu (Ubuntu):**
```bash
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update
sudo apt install google-chrome-stable
```

Ardından Chrome'da Freighter eklentisini kurun (aynı adımlar Windows ile aynıdır).

---

### Adım 6: Projeyi İndirin

```bash
git clone https://github.com/KULLANICI_ADINIZ/helix.git
cd helix

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

---

## 13. Projeyi Çalıştırma

### Frontend'i Başlatın

```bash
cd frontend
npm run dev
```

Tarayıcıda açın: `http://localhost:5173`

---

### Backend'i Başlatın (ayrı terminal)

```bash
cd backend
npm run dev
```

Backend çalışıyor: `http://localhost:4000`

Sağlık kontrolü:
```bash
curl http://localhost:4000/api/health
# {"ok":true,"network":"testnet","timestamp":"..."}
```

---

### Helix · Stellar Academic arayüzü

| Alan | Ne yapılır |
|------|------------|
| **Giriş** | Yerel Demo oturumu (kullanıcı adı / şifre bilgisayardan sunucuya gitmez). Üst bardaki karşılamada görünen ad `Profil`de kaydedilebilir. |
| **Freighter ile Bağlan** | Sağ üst; tüm sekmedeki cüzdan durumu **`FreighterProvider`** ile tek kaynaktan yönetilir. |
| **Yolculuk** | Mühendislik içerik / yol haritası. |
| **Profil** | Görünen ad (`localStorage`) + seçili kullanıcı + Stellar cüzdan özeti ve Freighter bağlantısı. |
| **Satın Alma** | Ders katalogu → eğitmen → **XLM** ile ödeme (`payWithFreighter`, Horizon işlemi → **işlem hash**). Opsiyonel ders Kontrat client’ı ayrı. |
| **Helix +** | Ek araçlar (WalletInfo, ders listesi, takvim vb.). |

Ödeme tarafında **asıl doğrulama**: Horizon üzerinden başarıyla gönderilen **Ödeme (payment)** işlemi ve dönen **transaction hash**. Soroban deploy etmediyseniz veya Kontrat ID alamazsanız bu tasarımla çelişmez; başarı onayında arayüzde de bunu belirten metin yer alır.

---

### Frontend ortam dosyası

`frontend/.env.example` dosyasındaki değişkenleri kopyalayıp `frontend/.env` oluşturun (`.env` repoya eklemeyin). Ayrıntılı tablo: [§18 Ortam değişkenleri (özeti)](#18-ortam-değişkenleri-özeti).

---

### Uygulamayı Kullanmak

1. Tarayıcıda `http://localhost:5173` adresini açın.
2. Giriş formunda kullanıcı adı ve şifre ile devam edin (demo oturumu).
3. Üstünde **Freighter ile Bağlan** ile cüzdana bağlanın (Satın Alma ve Profil özellikleri için).
4. **Profil** veya ilgili sekmelerde adres / bakiye bilgisini doğrulayın.
5. **Satın Alma** sekmesinde ders seçip akışı tamamlayın; Testnet için hesabınızı Friendbot ile fonlayın.

---

### Testnet XLM Almak (Ücretsiz)

Testnet'te hesabınızı fonlamak için Friendbot kullanın:

```bash
curl "https://friendbot.stellar.org?addr=HESAP_ADRESINIZ"
```

Veya tarayıcıdan:
```
https://friendbot.stellar.org?addr=GABC...XYZ
```

---

## 14. Akıllı Sözleşmeyi Deploy Etme

### Adım 1: Kimlik Oluşturun

```bash
stellar keys generate --global gelistirici --network testnet --fund
```

Bu komut:
- `gelistirici` adında bir kimlik oluşturur
- Testnet'te otomatik fonlar (10.000 test XLM)

Adresinizi görün:
```bash
stellar keys address gelistirici
```

---

### Adım 2: Sözleşmeyi Derleyin

```bash
cd contracts/counter
stellar contract build
```

Derleme çıktısı:
```
target/wasm32-unknown-unknown/release/counter.wasm
```

---

### Adım 3: Testnet'e Deploy Edin

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/counter.wasm \
  --source gelistirici \
  --network testnet \
  -- \
  --admin gelistirici
```

Komut bir **Contract ID** döndürür (C harfiyle başlar):
```
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Bu ID'yi kopyalayın!

---

### Adım 4: Ortam Değişkenini Ayarlayın

`frontend/` klasöründe `.env` dosyası oluşturun:

```bash
# frontend/.env
VITE_COUNTER_CONTRACT_ID=CXXXXXXX...  # Kopyaladığınız ID
```

Frontend'i yeniden başlatın:
```bash
cd frontend
npm run dev
```

Artık arayüzde **"Sayaç Sözleşmesi"** kartı görünecek!

---

### Adım 5: Sözleşmeyi Test Edin (Opsiyonel)

Rust unit testleri:
```bash
cd contracts/counter
cargo test
```

CLI ile manuel test:
```bash
# Sayacı oku
stellar contract invoke \
  --id CXXXXX... \
  --source gelistirici \
  --network testnet \
  -- get_count

# Sayacı artır
stellar contract invoke \
  --id CXXXXX... \
  --source gelistirici \
  --network testnet \
  -- increment
```

---

## 15. Proje Dosya Yapısı

```
helix/
├── contracts/                         ← Soroban sözleşmeler (Rust workspace)
│   ├── counter/
│   │   ├── Cargo.toml
│   │   └── src/lib.rs                 ← Örnek sayaç kontratı
│   ├── lesson-contract/
│   │   └── …                          ← Ders kontratı kaynakları
│   ├── education_contract/
│   └── STELLAR_CONTRACT_README.md
│
├── frontend/                          ← Vite + React + TypeScript
│   ├── .env.example                   ← Örnek VITE_* değişkenleri (kopyalayın)
│   ├── src/
│   │   ├── main.tsx                   ← Root; FreighterProvider sarmalı
│   │   ├── App.tsx                    ← Sekmeli akademi ana uygulama
│   │   ├── hooks/
│   │   │   └── useFreighter.tsx       ← Tekil cüzdan context (FreighterProvider)
│   │   ├── components/
│   │   │   ├── ConnectButton.tsx
│   │   │   ├── WalletInfo.tsx
│   │   │   ├── LessonCatalog.tsx      ← Ücretli ders katalogu + satın alma girişi
│   │   │   ├── PurchasePage.tsx       ← Ödeme modalı (e-posta → XLM → onay)
│   │   │   ├── LessonPurchaseCover.tsx ← Ders kartı görsel tema
│   │   │   ├── lessonPurchaseThemes.ts ← Gradient / ikon temaları
│   │   │   ├── UserProfile.tsx
│   │   │   ├── CounterContract.tsx
│   │   │   ├── AcademicRecordsContract.tsx
│   │   │   ├── CoulombCalculator.tsx · GradeCalculator.tsx · … (modüller)
│   │   │   └── …
│   │   └── lib/
│   │       ├── stellar.ts             ← Horizon, payWithFreighter, explorer
│   │       ├── contract.ts             ← İsteğe bağlı sayaç Kontrat (VITE_COUNTER_*)
│   │       ├── academicContract.ts
│   │       ├── lesson-contract.ts     ← Ders Kontrat client (mock/elastik)
│   │       └── profileStorage.ts      ← Profil görünen adı (tarayıcı)
│   └── package.json
│
├── backend/                           ← Node / Express API (isteğe bağlı)
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 16. API Referansı

### Backend Endpoint'leri

#### `GET /api/health`
Sunucunun çalıştığını doğrular.

**Yanıt:**
```json
{
  "ok": true,
  "network": "testnet",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

#### `GET /api/account/:address`
Stellar hesap bilgilerini getirir.

**Parametreler:**

| Parametre | Tür | Açıklama |
|---|---|---|
| `address` | string | G ile başlayan 56 karakterli Stellar adresi |

**Başarılı Yanıt (200):**
```json
{
  "address": "GABC...XYZ",
  "xlmBalance": "9999.9999800",
  "sequence": "123456789",
  "subentryCount": 0,
  "tokens": [],
  "networkPassphrase": "Test SDF Network ; September 2015"
}
```

**Hata Yanıtları:**

| Kod | Açıklama |
|---|---|
| `400` | Geçersiz Stellar adresi |
| `404` | Hesap bulunamadı (henüz fonlanmamış) |
| `500` | Horizon bağlantı hatası |

---

### Akıllı Sözleşme Fonksiyonları

#### `initialize(admin: Address)`
Sözleşmeyi başlatır. Yalnızca bir kez çağrılabilir.

#### `increment() → u32`
Sayacı 1 artırır, yeni değeri döner.

#### `decrement() → u32`
Sayacı 1 azaltır (minimum 0), yeni değeri döner.

#### `reset()`
Sayacı sıfırlar. Yalnızca admin çağırabilir (Freighter imzası gerekir).

#### `get_count() → u32`
Mevcut sayaç değerini okur (imza gerekmez, ücretsiz).

---

## 17. Sık Sorulan Sorular

**S: Freighter'ı bağlayamıyorum, ne yapmalıyım?**

A: Şu adımları kontrol edin:
1. Freighter eklentisi kurulu ve açık mı?
2. Freighter'da **Testnet** ağı seçili mi? (Ayarlar → Ağ)
3. Hesabınız oluşturulmuş mu?
4. Tarayıcıyı yeniden başlatmayı deneyin.

---

**S: "Hesap bulunamadı" hatası alıyorum.**

A: Yeni oluşturulan hesaplar fonlanana kadar Stellar ağında görünmez. Friendbot ile ücretsiz test XLM alın:
```
https://friendbot.stellar.org?addr=HESAP_ADRESINIZ
```

---

**S: Sözleşme deploy ederken hata alıyorum.**

A: Sıkça karşılaşılan sorunlar:
- **"insufficient XLM":** `stellar keys generate --fund` ile hesabınızı yeniden fonlayın
- **"wasm file not found":** `stellar contract build` komutunu çalıştırdığınızdan emin olun
- **"network mismatch":** `--network testnet` parametresini kontrol edin

---

**S: Gizli anahtarımı kaybettim, ne olur?**

A: Gizli anahtarı kaybederseniz hesabınıza bir daha **hiçbir şekilde** erişemezsiniz. Testnet için bu sorun değil (yeni hesap açabilirsiniz), ancak Mainnet'te gerçek para kaybı anlamına gelir. **Gizli anahtarı güvenli bir yerde saklayın!**

---

**S: Rust öğrenmem gerekiyor mu?**

A: Yalnızca frontend geliştirmek için hayır. Ancak akıllı sözleşme yazmak veya değiştirmek için Rust bilgisi gerekir. Başlangıç için [The Rust Book](https://doc.rust-lang.org/book/) ücretsiz ve Türkçe çevirisi mevcuttur.

---

**S: Bu proje Mainnet'te çalışır mı?**

A: Evet, ancak `stellar.ts` dosyasındaki URL'leri Mainnet adresleriyle değiştirmeniz ve Freighter'da Mainnet'i seçmeniz gerekir. Mainnet'te gerçek XLM harcanır, dikkatli olun.

---

**S: Kontrat adresim (Contract ID) yok; Soroban kurmadım. Sorun olur mu?**

A: **Satın alma için hayır.** Akış klasik **XLM transferi** ile çalışır; Horizon’da görünür bir işlem çıkması hedeflenir. `frontend/.env` içinde **`VITE_LESSON_CONTRACT_ID=` boş** bırakarak ders kontrat çağrısı tarafını kapatabilirsiniz. Varsayılan repoda yerel olarak bir demo `C…` fallback ID kodda durabilir — üretimde kendi `.env` politikanızı kullanın.

---

**S: "Freighter ile Bağlan" ve ders kartı uyumsuz bağlı görünüyordu, düzeldi mi?**

A: Evet — `FreighterProvider` ile tüm bileşenler aynı cüzdan state’ini paylaşıyor. Eski tek dosyalı `useFreighter.ts` yapısı `useFreighter.tsx` + Provider modeline taşındı.

---

## 18. Ortam değişkenleri (özeti)

Tüm anahtarlar **`frontend/`** içinde kullanılır; Vite yüzünden `VITE_` öneki zorunludur.

| Değişken | Zorunlu? | Rol |
|---------|----------|-----|
| `VITE_LESSON_CONTRACT_ID` | Hayır | Boş string (`""`) verilirse ders için Soroban client oluşturulmaz — yalnız XLM ödeme kaydı kullanılır. Tanımsız ise kod içi demo ID kullanılabilir. |
| `VITE_COUNTER_CONTRACT_ID` | Hayır | Sayaç bileşeni; boş ise UI “deploy edin” uyarısı verir. |
| `VITE_ACADEMIC_CONTRACT_ID` | Hayır | Akademik kayıt bileşeni; boş ise ilgili akış kapalıdır. |

`frontend/.env.example` içinde örnek satırlar vardır. Üretimde hassas adresleri repo dışında tutun.

---

## Faydalı Kaynaklar

| Kaynak | URL |
|---|---|
| Stellar Resmi Dokümantasyon | https://developers.stellar.org |
| Soroban Dokümantasyon | https://developers.stellar.org/docs/smart-contracts |
| Stellar JavaScript SDK | https://stellar.github.io/js-stellar-sdk |
| Soroban Rust SDK | https://docs.rs/soroban-sdk |
| Stellar Testnet Explorer | https://stellar.expert/explorer/testnet |
| Friendbot (Testnet Fonlama) | https://friendbot.stellar.org |
| Freighter Cüzdan | https://www.freighter.app |
| Rust Programlama Dili | https://www.rust-lang.org/tr |
| The Rust Book (Türkçe) | https://rustdili.github.io |

---

## Katkı Sağlamak

1. Bu repoyu fork'layın
2. Yeni bir dal oluşturun: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerinizi kaydedin: `git commit -m "Yeni özellik ekle"`
4. Dalınızı gönderin: `git push origin ozellik/yeni-ozellik`
5. Pull Request açın

---

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

---

<div align="center">
  <sub>Helix · Stellar Academic — Stellar Testnet · Gerçek para içermez</sub>
</div>
