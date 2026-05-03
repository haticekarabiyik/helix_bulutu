# Stellar Ders Satın Alma Kontratı

Bu proje, Stellar blockchain ağında ders satın alma, final sınavı ve ödül dağıtımı sistemini yönetmek için bir Soroban smart contract sunar.

## 📋 Kontrat Özellikleri

### 1. Ders Yönetimi
- Admin tarafından yeni dersler eklenebilir
- Her dersin benzersiz ID'si, başlığı, fiyatı ve eğitmeni vardır
- Ders satın alma sayısı takip edilir

### 2. Satın Alma Sistemi
- Öğrenciler belirli eğitmenin dersini satın alabilir
- Ödemeler Stellar ağında XLM (native asset) ile yapılır
- Tüm satın alma işlemleri blokzincirde kaydedilir
- Öğrenci - ders - eğitmen ilişkisi güvenli şekilde depolanır

### 3. Final Sınav Sistemi
- Öğrenciler final sınavına girdikten sonra puanlarını kaydedebilir
- Puanlar Stellar kontratında saklanır
- Leaderboard otomatik olarak en yüksek puanlar işletimleri göre sıralanır

### 4. Ödül Dağıtımı (İlk 3)
- 🥇 1. Sıra: 0.1 XLM ödül + Sertifika
- 🥈 2. Sıra: 0.07 XLM ödül + Sertifika
- 🥉 3. Sıra: 0.04 XLM ödül + Sertifika

## 🚀 Kurulum ve Deployment

### Ön Koşullar
- Rust 1.70+ sürümü
- Stellar CLI (`stellar` komutu)
- Soroban CLI

### 1. Kurulum

```bash
# Kontrat dizinine git
cd contracts/lesson-contract

# Bağımlılıkları yükle
cargo build --release

# WASM'ı oluştur
cargo build --target wasm32-unknown-unknown --release
```

### 2. Testnet'te Deploy

```bash
# Soroban'ı kurulmuş ol
cargo install --locked stellar-cli --features soroban

# Kontratı derle
soroban contract build

# Testnet'te deploy et
soroban contract deploy \
  --network testnet \
  --source <your-account-secret> \
  --wasm target/wasm32-unknown-unknown/release/lesson_contract.wasm
```

### 3. Kontratı İnitialize Et

```bash
soroban contract invoke \
  --network testnet \
  --source <your-account-secret> \
  --id <contract-id> \
  -- \
  initialize \
  --admin <admin-account> \
  --token_address <xlm-or-usdc-address>
```

## 📱 Frontend Entegrasyonu

### Lesson Contract Client Kullanımı

```typescript
import { LessonContractClient, stroopsToXlm } from './lib/lesson-contract';

// Client oluştur
const client = new LessonContractClient('CAHHXRCUWYBHZX5BBDVHG4GJFDCJMRFMFKGSDQSWUDJB6HPVUIPD2ZUEJ');

// Dersi satın al
await client.purchaseLesson(studentAddress, 'coulomb-1', instructorAddress);

// Sınav sonucunu kaydet
await client.submitExamResult(studentAddress, 92);

// Leaderboard'u getir
const leaderboard = await client.getLeaderboard();

// Ödülü talep et
await client.claimReward(studentAddress);
```

## 💡 Kontrat Fonksiyonları

### Admin Fonksiyonları

```rust
// Sözleşmeyi başlat
initialize(env, admin: Address, token_address: Address)

// Yeni ders ekle
add_lesson(env, lesson_id: String, title: String, price: i128, instructor: Address)

// Toplam geliri getir
get_total_revenue(env) -> i128
```

### Öğrenci Fonksiyonları

```rust
// Dersi satın al
purchase_lesson(env, student: Address, lesson_id: String, instructor: Address) -> bool

// Dersi satın aldı mı kontrol et
has_purchased(env, student: Address, lesson_id: String, instructor: Address) -> bool

// Sınav sonucunu gönder
submit_exam_result(env, student: Address, score: u32)

// Leaderboard'u getir
get_leaderboard(env) -> Vec<ExamResult>

// Ödülü talep et
claim_reward(env, student: Address) -> i128

// Satın alımlarını getir
get_student_purchases(env, student: Address) -> Vec<Purchase>
```

## 🧪 Testler

Kontratı test etmek için:

```bash
cd contracts/lesson-contract
cargo test
```

Testler şunları kapsar:
- Kontrat başlatılması
- Ders ekleme ve satın alma
- Sınav sonuçları ve leaderboard
- Ödül talep etme

## 🔗 Kontrat Adresleri

### Testnet
- Kontrat ID: `CAHHXRCUWYBHZX5BBDVHG4GJFDCJMRFMFKGSDQSWUDJB6HPVUIPD2ZUEJ`
- Admin: `GCZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZGF`

### Mainnet
(Henüz deploy edilmedi - production ready değil)

## 💰 Fiyatlandırma (Stroops)

1 XLM = 10,000,000 stroops

### Örnek Ders Fiyatları
- Coulomb Yasası: 5,000,000 stroops (0.5 XLM)
- Kinematik: 3,900,000 stroops (0.39 XLM)
- Enerji: 4,500,000 stroops (0.45 XLM)

## 🔐 Güvenlik Notları

1. **Authorization**: Tüm fonksiyonlar uygun şekilde yetki kontrolü yapar
2. **Data Validation**: Score 0-100 arasında olmalıdır
3. **Storage**: Veriler Soroban persistent storage'da saklanır
4. **TTL**: Tüm storage entries 30 günlük TTL ile ayarlanır

## 📞 Destek

Sorular veya sorunlar için:
- Email: support@stellar-academic.com
- GitHub: [Issues](https://github.com/your-repo/issues)

## 📄 Lisans

MIT License - Ayrıntılar için LICENSE dosyasına bakın.

---

**Not**: Bu kontrat henüz production ready değildir. Deployment öncesinde kapsamlı audit gerçekleştirilmelidir.
