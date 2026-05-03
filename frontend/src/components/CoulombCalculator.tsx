import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CoulombCalculator() {
    const [q1, setQ1] = useState(1);
    const [q2, setQ2] = useState(1);
    const [r, setR] = useState(5);

    const k = 8.99e9;
    const force = (k * Math.abs(q1 * q2)) / Math.pow(r, 2);

    return (
        <div className="p-6 bg-slate-900/80 border border-slate-700 rounded-3xl shadow-xl backdrop-blur-sm">
            <div className="mb-5 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-2 text-sm text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    İnteraktif Formül Sözlüğü
                </div>
                <h2 className="text-xl font-bold text-blue-300">Coulomb Yasası</h2>
                <p className="text-slate-400 text-sm">F = k · q₁ · q₂ / r² formülünü canlı olarak deneyimleyin.</p>
            </div>

            <div className="space-y-4 mb-6 text-xs font-mono text-slate-300">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-950/70 p-3">
                        <p className="text-slate-500 uppercase text-[10px] tracking-[0.24em]">Yük 1</p>
                        <p className="text-lg font-bold">{q1} C</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 p-3">
                        <p className="text-slate-500 uppercase text-[10px] tracking-[0.24em]">Yük 2</p>
                        <p className="text-lg font-bold">{q2} C</p>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-950/70 p-4">
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.24em] mb-2">Mesafe</p>
                    <p className="text-lg font-semibold">{r} m</p>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={r}
                        onChange={(e) => setR(+e.target.value)}
                        className="mt-4 w-full accent-emerald-500"
                    />
                </div>

                <div className="space-y-3">
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        value={q1}
                        onChange={(e) => setQ1(+e.target.value)}
                        className="w-full accent-blue-500"
                    />
                    <input
                        type="range"
                        min="-10"
                        max="10"
                        value={q2}
                        onChange={(e) => setQ2(+e.target.value)}
                        className="w-full accent-red-500"
                    />
                </div>
            </div>

            <div className="relative h-24 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                <motion.div animate={{ x: -(r * 2.8), scale: 1 + Math.abs(q1) / 15 }} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${q1 >= 0 ? 'bg-blue-600' : 'bg-orange-600'}`}>
                    q1
                </motion.div>
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <motion.div animate={{ x: r * 2.8, scale: 1 + Math.abs(q2) / 15 }} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${q2 >= 0 ? 'bg-red-600' : 'bg-purple-600'}`}>
                    q2
                </motion.div>
            </div>

            <div className="mt-6 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5 text-center font-mono">
                <p className="text-[10px] uppercase tracking-[0.21em] text-slate-300 mb-2">Kuvvet</p>
                <p className="text-3xl font-black text-blue-300">{force.toExponential(2)} N</p>
            </div>
        </div>
    );
}