import { useEffect, useState } from "react";
import { useFreighter } from "../hooks/useFreighter";

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  price: string;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { status, address, connect, isInstalled } = useFreighter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Sunucu hatası");
        return res.json();
      })
      .then(setCourses)
      .catch(() => setError("Kurslar yüklenemedi. Backend çalışıyor mu?"))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (course: Course) => {
    setPurchasing(course.id);
    setSuccess(null);
    setError(null);
    try {
      if (!address) throw new Error("Cüzdan bağlı değil");
      // TODO: Freighter ile gerçek Stellar ödeme işlemi başlat
      const txHash = "stellar-tx-" + Math.random().toString(36).slice(2);
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, student: address, txHash }),
      });
      if (!res.ok) throw new Error("Satın alma başarısız");
      setSuccess(`${course.title} satın alındı!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Satın alma başarısız";
      setError(message);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-sm text-slate-400">Kurslar yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 backdrop-blur-sm">
        <p className="text-sm text-rose-300">{error}</p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Backend API</p>
          <h2 className="text-xl font-bold text-white">Eğitim Kursları</h2>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
          {courses.length} kurs
        </span>
      </div>

      {success && (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          ⚠ {error}
        </div>
      )}

      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-white/10 bg-black/30 p-5 transition hover:border-white/20"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{course.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{course.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                    {course.instructor}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                    {course.price} XLM
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                {status !== "connected" ? (
                  <button
                    onClick={connect}
                    disabled={status === "connecting" || !isInstalled}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "connecting" ? "Bağlanıyor..." : "Freighter ile Bağlan"}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(course)}
                    disabled={purchasing === course.id}
                    className="rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {purchasing === course.id ? "İşleniyor..." : "Satın Al"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-sm text-slate-500">
          Henüz kurs eklenmemiş.
        </div>
      )}
    </section>
  );
}
