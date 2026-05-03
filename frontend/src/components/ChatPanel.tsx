import { useState } from "react";

const initialMessages = [
    { id: 1, author: "Sistem", text: "Hoş geldiniz! Sorularınızı buradan sorabilirsiniz." },
];

export default function ChatPanel() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now(),
            author: "Siz",
            text: input.trim(),
        };
        setMessages((current) => [...current, newMessage]);
        setInput("");

        setTimeout(() => {
            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    author: "Asistan",
                    text: "Bu bir demo sohbet panelidir. Şu anda gerçek bir yapay zeka bağlantısı yok, ancak sorularınız burada yanıtlanabilirdi.",
                },
            ]);
        }, 500);
    };

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Canlı Sohbet</p>
                    <h2 className="text-xl font-bold text-white">Chat Arayüzü</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">Demo</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 pb-2">
                {messages.map((message) => (
                    <div key={message.id} className={`rounded-3xl p-4 ${message.author === "Siz" ? "bg-emerald-500/10 text-emerald-100 self-end" : "bg-white/5 text-slate-200"}`}>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">{message.author}</p>
                        <p className="text-sm leading-6">{message.text}</p>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex gap-3 flex-col sm:flex-row">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Sorunuzu yazın..."
                    className="flex-1 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={sendMessage}
                    className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                    Gönder
                </button>
            </div>
        </div>
    );
}
