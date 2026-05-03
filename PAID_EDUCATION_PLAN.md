# Paid Education System Plan

## 1. Özellikler

- Hocalar eğitim kursları oluşturur.
- Öğrenciler kursları listeden seçer ve satın alır.
- Satın alma işlemi Stellar ağı ve Freighter cüzdanı ile yapılır.
- Satın alınan kurslar öğrencinin hesabına tanımlanır.
- Hoca, kurs gelirini kendi cüzdanında görür.

## 2. Backend API

- Kurs oluşturma (hoca)
- Kursları listeleme (herkes)
- Kurs satın alma (öğrenci, ödeme işlemi)
- Satın alınan kursları listeleme (öğrenci)
- Hoca gelirlerini görüntüleme

## 3. Frontend

- Kurs listesi ve detay sayfası
- "Satın Al" butonu (Freighter ile ödeme)
- Satın alınan kurslarım bölümü
- Hoca paneli: kurs oluşturma ve gelir görüntüleme

## 4. Akış

1. Hoca kurs ekler.
2. Öğrenci kursu seçer, "Satın Al" der.
3. Freighter ile ödeme yapılır.
4. Backend, ödemeyi doğrular ve kursu öğrenciye tanımlar.
5. Hoca, gelirini panelde görür.

---

Devamında backend API ve ödeme entegrasyonu kodları eklenecek.
