import { useState } from "react";
import { LessonContractClient } from "../lib/lesson-contract";

interface Instructor {
    id: string;
    name: string;
    role: string;
    price: string;
    experience: string;
}

interface PurchasePageProps {
    lesson: { id: string; title: string; description: string };
    instructor: Instructor;
    onBack: () => void;
    onSuccess: (txHash: string) => void;
    contractClient: LessonContractClient | null;
    studentAddress: string;
}

export default function PurchasePage({
    lesson,
    instructor,
    onBack,
    onSuccess,
    contractClient,
    studentAddress,
}: PurchasePageProps) {
    const [step, setStep] = useState<"email" | "payment" | "confirmation">("email");
    const [studentEmail, setStudentEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [txHash, setTxHash] = useState("");

    // Fiyat dönüşümü (₺ → XLM) - 1 XLM ≈ 35 ₺
    const priceInTL = parseInt(instructor.price.replace(/[^0-9]/g, ""));
    const xlmPrice = (priceInTL / 35).toFixed(4);

    const validateEmail = async () => {
        setIsValidating(true);
        setEmailError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(studentEmail)) {
            setEmailError("Lütfen geçerli bir e-posta adresi girin");
            setIsValidating(false);
            return;
        }

        // Öğrenci e-postası doğrulaması
        const isStudent =
            studentEmail.toLowerCase().includes(".edu") ||
            studentEmail.toLowerCase().includes(".edu.tr") ||
            studentEmail.toLowerCase().includes("@student") ||
            studentEmail.toLowerCase().includes("@ogr");

        if (!isStudent) {
            setEmailError("Lütfen geçerli bir öğrenci e-postası kullanın (.edu, .edu.tr, student, öğrenci, ogr)");
            setIsValidating(false);
            return;
        }

        // Simüle edilmiş sunucu doğrulaması
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStep("payment");
        setIsValidating(false);
    };

    const processPurchase = async () => {
        if (!contractClient || !studentAddress) {
            setEmailError("Cüzdan bağlanmamış");
            return;
        }

        try {
            const purchased = await contractClient.purchaseLesson(
                studentAddress,
                lesson.id,
                instructor.id
            );

            if (purchased) {
                setTxHash("stellar_tx_0x" + Math.random().toString(16).slice(2, 15));
                setStep("confirmation");
                setTimeout(() => {
                    onSuccess("stellar_tx_confirmed");
                }, 2000);
            }
        } catch (error) {
            setEmailError("Ödeme işlemi başarısız oldu");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-emerald-500/20 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-black text-white">{lesson.title}</h1>
                        <button
                            onClick={onBack}
                            className="text-slate-400 hover:text-white transition text-2xl"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-slate-400 text-sm">{lesson.description}</p>
                </div>

                {/* Steps Indicator */}
                <div className="px-8 py-4 bg-black/50 flex gap-3">
                    {["email", "payment", "confirmation"].map((stepName, idx) => (
                        <div key={stepName} className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                    (step === stepName || (idx === 0 && step !== "email"))
                                        ? "bg-emerald-500 text-slate-950"
                                        : step === "confirmation"
                                          ? "bg-emerald-500/20 text-emerald-300"
                                          : "bg-slate-700 text-slate-400"
                                }`}
                            >
                                {idx === 0 ? "✉️" : idx === 1 ? "💳" : "✓"}
                            </div>
                            {idx < 2 && (
                                <div
                                    className={`h-1 w-12 transition ${
                                        step !== "email" ? "bg-emerald-500" : "bg-slate-700"
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="px-8 py-12 min-h-96">
                    {step === "email" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">E-Posta Doğrulama</h2>
                                <p className="text-slate-400">Öğrenci e-postanızı girerek devam edin</p>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-300">
                                    Öğrenci E-Postası
                                </label>
                                <input
                                    type="email"
                                    value={studentEmail}
                                    onChange={(e) => {
                                        setStudentEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    placeholder="student@okul.edu.tr"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-950/70 border border-slate-700 text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition text-lg"
                                />
                                {emailError && (
                                    <p className="text-sm text-red-400 flex items-center gap-2">
                                        ⚠️ {emailError}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={validateEmail}
                                disabled={isValidating || !studentEmail}
                                className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-2xl transition text-lg"
                            >
                                {isValidating ? "Doğrulanıyor..." : "Devam Et"}
                            </button>
                        </div>
                    )}

                    {step === "payment" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Ödeme Bilgileri</h2>
                                <p className="text-slate-400">Stellar blockchain üzerinden XLM ile öde</p>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 bg-black/50 rounded-2xl border border-slate-700 p-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Eğitmen</span>
                                    <span className="text-white font-semibold">{instructor.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Deneyim</span>
                                    <span className="text-white text-sm">{instructor.experience}</span>
                                </div>
                                <div className="h-px bg-slate-700"></div>
                                <div className="flex items-center justify-between pt-3">
                                    <span className="text-slate-300 font-semibold">Toplam Ödeme</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-emerald-400">
                                            {xlmPrice} XLM
                                        </div>
                                        <div className="text-xs text-slate-500">≈ {instructor.price}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stellar Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                                <p className="text-xs text-blue-300 uppercase tracking-widest mb-2">⛓️ Stellar Blockchain</p>
                                <p className="text-sm text-slate-300">
                                    Freighter cüzdanınız üzerinden XLM ile ödeme yapılacaktır. Bu işlem blokzincirde kalıcı olarak kaydedilecektir.
                                </p>
                            </div>

                            <button
                                onClick={processPurchase}
                                className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl transition text-lg"
                            >
                                {xlmPrice} XLM ile Satın Al
                            </button>

                            <button
                                onClick={() => setStep("email")}
                                className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl transition"
                            >
                                Geri Dön
                            </button>
                        </div>
                    )}

                    {step === "confirmation" && (
                        <div className="space-y-6 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                                    <span className="text-4xl">✓</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-emerald-400 mb-2">Satın Alma Başarılı!</h2>
                                <p className="text-slate-400">Dersiniz şimdi erişime açık</p>
                            </div>

                            {/* Tx Hash */}
                            <div className="bg-black/50 rounded-2xl border border-slate-700 p-4 text-left">
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">İşlem Hash</p>
                                <p className="text-xs font-mono text-emerald-300 break-all">{txHash}</p>
                            </div>

                            <div className="bg-slate-900/50 rounded-2xl p-4 space-y-2 text-left">
                                <p className="text-sm text-slate-400 mb-3">📋 Ders Detayları</p>
                                <div className="text-sm">
                                    <p className="text-slate-300">
                                        <span className="text-slate-500">Ders:</span> {lesson.title}
                                    </p>
                                    <p className="text-slate-300 mt-1">
                                        <span className="text-slate-500">Eğitmen:</span> {instructor.name}
                                    </p>
                                    <p className="text-slate-300 mt-1">
                                        <span className="text-slate-500">E-posta:</span> {studentEmail}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onBack}
                                className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl transition text-lg"
                            >
                                Devam Et
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
