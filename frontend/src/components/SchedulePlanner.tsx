import { useEffect, useState } from "react";

type ScheduleItem = {
    id: string;
    course: string;
    day: string;
    time: string;
};

const STORAGE_KEY = "stellar-academic-schedule";
const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export default function SchedulePlanner() {
    const [course, setCourse] = useState("");
    const [day, setDay] = useState(DAYS[0]);
    const [time, setTime] = useState("09:00");
    const [items, setItems] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                setItems([]);
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = () => {
        if (!course.trim()) return;
        setItems((current) => [
            {
                id: crypto.randomUUID(),
                course: course.trim(),
                day,
                time,
            },
            ...current,
        ]);
        setCourse("");
        setTime("09:00");
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    return (
        <div className="p-6 bg-slate-900/80 border border-slate-700 rounded-3xl shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-cyan-300">Ders Planlayıcı</h2>
                    <p className="text-sm text-slate-400">Ders programını hızlıca kaydedip ders çalışmanı planla.</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    {items.length} ders
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-5">
                <input
                    value={course}
                    onChange={(event) => setCourse(event.target.value)}
                    placeholder="Ders adı"
                    className="col-span-1 md:col-span-3 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
                />

                <select
                    value={day}
                    onChange={(event) => setDay(event.target.value)}
                    className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none"
                >
                    {DAYS.map((dayName) => (
                        <option key={dayName} value={dayName}>
                            {dayName}
                        </option>
                    ))}
                </select>

                <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none"
                />

                <button
                    onClick={addItem}
                    className="md:col-span-3 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                    Programa Ekle
                </button>
            </div>

            {items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-slate-500">
                    Henüz ders eklemediniz. Planlayıcıya bir ders ekleyin.
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-slate-100">{item.course}</p>
                                <p className="text-sm text-slate-400">{item.day} · {item.time}</p>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="rounded-2xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/10"
                            >
                                Sil
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
