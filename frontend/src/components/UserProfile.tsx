import { type FormEvent, useEffect, useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import { WalletInfo } from "./WalletInfo";
import { saveProfile } from "../lib/profileStorage";

type Props = {
  sessionUsername: string;
  displayName: string;
  onDisplayNameChange: (name: string) => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserProfile({ sessionUsername, displayName, onDisplayNameChange }: Props) {
  const { status, address, network, connect, disconnect } = useFreighter();
  const [draftName, setDraftName] = useState(displayName);
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const handleSaveName = (event: FormEvent) => {
    event.preventDefault();
    const next = draftName.trim() || sessionUsername;
    saveProfile(sessionUsername, next);
    onDisplayNameChange(next);
    setSavedHint(true);
    window.setTimeout(() => setSavedHint(false), 2200);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-950/30 p-6 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl font-black tracking-tight text-emerald-300 ring-2 ring-emerald-500/40"
              aria-hidden
            >
              {initials(displayName)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">Hesap</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">{displayName}</h2>
              <p className="mt-2 text-sm text-slate-400">
                Oturum kullanıcı adı:{" "}
                <span className="font-mono text-slate-300">@{sessionUsername}</span>
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveName}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md md:min-w-[280px]"
          >
            <label htmlFor="profile-display-name" className="text-xs font-medium text-slate-400">
              Görünen ad
            </label>
            <input
              id="profile-display-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-slate-100 outline-none ring-emerald-500/0 transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/25"
              placeholder="Adınız veya takma ad"
              maxLength={80}
              autoComplete="nickname"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Kaydet
              </button>
              {savedHint ? (
                <span className="text-sm text-emerald-400">Kaydedildi.</span>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Stellar cüzdan</h3>
            <p className="text-sm text-slate-400">
              Ders satın alma ve zincir üstü işlemler için Freighter ile bağlanın.
            </p>
          </div>
          {status === "connected" && address ? (
            <button
              type="button"
              onClick={disconnect}
              className="shrink-0 rounded-xl border border-white/15 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-400/40 hover:text-rose-200"
            >
              Cüzdanı ayır
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              Freighter ile bağlan
            </button>
          )}
        </div>

        {status === "connected" && address ? (
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-200">
              Bağlı
            </span>
            {network ? (
              <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-slate-300">
                Ağ: {network}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="mt-1 text-sm text-slate-500">
            Bağlı değilsiniz. Üst menüdeki &quot;Freighter ile Bağlan&quot; ile de bağlanabilirsiniz.
          </p>
        )}

        <div className="mt-6">
          <WalletInfo />
          {status === "connected" && address ? null : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-slate-900/40 p-8 text-center text-sm text-slate-500">
              Cüzdan bağlandığında bakiye ve hesap bilgileri burada görünür.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white">Gizlilik</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Görünen adınız yalnızca bu tarayıcıda saklanır (localStorage). Şifreniz sunucuya gönderilmez; giriş ekranı yalnızca
          oturumu bu cihazda sınırlamak içindir.
        </p>
      </section>
    </div>
  );
}
