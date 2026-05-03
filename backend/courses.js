// backend/courses.js
// Kurs yönetimi ve ödeme API'si

import express from "express";
import pkg from "@stellar/stellar-sdk";
const { Horizon } = pkg;

const router = express.Router();
const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");

// Mock veri
let courses = [
  { id: 1, title: 'Blokzincir 101', price: '10', instructor: 'Gizem Hoca', description: 'Temel blokzincir eğitimi.' },
  { id: 2, title: 'Stellar ve Soroban', price: '15', instructor: 'Ahmet Hoca', description: 'Stellar smart contract geliştirme.' },
  { id: 3, title: 'DeFi Temelleri', price: '12', instructor: 'Elif Hoca', description: 'Merkeziyetsiz finans dünyasına giriş.' },
];
let purchases = [];

// Kursları listele
router.get('/courses', (req, res) => {
  res.json(courses);
});

// Kurs oluştur (hoca)
router.post('/courses', (req, res) => {
  const { title, price, instructor, description } = req.body;
  if (!title || !price || !instructor) {
    return res.status(400).json({ error: 'title, price ve instructor zorunlu' });
  }
  const id = courses.length + 1;
  courses.push({ id, title, price, instructor, description: description || '' });
  res.json({ success: true, id });
});

// Kurs satın al (ödeme işlemi)
router.post('/purchase', async (req, res) => {
  const { courseId, student, txHash } = req.body;

  if (!courseId || !student) {
    return res.status(400).json({ error: 'courseId ve student zorunlu' });
  }

  // Zaten satın alınmış mı kontrol et
  const alreadyPurchased = purchases.find(
    (p) => p.courseId === courseId && p.student === student
  );
  if (alreadyPurchased) {
    return res.status(400).json({ error: 'Bu kurs zaten satın alınmış' });
  }

  // Stellar txHash doğrulama (gerçek tx varsa)
  let txVerified = false;
  if (txHash && !txHash.startsWith('mock_')) {
    try {
      const tx = await horizon.transactions().transaction(txHash).call();
      txVerified = tx && tx.successful;
    } catch (err) {
      console.warn('Tx doğrulama başarısız (devam ediliyor):', err.message);
    }
  }

  purchases.push({
    courseId,
    student,
    txHash: txHash || null,
    txVerified,
    purchasedAt: new Date().toISOString(),
  });

  const course = courses.find((c) => c.id === courseId);
  res.json({
    success: true,
    course: course?.title || 'Bilinmeyen kurs',
    txVerified,
  });
});

// Öğrencinin satın aldığı kurslar
router.get('/my-courses/:student', (req, res) => {
  const student = req.params.student;
  const myCourseIds = purchases
    .filter((p) => p.student === student)
    .map((p) => p.courseId);
  res.json(courses.filter((c) => myCourseIds.includes(c.id)));
});

// Hoca gelirleri
router.get('/instructor-earnings/:instructor', (req, res) => {
  const instructor = req.params.instructor;
  const sold = purchases.filter((p) => {
    const course = courses.find((c) => c.id === p.courseId);
    return course && course.instructor === instructor;
  });

  const total = sold.reduce((sum, p) => {
    const course = courses.find((c) => c.id === p.courseId);
    return sum + (course ? parseFloat(course.price) : 0);
  }, 0);

  res.json({
    count: sold.length,
    total,
    purchases: sold,
  });
});

// Kurs detayını getir
router.get('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: 'Kurs bulunamadı' });
  }
  res.json(course);
});

export default router;
