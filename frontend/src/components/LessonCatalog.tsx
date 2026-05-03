import { useEffect, useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import { LessonContractClient } from "../lib/lesson-contract";
import { InstructorAvatar, LessonPurchaseCover } from "./LessonPurchaseCover";
import PurchasePage from "./PurchasePage";

interface Instructor {
  id: string;
  name: string;
  role: string;
  price: string;
  experience: string;
}

interface Test {
  id: string;
  title: string;
  difficulty: "Kolay" | "Orta" | "Zor" | "Aşırı Zor";
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  price: string;
  tags: string[];
  content: string;
  instructors: Instructor[];
  tests: Test[];
}

const LESSONS: Lesson[] = [
  {
    id: "coulomb",
    title: "Coulomb Elektrik Kuvveti",
    description: "Elektrik yükleri arasındaki kuvveti hesaplama ve alan konseptini öğrenme.",
    price: "₺49",
    tags: ["Elektrik", "Formül", "Fizik"],
    content:
      "Coulomb yasası, iki nokta yük arasındaki elektriksel kuvveti belirler: F = k · q1 · q2 / r². Bu derste çekim/itme, alan şiddeti ve iş/enerji ilişkisini öğreneceksiniz.",
    instructors: [
      { id: "ayse-k", name: "Ayşe Akın", role: "Fizik Öğretmeni", price: "₺49", experience: "8 yıl deneyimli, elektrik alanı uzmanı" },
      { id: "cem-s", name: "Cem Şahin", role: "Mühendislik Mentor", price: "₺59", experience: "Uygulamalı deneylerle anlatım" },
      { id: "nazli-g", name: "Nazlı Güneş", role: "Üniversite Hazırlık Eğitmeni", price: "₺45", experience: "Sınav odaklı çözümler ve konu tekrarı" },
    ],
    tests: [
      { id: "coulomb-kolay", title: "Coulomb Testi - Kolay", difficulty: "Kolay", description: "Temel Coulomb hesaplamaları ve kavram soruları." },
      { id: "coulomb-orta", title: "Coulomb Testi - Orta", difficulty: "Orta", description: "Alan ve kuvvet ilişkisini analiz eden sorular." },
      { id: "coulomb-zor", title: "Coulomb Testi - Zor", difficulty: "Zor", description: "Çekim/itme ve enerji sorularıyla derinleştirme." },
      { id: "coulomb-asiri", title: "Coulomb Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Kapsamlı uygulama problemleri ve senaryo analizi." },
    ],
  },
  {
    id: "ivmeli-hareket",
    title: "Bir Boyutlu İvmeli Hareket",
    description: "Sabit ivme altında hareket eden cisimlerin konum ve hız grafikleri.",
    price: "₺39",
    tags: ["Kinematik", "İvme", "Hareket"],
    content:
      "x = x0 + v0 t + 0.5 a t² formülünü, hız-zaman grafiğini ve pratik örnekleri bulacaksınız. İvme, yavaşlama ve başlangıç hızı kavramları üzerinde durulur.",
    instructors: [
      { id: "deniz-y", name: "Deniz Yıldız", role: "Fizik Danışmanı", price: "₺39", experience: "Analitik çözümler ve grafik odaklı" },
      { id: "emir-k", name: "Emir Koç", role: "STEM Eğitmeni", price: "₺45", experience: "Pratik uygulama soruları" },
      { id: "seda-t", name: "Seda Türker", role: "Matematik-Fizik Rehberi", price: "₺44", experience: "Formül çıkarımı ve örnek sınav soruları" },
    ],
    tests: [
      { id: "ivmeli-kolay", title: "İvmeli Hareket Testi - Kolay", difficulty: "Kolay", description: "Konum ve hız grafikleri üzerine temel sorular." },
      { id: "ivmeli-orta", title: "İvmeli Hareket Testi - Orta", difficulty: "Orta", description: "Hız-zaman ve ivme hesaplamaları içeren sorular." },
      { id: "ivmeli-zor", title: "İvmeli Hareket Testi - Zor", difficulty: "Zor", description: "Sabit ivmeli hareket formülleriyle problem çözme." },
      { id: "ivmeli-asiri", title: "İvmeli Hareket Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Zor uygulamalı kinematik senaryoları." },
    ],
  },
  {
    id: "enerji-is",
    title: "Enerji ve İş",
    description: "Mekanik enerji, iş ve güç ilişkisini kavrayın.",
    price: "₺45",
    tags: ["Enerji", "İş", "Termodinamik"],
    content:
      "Kinetik ve potansiyel enerji, iş-enerji teoremi ve enerji korunumunu öğrenin. Gerçek dünya uygulamalarıyla birlikte enerji hesaplamaları yapın.",
    instructors: [
      { id: "selin-a", name: "Selin Aras", role: "Fen Bilimleri Eğitmeni", price: "₺45", experience: "Enerji hesaplamaları ve örnek sınav soruları" },
      { id: "kaan-o", name: "Kaan Oran", role: "Mühendislik Rehberi", price: "₺55", experience: "Termodinamik ve uygulama anlatımı" },
      { id: "asya-b", name: "Asya Bal", role: "Fizik Uygulama Eğitmeni", price: "₺50", experience: "Enerji problemlerinde adım adım rehberlik" },
    ],
    tests: [
      { id: "enerji-kolay", title: "Enerji Testi - Kolay", difficulty: "Kolay", description: "Kinetik ve potansiyel enerji tanımı üzerine sorular." },
      { id: "enerji-orta", title: "Enerji Testi - Orta", difficulty: "Orta", description: "İş-enerji ilişkisi ve güç hesapları soruları." },
      { id: "enerji-zor", title: "Enerji Testi - Zor", difficulty: "Zor", description: "Korunum yasası uygulamaları ve problem çözme." },
      { id: "enerji-asiri", title: "Enerji Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Karışık enerji ve iş problemleri." },
    ],
  },
  {
    id: "elektrik-alan",
    title: "Elektrik Alan ve Potansiyel",
    description: "Alan çizgileri, potansiyel fark ve kapasitör hesapları.",
    price: "₺59",
    tags: ["Alan", "Potansiyel", "Elektrik"],
    content:
      "Elektrik alan tanımı, potansiyel fark ve kapasitörlerin çalışma mantığını bu derste örneklerle çözerek öğreneceksiniz.",
    instructors: [
      { id: "melis-t", name: "Melis Tüzün", role: "Fizik Uzmanı", price: "₺59", experience: "Alan ve potansiyel konularında derin anlatım" },
      { id: "burak-e", name: "Burak Ersoy", role: "Deneyimli Eğitmen", price: "₺52", experience: "Uygulamalı kapasitör örnekleri" },
      { id: "elif-k", name: "Elif Korkmaz", role: "Laboratuvar Destekli Eğitmen", price: "₺53", experience: "Deneyim tabanlı elektrik uygulamaları" },
    ],
    tests: [
      { id: "alan-kolay", title: "Alan Testi - Kolay", difficulty: "Kolay", description: "Elektrik alan tanımı ve potansiyel soruları." },
      { id: "alan-orta", title: "Alan Testi - Orta", difficulty: "Orta", description: "Potansiyel fark ve kapasitör hesapları içeren sorular." },
      { id: "alan-zor", title: "Alan Testi - Zor", difficulty: "Zor", description: "Alan çizgileri ve yoğunluk problemleri." },
      { id: "alan-asiri", title: "Alan Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Karmaşık elektrik alan senaryoları." },
    ],
  },
  {
    id: "dalga-hareketi",
    title: "Dalgalar ve Basit Harmonik Hareket",
    description: "Dalgaların temel özellikleri ve basit harmonik hareket formülleri.",
    price: "₺42",
    tags: ["Dalga", "Titreşim", "SHM"],
    content:
      "Dalga boyu, frekans, genlik, periyot ve basit harmonik hareketin temel denklemleri bu derste ele alınır.",
    instructors: [
      { id: "zeynep-k", name: "Zeynep Kılıç", role: "Fizik Danışmanı", price: "₺42", experience: "Dalga ve titreşim konularında görsel anlatım" },
      { id: "murat-s", name: "Murat Şen", role: "STEM Mentor", price: "₺49", experience: "SHM ve deneysel analiz" },
      { id: "bora-y", name: "Bora Yılmaz", role: "Uygulamalı Fizik Eğitmeni", price: "₺46", experience: "Dalga denklemleri ve simülasyon" },
    ],
    tests: [
      { id: "dalga-kolay", title: "Dalga Testi - Kolay", difficulty: "Kolay", description: "Dalgaların temel özelliklerini ölçen sorular." },
      { id: "dalga-orta", title: "Dalga Testi - Orta", difficulty: "Orta", description: "Frekans, genlik ve periyot hesaplamaları." },
      { id: "dalga-zor", title: "Dalga Testi - Zor", difficulty: "Zor", description: "SHM ve dalga denklemi uygulamaları." },
      { id: "dalga-asiri", title: "Dalga Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Zor dalga problemleri ve analizler." },
    ],
  },
  {
    id: "momentum",
    title: "Momentum ve Çarpışmalar",
    description: "Kütle, hız ve etki-momentum ilişkilerini keşfedin.",
    price: "₺47",
    tags: ["Momentum", "Çarpışma", "Kuvvet"],
    content:
      "Momentumun korunumu, elastik ve inelastik çarpışmalar ile çarpışma türlerinin fizikteki uygulamalarını öğrenin.",
    instructors: [
      { id: "onur-t", name: "Onur Tekin", role: "Fizik Uzmanı", price: "₺47", experience: "Çarpışma analizleri ve korunum yasaları" },
      { id: "dilan-a", name: "Dilan Altun", role: "STEM Rehberi", price: "₺44", experience: "Problem çözme stratejileri ve örnekler" },
    ],
    tests: [
      { id: "momentum-kolay", title: "Momentum Testi - Kolay", difficulty: "Kolay", description: "Temel momentum ve momentum korunumuna giriş." },
      { id: "momentum-orta", title: "Momentum Testi - Orta", difficulty: "Orta", description: "Çarpışma analizleri ve momentum hesapları." },
      { id: "momentum-zor", title: "Momentum Testi - Zor", difficulty: "Zor", description: "Elastik ve inelastik çarpışma problemleri." },
      { id: "momentum-asiri", title: "Momentum Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Karmaşık momentum ve çarpışma senaryoları." },
    ],
  },
  {
    id: "optik",
    title: "Geometri Optiği ve Aynalar",
    description: "Mercekler, aynalar ve görüntü oluşumunu pratikçe öğrenin.",
    price: "₺53",
    tags: ["Optik", "Mercek", "Görüntü"],
    content:
      "Işık kırılması, aynalar, mercekler ve görüntü oluşumu konularını deneysel bakış açısıyla keşfedin.",
    instructors: [
      { id: "eda-c", name: "Eda Çelik", role: "Fizik Öğretmeni", price: "₺53", experience: "Optik ve görüntü kuramında detaylı rehberlik" },
      { id: "tuncay-h", name: "Tuncay Hilal", role: "Fen Bilimleri Mentor", price: "₺50", experience: "Mercek problemleri ve sınav taktikleri" },
    ],
    tests: [
      { id: "optik-kolay", title: "Optik Testi - Kolay", difficulty: "Kolay", description: "Aynalar ve merceklerle ilgili temel sorular." },
      { id: "optik-orta", title: "Optik Testi - Orta", difficulty: "Orta", description: "Görüntü oluşumu ve kırılma açıları hesaplamsı." },
      { id: "optik-zor", title: "Optik Testi - Zor", difficulty: "Zor", description: "Mercek ve ayna kombinasyonları soruları." },
      { id: "optik-asiri", title: "Optik Testi - Aşırı Zor", difficulty: "Aşırı Zor", description: "Optik sistem problemleri ve analizleri." },
    ],
  },
];

const FINAL_EXAM = {
  id: "final-exam",
  title: "Kapsamlı Fizik Sınavı",
  description: "Tüm dersleri tamamladıktan sonra girebileceğiniz final sınavı. Her konudan sorular içerir.",
  price: "₺99",
  totalQuestions: 40,
  rewards: [
    { rank: "🥇 1. Sıra", prize: "%30 İndirim + Sertifika + Mentoring Saati" },
    { rank: "🥈 2. Sıra", prize: "%20 İndirim + Sertifika" },
    { rank: "🥉 3. Sıra", prize: "%10 İndirim + Sertifika" },
  ]
};

const STORAGE_PREFIX = "stellar-academic-paid-lessons";

export default function LessonCatalog() {
  const { status, address } = useFreighter();
  const [ownedLessons, setOwnedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(LESSONS[0]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor>(LESSONS[0].instructors[0]);
  const [showPurchasePage, setShowPurchasePage] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [contractClient, setContractClient] = useState<LessonContractClient | null>(null);
  const [lessonTestResults, setLessonTestResults] = useState<Record<string, { difficulty: string; score: number }[]>>({});
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Record<string, { likes: number; dislikes: number; comments: { id: string; text: string; date: string }[] }>>(() => {
    const initial: Record<string, { likes: number; dislikes: number; comments: { id: string; text: string; date: string }[] }> = {};
    LESSONS.forEach((lesson) => {
      initial[lesson.id] = { likes: 0, dislikes: 0, comments: [] };
    });
    return initial;
  });

  useEffect(() => {
    if (!address) {
      setOwnedLessons([]);
      return;
    }

    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}:${address}`);
    if (stored) {
      try {
        setOwnedLessons(JSON.parse(stored));
      } catch {
        setOwnedLessons([]);
      }
    }
  }, [address]);

  useEffect(() => {
    if (selectedLesson) {
      setSelectedInstructor(selectedLesson.instructors[0]);
    }
  }, [selectedLesson]);

  useEffect(() => {
    const raw = import.meta.env.VITE_LESSON_CONTRACT_ID;
    if (raw === "") {
      setContractClient(null);
      return;
    }
    const fromEnv = typeof raw === "string" && raw.trim() ? raw.trim() : null;
    const fallbackDemo = "CAHHXRCUWYBHZX5BBDVHG4GJFDCJMRFMFKGSDQSWUDJB6HPVUIPD2ZUEJ";
    const contractId = fromEnv ?? fallbackDemo;
    setContractClient(new LessonContractClient(contractId));
  }, []);

  const getPurchaseKey = (lessonId: string, instructorId: string) => `${lessonId}:${instructorId}`;

  const normalizeEmail = (email: string) => email.trim().toLowerCase();
  const isStudentEmail = (email: string) => {
    const normalized = normalizeEmail(email);
    return normalized.includes("@") && (normalized.includes(".edu") || normalized.includes(".edu.tr") || normalized.includes("ogr") || normalized.includes("student") || normalized.includes("öğrenci"));
  };

  const getNumericPrice = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
  const formatPrice = (amount: number) => `₺${amount.toFixed(0)}`;
  const STUDENT_DISCOUNT = 0.2;
  const getDiscountedPrice = (price: string) => {
    const amount = getNumericPrice(price);
    return formatPrice(amount * (1 - STUDENT_DISCOUNT));
  };

  const studentHasDiscount = isStudentEmail(studentEmail);
  const getInstructorDisplayPrice = (price: string) => (studentHasDiscount ? `${getDiscountedPrice(price)} (öğrenci)` : price);

  // Fiyat dönüşüm (TL → XLM) - 1 XLM ≈ 35 TL
  const convertTLtoXLM = (tlPrice: string) => {
    const amount = getNumericPrice(tlPrice);
    return (amount / 35).toFixed(4);
  };

  const openPurchaseModal = () => {
    if (status !== "connected" || !address) {
      alert("Lütfen cüzdanınıza bağlanın");
      return;
    }
    setShowPurchasePage(true);
  };

  const handlePurchaseSuccess = () => {
    if (!selectedLesson) return;
    const key = getPurchaseKey(selectedLesson.id, selectedInstructor.id);
    const updated = Array.from(new Set([...ownedLessons, key]));
    setOwnedLessons(updated);
    window.localStorage.setItem(`${STORAGE_PREFIX}:${address}`, JSON.stringify(updated));
    setTimeout(() => {
      setShowPurchasePage(false);
    }, 1500);
  };

  const allLessonsPurchased = LESSONS.every((lesson) => ownedLessons.some((key) => key.startsWith(`${lesson.id}:`)));
  const allLessonTestsDone = LESSONS.every((lesson) => (lessonTestResults[lesson.id] || []).length > 0);

  const getRandomScore = (difficulty: string) => {
    const ranges: Record<string, [number, number]> = {
      Kolay: [75, 95],
      Orta: [60, 90],
      Zor: [45, 85],
      "Aşırı Zor": [30, 80],
    };
    const [min, max] = ranges[difficulty] ?? [50, 90];
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const startTest = (lessonId: string, test: Test) => {
    const key = ownedLessons.find((key) => key.startsWith(`${lessonId}:`));
    if (!key) return;
    const score = getRandomScore(test.difficulty);
    setLessonTestResults((current) => ({
      ...current,
      [lessonId]: [
        ...(current[lessonId] ?? []),
        { difficulty: test.difficulty, score },
      ],
    }));
  };


  const isOwned = (lessonId: string, instructorId: string) => ownedLessons.includes(getPurchaseKey(lessonId, instructorId));

  const likeLesson = (lessonId: string) => {
    setReviews((current) => ({
      ...current,
      [lessonId]: {
        ...current[lessonId],
        likes: current[lessonId].likes + 1,
      },
    }));
  };

  const dislikeLesson = (lessonId: string) => {
    setReviews((current) => ({
      ...current,
      [lessonId]: {
        ...current[lessonId],
        dislikes: current[lessonId].dislikes + 1,
      },
    }));
  };

  const submitReview = () => {
    if (!selectedLesson || reviewText.trim().length === 0) return;

    setReviews((current) => ({
      ...current,
      [selectedLesson.id]: {
        ...current[selectedLesson.id],
        comments: [
          {
            id: `${Date.now()}`,
            text: reviewText.trim(),
            date: new Date().toLocaleString("tr-TR"),
          },
          ...current[selectedLesson.id].comments,
        ],
      },
    }));
    setReviewText("");
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/40 backdrop-blur-md">
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-950/90 via-slate-900/85 to-emerald-950/30 px-6 py-8 md:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 ring-1 ring-emerald-500/30">Stellar ile öde</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="text-slate-400 normal-case tracking-normal font-medium">Ücretli ders kataloğu</span>
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-white md:text-3xl">Ders seç · Eğitmen seç · Erişimi aç</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Sol listeden bir konu seçin; kapak görseli ve özet her derse özgü. Ödeme Freighter ile XLM üzerinden yapılır.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { k: "Güvenli ödeme", v: "Stellar ağında işlem kaydı", i: "⛓️" },
            { k: "Net fiyatlar", v: "TL karşılığı ve XLM dönüşümü", i: "💳" },
            { k: "Öğrenci indirimi", v: ".edu adresi ile %20 daha az", i: "🎓" },
          ].map((item) => (
            <div
              key={item.k}
              className="flex gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-sm"
            >
              <span className="text-2xl" aria-hidden>
                {item.i}
              </span>
              <div>
                <dt className="text-sm font-semibold text-white">{item.k}</dt>
                <dd className="mt-1 text-xs text-slate-500">{item.v}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:w-[min(100%,340px)] lg:flex-shrink-0 lg:overflow-y-auto lg:pr-1">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Konular</p>
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {LESSONS.map((lesson) => {
                const active = selectedLesson?.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className={`min-w-[min(92vw,300px)] text-left transition lg:min-w-0 ${active ? "ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-slate-900 rounded-3xl" : "rounded-3xl hover:opacity-95"}`}
                  >
                    <LessonPurchaseCover
                      variant="square"
                      lessonId={lesson.id}
                      title={lesson.title}
                      subtitle={lesson.description}
                      rightSlot={
                        <span className="rounded-xl bg-black/35 px-2.5 py-1 text-xs font-bold tracking-wide text-emerald-200 ring-1 ring-white/15">
                          {lesson.price}
                        </span>
                      }
                    />
                    <div className="pointer-events-none -mt-1 flex flex-wrap gap-1.5 rounded-b-2xl border border-t-0 border-white/10 bg-slate-950/95 px-3 py-2.5">
                      {lesson.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {selectedLesson && (
            <div className="min-w-0 flex-1 space-y-6">
              <LessonPurchaseCover
                variant="banner"
                lessonId={selectedLesson.id}
                title={selectedLesson.title}
                subtitle={selectedLesson.description}
                rightSlot={
                  isOwned(selectedLesson.id, selectedInstructor.id) ? (
                    <span className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-200">
                      Erişiminiz var ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={openPurchaseModal}
                      className="rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400 active:scale-[0.98]"
                    >
                      {convertTLtoXLM(selectedInstructor.price)} XLM · Satın al
                    </button>
                  )
                }
              />

              <div className="grid gap-6 lg:grid-cols-[1fr_min(320px,100%)]">
                <div className="space-y-5">
              <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-slate-300 shadow-inner shadow-black/20">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    📖
                  </span>
                  <h3 className="text-base font-bold text-white">Ders içeriği</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {isOwned(selectedLesson.id, selectedInstructor.id)
                    ? selectedLesson.content
                    : "Bu konunun tam içeriğini görmek için önce seçili eğitmenin dersini satın almanız gerekiyor."}
                </p>
              </section>

              <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-black/15">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    👩‍🏫
                  </span>
                  <h3 className="text-base font-bold text-white">Eğitmen seçimi</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedLesson.instructors.map((instructor) => (
                    <button
                      key={instructor.id}
                      type="button"
                      onClick={() => setSelectedInstructor(instructor)}
                      className={`flex w-full gap-3 rounded-3xl border p-4 text-left transition md:items-start ${selectedInstructor.id === instructor.id
                        ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                        : "border-white/10 bg-slate-900/80 hover:border-white/25"
                        }`}
                    >
                      <InstructorAvatar name={instructor.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-white">{instructor.name}</p>
                          <span className="rounded-lg bg-black/35 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-white/10">
                            {getInstructorDisplayPrice(instructor.price)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{instructor.role}</p>
                        <p className="mt-2 text-sm text-slate-400">{instructor.experience}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-inner shadow-black/15">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    📝
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Ders testleri</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Videolar sonrası zorluk seviyesine göre alıştırmalar
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Her videodan sonra kolaydan aşırı zora testlerle pekiştirin.
                </p>
                <div className="mt-4 grid gap-3">
                  {selectedLesson.tests.map((test) => (
                    <button
                      key={test.id}
                      type="button"
                      onClick={() => startTest(selectedLesson.id, test)}
                      disabled={!ownedLessons.some((key) => key.startsWith(`${selectedLesson.id}:`))}
                      className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-200 transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{test.title}</p>
                          <p className="text-xs text-slate-400">{test.description}</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">{test.difficulty}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {lessonTestResults[selectedLesson.id]?.length ? (
                  <div className="mt-4 space-y-3 text-slate-300">
                    <p className="text-sm text-slate-400">Son test sonuçları:</p>
                    {lessonTestResults[selectedLesson.id].map((result, index) => (
                      <div key={`${selectedLesson.id}-${index}`} className="rounded-3xl bg-black/30 p-3 text-sm">
                        <p>{result.difficulty} testinden {result.score} puan aldınız.</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 to-black/40 p-5 text-slate-300 shadow-inner shadow-black/30">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg" aria-hidden>
                    ✉️
                  </span>
                  <p className="text-sm font-semibold text-white">Öğrenci e-postası</p>
                </div>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@okul.edu.tr"
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
                <p className={`mt-3 text-sm ${studentHasDiscount ? "text-emerald-300" : "text-slate-500"}`}>
                  {studentHasDiscount
                    ? "Öğrenci e-postası tespit edildi, ekstra %20 indirim uygulanıyor."
                    : "Öğrenci e-postası girerseniz ekstra %20 indirim kazanırsınız."}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-start gap-3">
                  <InstructorAvatar name={selectedInstructor.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Seçili eğitmen</p>
                    <p className="text-lg font-semibold text-white">{selectedInstructor.name}</p>
                    <span className="mt-2 inline-flex rounded-xl bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      {selectedInstructor.role}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{selectedInstructor.experience}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-slate-300">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <span aria-hidden>⭐</span> Topluluk oyları
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Olumlu</p>
                    <p className="text-2xl font-bold text-white">{reviews[selectedLesson.id]?.likes ?? 0} 👍</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Olumsuz</p>
                    <p className="text-2xl font-bold text-white">{reviews[selectedLesson.id]?.dislikes ?? 0} 👎</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => likeLesson(selectedLesson.id)}
                    className="flex-1 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/15"
                  >
                    Beğendim
                  </button>
                  <button
                    type="button"
                    onClick={() => dislikeLesson(selectedLesson.id)}
                    className="flex-1 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 hover:bg-rose-500/15"
                  >
                    Beğenmedim
                  </button>
                </div>
              </div>

              {allLessonsPurchased && allLessonTestsDone && (
                <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 p-6 border border-emerald-500/30">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 mb-3">
                        🎯 Final Sınav Hazırız!
                      </div>
                      <h3 className="text-2xl font-bold text-white">{FINAL_EXAM.title}</h3>
                      <p className="mt-1 text-slate-400 text-sm">{FINAL_EXAM.totalQuestions} soru • Tüm konulardan</p>
                    </div>
                    <span className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-lg font-bold text-emerald-300">{FINAL_EXAM.price}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-6 mb-4">{FINAL_EXAM.description}</p>

                  <div className="mb-4 space-y-2">
                    {FINAL_EXAM.rewards.map((reward, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                        <span className="text-lg">{reward.rank}</span>
                        <p className="text-sm text-slate-300">{reward.prize}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-2xl bg-slate-600 px-4 py-4 text-sm font-bold text-slate-200 cursor-not-allowed"
                  >
                    Tüm Dersleri Satın Alarak Açılır
                  </button>
                </div>
              )}

              <div className="rounded-3xl bg-slate-950/80 p-5 border border-white/10">
                <p className="text-sm text-slate-400">Yorum</p>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Bu ders hakkında düşüncelerinizi yazın..."
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submitReview}
                  className="mt-4 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Yorumu Gönder
                </button>
                {reviews[selectedLesson.id]?.comments.length ? (
                  <div className="mt-4 space-y-3">
                    {reviews[selectedLesson.id].comments.map((comment) => (
                      <div key={comment.id} className="rounded-3xl bg-black/30 p-4 text-slate-300">
                        <p className="text-sm leading-6">{comment.text}</p>
                        <p className="mt-2 text-[11px] text-slate-500">{comment.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Henüz yorum yok. İlk yorumu siz bırakabilirsiniz!</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-4 text-sm md:flex md:items-center md:justify-between md:gap-4">
            {status === "connected" && address ? (
              <p className="flex items-center gap-2 text-slate-300">
                <span className="text-lg" aria-hidden>
                  👛
                </span>
                <span>
                  Bağlı cüzdan:{" "}
                  <span className="font-mono text-emerald-300/95">
                    {address.slice(0, 8)}…{address.slice(-6)}
                  </span>
                </span>
              </p>
            ) : (
              <p className="flex items-center gap-2 text-slate-500">
                <span aria-hidden>🔌</span> Satın almak için üst menüden Freighter ile bağlanın.
              </p>
            )}
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchasePage && selectedLesson && (
        <PurchasePage
          lesson={selectedLesson}
          instructor={selectedInstructor}
          onBack={() => setShowPurchasePage(false)}
          onSuccess={handlePurchaseSuccess}
          contractClient={contractClient}
          studentAddress={address || ""}
        />
      )}
    </div>
  );
}
