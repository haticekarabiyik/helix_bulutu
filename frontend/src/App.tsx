import { useEffect, useState } from "react";
import { ConnectButton } from "./components/ConnectButton";
import ChatPanel from "./components/ChatPanel";
import CoulombCalculator from "./components/CoulombCalculator";
import GradeCalculator from "./components/GradeCalculator";
import LessonCatalog from "./components/LessonCatalog";
import SchedulePlanner from "./components/SchedulePlanner";
import { UserProfile } from "./components/UserProfile";

import { WalletInfo } from "./components/WalletInfo";
import { AcademicRecordsContract } from "./components/AcademicRecordsContract";
import { CounterContract } from "./components/CounterContract";
import FormulaDictionary from "./components/FormulaDictionary";
import GoogleCalendarPanel from "./components/GoogleCalendarPanel";
import LearningPanel from "./components/LearningPanel";
import Web3Rewards, { type LearningRewardEvent } from "./components/Web3Rewards";
import CourseList from "./components/CourseList";
import EngineeringJourney from "./components/EngineeringJourney";
import { useFreighter } from "./hooks/useFreighter";
import { loadProfile } from "./lib/profileStorage";

type PageKey =
  | "journey"
  | "profile"
  | "coulomb"
  | "planner"
  | "grades"
  | "purchase"
  | "chat"
  | "dashboard";

type NavItem = {
  key: PageKey;
  label: string;
  title: string;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "journey",
    label: "Mühendislik Yolculuğu",
    title: "Mühendislik Yolculuğu",
    description: "İlerlemeni ve önerilen sıradaki adımları görüntüle.",
  },
  {
    key: "profile",
    label: "Profil",
    title: "Profil",
    description: "Görünen adını ve oturum bilgilerini düzenle.",
  },
  {
    key: "coulomb",
    label: "Coulomb Hesaplayıcı",
    title: "Coulomb Hesaplayıcı",
    description: "Yükler arası kuvveti hızlıca hesaplamak için kullan.",
  },
  {
    key: "planner",
    label: "Çalışma Planı",
    title: "Çalışma Planı",
    description: "Haftalık çalışma programını oluştur ve takip et.",
  },
  {
    key: "grades",
    label: "Not Hesaplayıcı",
    title: "Not Hesaplayıcı",
    description: "Sınav ve ödev notlarından ortalama hesapla.",
  },
  {
    key: "purchase",
    label: "Ders Mağazası",
    title: "Ders Mağazası",
    description: "Stellar testnet üzerinden ders erişimi satın al.",
  },
  {
    key: "chat",
    label: "Sohbet",
    title: "Sohbet",
    description: "Demo sohbet panelinde sorularını dene.",
  },
  {
    key: "dashboard",
    label: "Web3 Panosu",
    title: "Web3 Panosu",
    description: "Cüzdan, kontratlar ve ödüllerin tek ekranda özeti.",
  },
];

function App() {
  const [activePage, setActivePage] = useState<PageKey>("journey");
  const [rewardEvent, setRewardEvent] = useState<LearningRewardEvent | null>(null);
  const [reviewTopic, setReviewTopic] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { status, address } = useFreighter();

  useEffect(() => {
    if (status === "connected" && address && !username) {
      const input = window.prompt("Kullanıcı adınızı girin:");
      if (input && input.trim()) {
        const trimmed = input.trim();
        setUsername(trimmed);
        setDisplayName(loadProfile(trimmed).displayName);
      }
    }
    if (status !== "connected") {
      setUsername("");
      setDisplayName("");
    }
  }, [status, address, username]);

  const activeNav = NAV_ITEMS.find((item) => item.key === activePage);
  const pageTitle = activeNav?.title ?? "";
  const pageDescription = activeNav?.description ?? "";

  const renderPage = () => {
    if (activePage === "journey") return <EngineeringJourney />;
    if (activePage === "profile")
      return (
        <UserProfile
          sessionUsername={username}
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
        />
      );
    if (activePage === "coulomb") return <CoulombCalculator />;
    if (activePage === "planner") return <SchedulePlanner />;
    if (activePage === "grades") return <GradeCalculator />;
    if (activePage === "purchase") return <LessonCatalog />;
    if (activePage === "chat") return <ChatPanel />;
    return (
      <div className="flex flex-col gap-6">
        <WalletInfo />
        <CounterContract />
        <CourseList />
        <AcademicRecordsContract />
        <FormulaDictionary />
        <GoogleCalendarPanel suggestedTopic={reviewTopic} />
        <Web3Rewards event={rewardEvent} />
        <LearningPanel onReward={setRewardEvent} onReviewNeeded={setReviewTopic} />
      </div>
    );
  };

  if (status !== "connected" || !address || !username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810] text-slate-300 font-sans">
        <div className="flex flex-col items-center gap-6">
          <ConnectButton />
          <p className="text-lg">Devam etmek için cüzdan ile bağlanın ve kullanıcı adınızı girin.</p>
        </div>
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
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                Stellar Academic
              </h1>
              <p className="mt-1 text-sm text-slate-400">Doping hafıza tarzında sade öğrenim arayüzü</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-7xl flex-col px-6 py-8">
        <section className="mb-5 rounded-3xl border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Hoş geldin, <span className="text-emerald-300">{displayName || username}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setUsername("");
                setDisplayName("");
              }}
              className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-rose-400/50 hover:text-rose-300"
            >
              Kullanıcıyı değiştir
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

        {activePage !== "journey" && activePage !== "profile" && (
          <section className="mb-5 rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-white">{pageTitle}</h2>
            <p className="text-sm leading-6 text-slate-400">{pageDescription}</p>
          </section>
        )}

        <section className={`flex-1 ${activePage === 'journey' ? 'mt-2' : ''}`}>{renderPage()}</section>
      </main>
    </div>
  );
}

export default App;
