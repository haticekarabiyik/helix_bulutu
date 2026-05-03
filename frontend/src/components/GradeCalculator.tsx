import { useState } from 'react';

export default function GradeCalculator() {
    const [vize, setVize] = useState(55);
    const [hedef, setHedef] = useState(65);
    const [vizeWeight, setVizeWeight] = useState(40);
    const [finalWeight, setFinalWeight] = useState(60);

    const vizeEtki = vize * (vizeWeight / 100);
    const finalGereken = finalWeight > 0 ? (hedef - vizeEtki) / (finalWeight / 100) : 0;
    const totalWeight = vizeWeight + finalWeight;

    return (
        <div className="p-6 bg-slate-900/80 border border-slate-700 rounded-2xl shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                Mühendislik Not Asistanı
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="text-xs text-slate-400 uppercase tracking-tighter font-mono">Vize Notun: {vize}</label>
                    <input type="range" value={vize} onChange={(e) => setVize(+e.target.value)} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-black/30 p-4 rounded-3xl border border-white/5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.15em]">Vize Ağırlığı</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={vizeWeight}
                            onChange={(e) => setVizeWeight(+e.target.value)}
                            className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-lg outline-none"
                        />
                    </div>
                    <div className="bg-black/30 p-4 rounded-3xl border border-white/5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.15em]">Final Ağırlığı</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={finalWeight}
                            onChange={(e) => setFinalWeight(+e.target.value)}
                            className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-lg outline-none"
                        />
                    </div>
                </div>

                <div className="bg-black/30 p-4 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs uppercase text-slate-500 tracking-[0.2em]">Hedef Ortalama</span>
                        <span className="text-lg font-bold text-slate-100">{hedef}</span>
                    </div>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={hedef}
                        onChange={(e) => setHedef(+e.target.value)}
                        className="mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-lg outline-none"
                    />
                </div>

                {totalWeight !== 100 && (
                    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                        Toplam ağırlık %100 olmalıdır. Şu anda toplam: <strong>{totalWeight}%</strong>
                    </div>
                )}

                <div className={`p-5 rounded-3xl text-center border transition-all ${finalGereken > 100 ? 'bg-red-500/10 border-red-500/40' : 'bg-emerald-500/10 border-emerald-500/40'}`}>
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Finalde Alman Gereken</p>
                    <span className="text-4xl font-black font-mono tracking-tighter">
                        {finalGereken > 100 ? 'KALDIN' : finalGereken < 0 ? 'GEÇTİN' : Math.ceil(finalGereken)}
                    </span>
                </div>
            </div>
        </div>
    );
}