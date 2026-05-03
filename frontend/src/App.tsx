import { type FormEvent, useState } from "react";
import { ConnectButton } from "./components/ConnectButton";
import ChatPanel from "./components/ChatPanel";
import CoulombCalculator from "./components/CoulombCalculator";
import GradeCalculator from "./components/GradeCalculator";
import LessonCatalog from "./components/LessonCatalog";
import SchedulePlanner from "./components/SchedulePlanner";
import { useFreighter } from "./hooks/useFreighter";

type PageKey = "coulomb" | "planner" | "grades" | "purchase" | "chat";

const NAV_ITEMS: Array<{ key: PageKey; label: string }> = [
  { key: "coulomb", label: "Coulomb" },
  { key: "planner", label: "Program" },
  { key: "grades", label: "Notlar" },
  { key: "purchase", label: "Satin Alma" },
  { key: "chat", label: "Yardim" },
];

function App() {
  const wallet = useFreighter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activePage, setActivePage] = useState<PageKey>("purchase");

  const pageTitle =
    activePage === "coulomb"
      ? "Coulomb Hesaplama"
      : activePage === "planner"
        ? "Program Planlayici"
        : activePage === "grades"
          ? "Not Hesaplama"
          : activePage === "purchase"
            ? "Ders Satin Alma"
            : "Asistan";

  const pageDescription =
    activePage === "coulomb"
      ? "Elektrik kuvveti hesaplamak icin bu sayfayi kullan."
      : activePage === "planner"
        ? "Ders programini planlamak icin bu sayfayi kullan."
        : activePage === "grades"
          ? "Not ortalamasi ve ders agirliklarini buradan takip et."
          : activePage === "purchase"
            ? "Stellar uzerinden ders satin alma ekrani."
            : "Chat paneli ile sorularini sor ve hizli destek al.";

  const renderPage = () => {
    if (activePage === "coulomb") return <CoulombCalculator />;
    if (activePage === "planner") return <SchedulePlanner />;
    if (activePage === "grades") return <GradeCalculator />;
    if (activePage === "purchase") return <LessonCatalog wallet={wallet} />;
    return <ChatPanel />;
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Kullanici adi ve sifre zorunlu.");
      return;
    }
    setLoginError("");
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050810] text-slate-300 font-sans selection:bg-emerald-500/30">
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl"
          >
            <p className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300">
              Giris
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white">Stellar Academic</h1>
            <p className="mt-2 text-sm text-slate-400">Devam etmek icin giris yap.</p>

            <label className="mt-6 block text-sm text-slate-300">Kullanici Adi</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
              placeholder="ornek: azra"
            />

            <label className="mt-4 block text-sm text-slate-300">Sifre</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200 outline-none focus:border-emerald-500"
              placeholder="******"
            />

            {loginError && <p className="mt-4 text-sm text-rose-300">{loginError}</p>}

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
            >
              Giris Yap
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <nav className="relative z-10 border-b border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 font-black italic text-black shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              B
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">Stellar Academic</h1>
              <p className="mt-1 text-sm text-slate-400">Doping hafiza tarzinda sade ogrenim arayuzu</p>
            </div>
          </div>
          <ConnectButton wallet={wallet} />
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-7xl flex-col px-6 py-8">
        <section className="mb-5 rounded-3xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Hosgeldin, <span className="text-emerald-300">{username}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setPassword("");
              }}
              className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-rose-400/50 hover:text-rose-300"
            >
              Cikis
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActivePage(item.key)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  activePage === item.key
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_26px_rgba(16,185,129,0.28)]"
                    : "border border-white/10 bg-slate-900/80 text-slate-300 hover:border-emerald-500/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-white">{pageTitle}</h2>
          <p className="text-sm leading-6 text-slate-400">{pageDescription}</p>
        </section>

        <section className="flex-1">{renderPage()}</section>
      </main>
    </div>
  );
}

export default App;
