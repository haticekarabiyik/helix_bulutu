import React, { useState } from "react";

type Tab = "DERSLER" | "SORU BANKASI" | "DENEMELER" | "HARİTA" | "İSTATİSTİK" | "PROFİL";
type Difficulty = "Kolay" | "Orta" | "Zor";
type ExamState = "none" | "settings" | "active" | "result";

// Dummy Soru Veritabanı
const QUESTIONS_DB: Record<string, Record<Difficulty, Array<{ q: string, options: string[], answer: number }>>> = {
  Matematik: {
    Kolay: [
      { q: "lim (x→2) (x² - 4)/(x - 2) limitinin değeri kaçtır?", options: ["2", "4", "0", "Belirsiz"], answer: 1 },
      { q: "f(x) = 3x² fonksiyonunun birinci türevi f'(x) nedir?", options: ["3x", "6x", "6", "x²"], answer: 1 },
      { q: "A(2, 3) ve B(5, 7) noktaları arasındaki uzaklık kaç birimdir?", options: ["3", "4", "5", "7"], answer: 2 }
    ],
    Orta: [
      { q: "∫ x·eˣ dx belirsiz integralinin sonucu nedir? (c = sabit)", options: ["eˣ(x-1) + c", "eˣ(x+1) + c", "x²·eˣ + c", "eˣ/x + c"], answer: 0 },
      { q: "Matris A = [[2, 1], [1, 3]] için A'nın determinantı (det A) kaçtır?", options: ["5", "6", "7", "4"], answer: 0 },
      { q: "f(x) = x³ - 3x + 2 fonksiyonunun yerel minimum noktasının x apsisi nedir?", options: ["-1", "0", "1", "2"], answer: 2 }
    ],
    Zor: [
      { q: "y'' + 4y = 0 diferansiyel denkleminin genel çözümü nedir?", options: ["c₁·e²ˣ + c₂·e⁻²ˣ", "c₁·cos(2x) + c₂·sin(2x)", "c₁·x² + c₂", "c₁·eˣ·cos(2x)"], answer: 1 },
      { q: "Laplace dönüşümü L{sin(at)} ifadesinin eşiti nedir?", options: ["s / (s² + a²)", "a / (s² + a²)", "1 / (s² + a²)", "a / (s² - a²)"], answer: 1 }
    ]
  },
  Fizik: {
    Kolay: [
      { q: "Kütlesi 5 kg olan durgun bir cisme 20 N net kuvvet uygulandığında ivmesi ne olur?", options: ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"], answer: 1 },
      { q: "Potansiyel enerjisi mgh olan bir cisim yere düştüğünde kinetik enerjisi ne olur? (Sürtünmesiz)", options: ["0", "mgh/2", "mgh", "2mgh"], answer: 2 }
    ],
    Orta: [
      { q: "Sürtünmesiz eğik düzlemde (açı θ = 30°) serbest bırakılan cismin ivmesi nedir? (g=10 m/s²)", options: ["10 m/s²", "5 m/s²", "8 m/s²", "0 m/s²"], answer: 1 },
      { q: "İki nokta yük q₁=2C ve q₂=3C aralarındaki uzaklık 1m iken birbirine F kuvveti uyguluyor. Uzaklık 2m olursa kuvvet ne olur?", options: ["F/2", "F/4", "2F", "4F"], answer: 1 }
    ],
    Zor: [
      { q: "Açısal momentumun korunduğu (dış tork=0) bir sistemde, sistemin eylemsizlik momenti (I) yarıya düşerse açısal hızı (ω) nasıl değişir?", options: ["Yarıya düşer", "İki katına çıkar", "Değişmez", "Dört katına çıkar"], answer: 1 },
      { q: "RLC seri devresinde rezonans frekansı (f) hangi formülle bulunur?", options: ["1 / (2π√LC)", "√LC / 2π", "1 / (RC)", "R / L"], answer: 0 }
    ]
  }
};

// Tekil Sorular Veritabanı
const SINGLE_QUESTIONS = {
  Matematik: [
    { id: 1, topic: "Limit ve Süreklilik", title: "Soru 1: 0/0 Belirsizliği", difficulty: "Kolay", qData: QUESTIONS_DB.Matematik.Kolay[0] },
    { id: 2, topic: "Türev", title: "Soru 1: Çarpımın Türevi", difficulty: "Orta", qData: QUESTIONS_DB.Matematik.Orta[2] },
    { id: 3, topic: "İntegral", title: "Soru 1: Kısmi İntegrasyon", difficulty: "Zor", qData: QUESTIONS_DB.Matematik.Orta[0] },
  ],
  Fizik: [
    { id: 4, topic: "Mekanik", title: "Soru 1: Dinamik Temel Prensibi", difficulty: "Kolay", qData: QUESTIONS_DB.Fizik.Kolay[0] },
    { id: 5, topic: "Mekanik", title: "Soru 2: Eğik Düzlem", difficulty: "Orta", qData: QUESTIONS_DB.Fizik.Orta[0] },
    { id: 6, topic: "Elektrik", title: "Soru 1: Coulomb Yasası", difficulty: "Orta", qData: QUESTIONS_DB.Fizik.Orta[1] },
  ]
};

const EngineeringJourney = () => {
  const [activeTab, setActiveTab] = useState<Tab>("DERSLER");
  
  // Video Modal State
  const [activeVideo, setActiveVideo] = useState<{ title: string, url: string } | null>(null);

  // Sınav Durumları (State)
  const [examState, setExamState] = useState<ExamState>("none");
  const [examSubject, setExamSubject] = useState<"Matematik" | "Fizik">("Matematik");
  const [examDifficulty, setExamDifficulty] = useState<Difficulty>("Orta");
  
  // Aktif Sınav İlerlemesi
  const [activeExamQuestions, setActiveExamQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  // Fonksiyonlar
  const startExamSetup = (subject: "Matematik" | "Fizik") => {
    setExamSubject(subject);
    setExamDifficulty("Orta");
    setExamState("settings");
  };

  const beginTest = () => {
    setActiveExamQuestions(QUESTIONS_DB[examSubject][examDifficulty]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamState("active");
  };

  const startSingleQuestion = (subject: "Matematik" | "Fizik", qData: any) => {
    setExamSubject(subject);
    setActiveExamQuestions([qData]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamState("active");
  };

  const finishTest = () => {
    setExamState("result");
  };

  const closeExam = () => {
    setExamState("none");
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  // Doğru sayısını hesapla
  const correctCount = activeExamQuestions.reduce((count, q, idx) => {
    return count + (selectedAnswers[idx] === q.answer ? 1 : 0);
  }, 0);


  /* --- ANA İÇERİK RENDER METODU --- */
  const renderMainContent = () => {
    if (examState === "settings") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#36435A] p-10 rounded-3xl border border-slate-600/50 shadow-2xl w-full max-w-2xl text-center">
            <div className="text-6xl mb-6">{examSubject === "Matematik" ? "📐" : "⚙️"}</div>
            <h2 className="text-2xl font-black text-slate-100 mb-2 uppercase">{examSubject} Sınavı Kurulumu</h2>
            <p className="text-slate-400 mb-10">Lütfen çözmek istediğiniz testin zorluk seviyesini seçin.</p>
            
            <div className="flex justify-center gap-4 mb-10">
              {(["Kolay", "Orta", "Zor"] as Difficulty[]).map((level) => {
                 const isActive = examDifficulty === level;
                 let colorClass = "border-slate-500 text-slate-400 hover:border-emerald-400 hover:text-emerald-400";
                 if (level === "Orta") colorClass = "border-slate-500 text-slate-400 hover:border-orange-400 hover:text-orange-400";
                 if (level === "Zor") colorClass = "border-slate-500 text-slate-400 hover:border-rose-500 hover:text-rose-500";
                 
                 if (isActive) {
                    if (level === "Kolay") colorClass = "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]";
                    if (level === "Orta") colorClass = "bg-orange-500/20 border-orange-400 text-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.3)]";
                    if (level === "Zor") colorClass = "bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                 }

                 return (
                   <button 
                     key={level} 
                     onClick={() => setExamDifficulty(level)}
                     className={`px-8 py-4 rounded-xl border-2 font-bold transition-all text-lg ${colorClass}`}
                   >
                     {level}
                   </button>
                 )
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={closeExam} className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 font-bold hover:bg-slate-700 transition-colors">
                İptal Et
              </button>
              <button onClick={beginTest} className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-black hover:bg-indigo-400 transition-colors shadow-lg">
                SINAVA BAŞLA ▶
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (examState === "active" && activeExamQuestions.length > 0) {
      const currentQ = activeExamQuestions[currentQuestionIndex];
      const accent = examSubject === "Matematik" ? "text-emerald-400" : "text-orange-400";
      const isSingleMode = activeExamQuestions.length === 1;
      
      return (
        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
           <header className="flex justify-between items-center bg-[#36435A] p-6 rounded-2xl border border-slate-600/30 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{examSubject} Sorusu <span className="text-sm font-normal text-slate-400">({isSingleMode ? "Bireysel Soru" : examDifficulty})</span></h2>
              </div>
              <div className="flex items-center gap-4">
                 {!isSingleMode && <span className="text-sm font-bold text-slate-400">Soru: <span className={`text-lg ${accent}`}>{currentQuestionIndex + 1} / {activeExamQuestions.length}</span></span>}
                 <button onClick={closeExam} className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center hover:bg-rose-500 transition-colors text-white font-bold">✕</button>
              </div>
           </header>

           <div className="flex-1 bg-[#36435A] p-10 rounded-2xl border border-slate-600/30 shadow-lg flex flex-col">
              <h3 className="text-2xl font-medium text-slate-100 mb-10 leading-relaxed text-center">
                 {currentQ.q}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto w-full flex-1">
                 {currentQ.options.map((opt: string, idx: number) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                    const ring = examSubject === "Matematik" ? "ring-emerald-400 bg-emerald-500/10" : "ring-orange-400 bg-orange-500/10";
                    return (
                      <button 
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`p-6 rounded-xl border-2 text-left text-lg font-bold transition-all flex items-center gap-4 
                        ${isSelected ? `border-transparent ring-2 ${ring} text-white` : 'border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-700/50'}`}
                      >
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm ${isSelected ? (examSubject === "Matematik" ? "border-emerald-400 text-emerald-400" : "border-orange-400 text-orange-400") : "border-slate-500"}`}>
                            {["A", "B", "C", "D"][idx]}
                         </div>
                         {opt}
                      </button>
                    )
                 })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10">
                 <button 
                   onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                   disabled={currentQuestionIndex === 0}
                   className="px-6 py-3 rounded-xl border border-slate-600 font-bold text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
                 >
                   Önceki Soru
                 </button>
                 
                 {currentQuestionIndex === activeExamQuestions.length - 1 ? (
                   <button 
                     onClick={finishTest}
                     className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-black hover:bg-indigo-400 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                   >
                     {isSingleMode ? "CEVABI ONAYLA ✔" : "SINAVI BİTİR 🏁"}
                   </button>
                 ) : (
                   <button 
                     onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                     className="px-6 py-3 rounded-xl bg-slate-200 text-slate-900 font-black hover:bg-white transition-colors"
                   >
                     Sonraki Soru
                   </button>
                 )}
              </div>
           </div>
        </div>
      )
    }

    if (examState === "result") {
      const percentage = Math.round((correctCount / activeExamQuestions.length) * 100);
      const isSuccess = percentage >= 50;
      const isSingleMode = activeExamQuestions.length === 1;

      return (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
          <div className="bg-[#36435A] p-12 rounded-3xl border border-slate-600/50 shadow-2xl w-full max-w-2xl text-center relative overflow-hidden">
            {isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-emerald-400"></div>}
            {!isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>}
            
            <div className="text-7xl mb-6">{isSuccess ? "🎉" : "💪"}</div>
            <h2 className="text-3xl font-black text-slate-100 mb-2 uppercase">
              {isSingleMode ? (isSuccess ? "Doğru Cevap!" : "Yanlış Cevap!") : "Sınav Tamamlandı!"}
            </h2>
            <p className="text-slate-400 mb-8">{examSubject} {isSingleMode ? "Sorusu" : `- ${examDifficulty} Seviyesi`}</p>
            
            {!isSingleMode && (
              <div className="flex justify-center items-center gap-12 mb-10">
                 <div className="flex flex-col items-center">
                    <span className="text-5xl font-black text-slate-100 mb-2">{correctCount}</span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Doğru</span>
                 </div>
                 <div className="w-px h-16 bg-slate-600"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-5xl font-black text-slate-100 mb-2">{activeExamQuestions.length - correctCount}</span>
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Yanlış/Boş</span>
                 </div>
                 <div className="w-px h-16 bg-slate-600"></div>
                 <div className="flex flex-col items-center">
                    <span className={`text-5xl font-black mb-2 ${isSuccess ? 'text-emerald-400' : 'text-rose-500'}`}>%{percentage}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Başarı Oranı</span>
                 </div>
              </div>
            )}

            <button onClick={closeExam} className="w-full mt-6 py-4 rounded-xl bg-slate-200 text-slate-900 font-black hover:bg-white transition-colors text-lg">
              SİSTEME GERİ DÖN
            </button>
          </div>
        </div>
      )
    }

    // Normal Sekmeler
    switch (activeTab) {
      case "DERSLER":
        return <DerslerContent onPlayVideo={(title, url) => setActiveVideo({ title, url })} />;
      case "SORU BANKASI":
        return <SoruBankasiContent onStartExam={(subj) => startExamSetup(subj)} onSingleQuestion={startSingleQuestion} />;
      case "DENEMELER":
        return <DenemelerContent onStart={(subj) => startExamSetup(subj)} />;
      case "İSTATİSTİK":
        return <IstatistikContent />;
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-[#36435A] rounded-2xl border border-slate-600/30">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Bu bölüm yakında eklenecek</p>
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex w-full min-h-[800px] bg-[#29344A] text-white font-sans rounded-3xl overflow-hidden shadow-2xl border border-slate-600/50 relative">
        {/* Sidebar */}
        <aside className="w-64 bg-[#20293A] flex flex-col items-center py-8 px-0 border-r border-slate-700/50">
          <div className="flex flex-col items-center px-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-slate-600 overflow-hidden mb-3">
              <div className="w-full h-full bg-blue-100 flex items-end justify-center">
                 <span className="text-5xl">🧑‍🎓</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Umut Öztürk</h3>
            <p className="text-xs text-slate-400">Mühendislik Öğrencisi</p>
          </div>
          
          <nav className={`w-full flex flex-col gap-1 ${examState !== "none" ? "opacity-50 pointer-events-none" : ""}`}>
            <NavItem icon="📖" label="DERSLER" active={activeTab === "DERSLER"} onClick={() => setActiveTab("DERSLER")} />
            <NavItem icon="📝" label="SORU BANKASI" active={activeTab === "SORU BANKASI"} onClick={() => setActiveTab("SORU BANKASI")} />
            <NavItem icon="🎯" label="DENEMELER" active={activeTab === "DENEMELER"} onClick={() => setActiveTab("DENEMELER")} />
            <NavItem icon="🗺️" label="HARİTA" active={activeTab === "HARİTA"} onClick={() => setActiveTab("HARİTA")} />
            <NavItem icon="📊" label="İSTATİSTİK" active={activeTab === "İSTATİSTİK"} onClick={() => setActiveTab("İSTATİSTİK")} />
            <NavItem icon="👤" label="PROFİL" active={activeTab === "PROFİL"} onClick={() => setActiveTab("PROFİL")} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 flex flex-col gap-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-700/20 via-[#29344A] to-[#29344A] overflow-y-auto max-h-[800px] custom-scrollbar">
          {/* Header */}
          {examState === "none" && (
            <header className="flex justify-between items-start mb-2 animate-in fade-in">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-wider text-slate-100 drop-shadow-md">Mühendislik Yolculuğun</h1>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">GÜNLÜK HEDEF: 12/20 PUAN</span>
                  <div className="flex gap-2 h-2">
                     <div className="w-16 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
                     <div className="w-16 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
                     <div className="w-16 bg-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-yellow-400 drop-shadow-md">450 PUAN</span>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                   ⭐
                </div>
              </div>
            </header>
          )}

          {renderMainContent()}
        </main>
      </div>

      {/* VIDEO MODAL OVRERLAY */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 animate-in fade-in duration-300">
          <div className="bg-[#20293A] p-6 rounded-3xl border border-slate-600/50 shadow-2xl w-full max-w-4xl flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white">{activeVideo.title}</h2>
                  <p className="text-sm text-emerald-400 mt-1">▶ Oynatılıyor...</p>
                </div>
                <button 
                  onClick={() => setActiveVideo(null)} 
                  className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-colors text-xl font-bold"
                >
                  ✕
                </button>
             </div>
             <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={activeVideo.url} 
                  title={activeVideo.title} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.8);
          border-radius: 20px;
        }
      `}</style>
    </>
  );
};

/* --- TAB İÇERİKLERİ --- */

const DerslerContent = ({ onPlayVideo }: { onPlayVideo: (title: string, url: string) => void }) => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
    <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30 relative">
      <h2 className="text-xs font-bold text-slate-300 mb-8 uppercase tracking-wider">Ana Konular İlerlemesi</h2>
      <div className="flex justify-between items-center px-12 relative">
        <div className="absolute top-10 left-24 right-24 h-2 bg-[#29344A] -z-0 rounded-full"></div>
        <div className="absolute top-10 left-24 right-1/2 h-2 bg-emerald-400 -z-0 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
        <TopicCircle title="Kalkülüs" progress={90} icon="📐" color="emerald" />
        <TopicCircle title="Fizik & Mekanik" progress={50} icon="⚙️" color="orange" />
        <TopicCircle title="Algoritmalar" progress={20} icon="💻" color="blue" />
        <TopicCircle title="Devre Teorisi" progress={0} icon="🔌" color="slate" />
      </div>
    </section>

    <div className="grid grid-cols-2 gap-6">
       <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30">
         <h2 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="text-xl">📐</span> Matematik Dersleri
         </h2>
         <div className="flex flex-col gap-4">
            <CourseCard onPlay={() => onPlayVideo("Kalkülüs I: Limit ve Süreklilik", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Kalkülüs I: Limit ve Süreklilik" instructor="Prof. Dr. Ali Nesin" duration="45dk" active />
            <CourseCard onPlay={() => onPlayVideo("Diferansiyel Denklemler", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Diferansiyel Denklemler" instructor="Doç. Dr. Ayşe Yılmaz" duration="1s 20dk" />
            <CourseCard onPlay={() => onPlayVideo("Lineer Cebir", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Lineer Cebir" instructor="Dr. Mehmet Öz" duration="50dk" />
         </div>
       </section>

       <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30">
         <h2 className="text-xs font-bold text-orange-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="text-xl">⚙️</span> Fizik Dersleri
         </h2>
         <div className="flex flex-col gap-4">
            <CourseCard onPlay={() => onPlayVideo("Newton Yasaları ve Statik", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Newton Yasaları ve Statik" instructor="Prof. Dr. Celal Şengör" duration="1s 15dk" active />
            <CourseCard onPlay={() => onPlayVideo("Elektromanyetizma", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Elektromanyetizma" instructor="Doç. Dr. Kemal Işık" duration="55dk" />
            <CourseCard onPlay={() => onPlayVideo("Termodinamik", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} title="Termodinamik" instructor="Dr. Elif Kaya" duration="1s 05dk" />
         </div>
       </section>
    </div>
  </div>
);

const SoruBankasiContent = ({ onStartExam, onSingleQuestion }: { onStartExam: (s: "Matematik"| "Fizik") => void, onSingleQuestion: (s: "Matematik" | "Fizik", q: any) => void }) => (
  <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
    <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30 flex flex-col">
      <h2 className="text-xs font-bold text-emerald-400 mb-6 uppercase tracking-wider flex items-center gap-2">
         <span className="text-xl">📐</span> Matematik Soru Bankası
      </h2>
      
      <div className="mb-6 flex flex-col gap-2">
         <h3 className="text-[10px] uppercase font-bold text-slate-400 mb-2">Bireysel Sorular (Tek Tek Çöz)</h3>
         {SINGLE_QUESTIONS.Matematik.map((sq) => (
            <div key={sq.id} onClick={() => onSingleQuestion("Matematik", sq.qData)} className="flex justify-between items-center bg-[#29344A] p-3 rounded-lg border border-slate-600/50 cursor-pointer hover:border-emerald-400 transition-colors group">
               <div>
                 <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{sq.title}</span>
                 <p className="text-[10px] text-slate-400">{sq.topic} - Zorluk: {sq.difficulty}</p>
               </div>
               <span className="text-lg opacity-50 group-hover:opacity-100 group-hover:text-emerald-400">✏️</span>
            </div>
         ))}
      </div>

      <button onClick={() => onStartExam("Matematik")} className="w-full mt-auto bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 font-black py-4 rounded-xl transition-all border border-emerald-500/30 shadow-lg">
         RASTGELE TEST BAŞLAT (Karma)
      </button>
    </section>

    <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30 flex flex-col">
      <h2 className="text-xs font-bold text-orange-400 mb-6 uppercase tracking-wider flex items-center gap-2">
         <span className="text-xl">⚙️</span> Fizik Soru Bankası
      </h2>
      
      <div className="mb-6 flex flex-col gap-2">
         <h3 className="text-[10px] uppercase font-bold text-slate-400 mb-2">Bireysel Sorular (Tek Tek Çöz)</h3>
         {SINGLE_QUESTIONS.Fizik.map((sq) => (
            <div key={sq.id} onClick={() => onSingleQuestion("Fizik", sq.qData)} className="flex justify-between items-center bg-[#29344A] p-3 rounded-lg border border-slate-600/50 cursor-pointer hover:border-orange-400 transition-colors group">
               <div>
                 <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{sq.title}</span>
                 <p className="text-[10px] text-slate-400">{sq.topic} - Zorluk: {sq.difficulty}</p>
               </div>
               <span className="text-lg opacity-50 group-hover:opacity-100 group-hover:text-orange-400">✏️</span>
            </div>
         ))}
      </div>

      <button onClick={() => onStartExam("Fizik")} className="w-full mt-auto bg-orange-500/10 hover:bg-orange-500 hover:text-white text-orange-400 font-black py-4 rounded-xl transition-all border border-orange-500/30 shadow-lg">
         RASTGELE TEST BAŞLAT (Karma)
      </button>
    </section>
  </div>
);

const DenemelerContent = ({ onStart }: { onStart: (subject: "Matematik" | "Fizik") => void }) => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
     <div className="grid grid-cols-2 gap-6">
       {/* Matematik Denemeleri */}
       <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30">
         <h2 className="text-xs font-bold text-emerald-400 mb-6 uppercase tracking-wider">📐 Matematik Denemeleri</h2>
         <div className="grid grid-cols-1 gap-4">
            <ExamCard onStart={() => onStart("Matematik")} title="Kalkülüs I - Vize Simülasyonu" color="emerald" status="completed" score="85/100" />
            <ExamCard onStart={() => onStart("Matematik")} title="Lineer Cebir - Mini Deneme" color="emerald" status="pending" />
            <ExamCard onStart={() => onStart("Matematik")} title="Diferansiyel - Genel Tarama" color="emerald" status="pending" />
         </div>
       </section>

       {/* Fizik Denemeleri */}
       <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30">
         <h2 className="text-xs font-bold text-orange-400 mb-6 uppercase tracking-wider">⚙️ Fizik Denemeleri</h2>
         <div className="grid grid-cols-1 gap-4">
            <ExamCard onStart={() => onStart("Fizik")} title="Fizik 101 - Vize Simülasyonu" color="orange" status="completed" score="60/100" />
            <ExamCard onStart={() => onStart("Fizik")} title="Mekanik - Tarama Sınavı" color="orange" status="pending" />
            <ExamCard onStart={() => onStart("Fizik")} title="Elektromanyetizma Sınavı" color="orange" status="pending" />
         </div>
       </section>
     </div>
  </div>
);

const IstatistikContent = () => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
     <div className="grid grid-cols-2 gap-6">
        <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30 flex flex-col items-center justify-center text-center">
           <h2 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-wider w-full text-left">📐 Matematik İstatistiği</h2>
           <div className="w-32 h-32 rounded-full border-[10px] border-[#29344A] border-t-emerald-400 border-r-emerald-400 border-b-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              <span className="text-4xl font-black text-slate-100">%75</span>
           </div>
           <h3 className="font-bold text-lg text-slate-200">Kalkülüs Başarısı</h3>
           <p className="text-sm text-slate-400 mt-2">Son 5 denemede ortalaman %75. Limit uygulamalarında çok iyisin!</p>
        </section>

        <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30 flex flex-col items-center justify-center text-center">
           <h2 className="text-xs font-bold text-orange-400 mb-4 uppercase tracking-wider w-full text-left">⚙️ Fizik İstatistiği</h2>
           <div className="w-32 h-32 rounded-full border-[10px] border-[#29344A] border-t-orange-400 border-r-orange-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(251,146,60,0.2)]">
              <span className="text-4xl font-black text-slate-100">%50</span>
           </div>
           <h3 className="font-bold text-lg text-slate-200">Mekanik Başarısı</h3>
           <p className="text-sm text-slate-400 mt-2">Dinamik konularında biraz daha pratik yapmalısın. Vektörler tam puan!</p>
        </section>
     </div>

     {/* Detaylı Konu Analizi */}
     <section className="bg-[#36435A] rounded-2xl p-6 shadow-lg border border-slate-600/30">
         <h2 className="text-xs font-bold text-slate-300 mb-6 uppercase tracking-wider">Detaylı Konu Analizi</h2>
         <div className="grid grid-cols-2 gap-4">
            <ActivityBar icon="📈" label="Matematik: Limit" subtext="Güçlü Yönün" progress={95} color="emerald" />
            <ActivityBar icon="📈" label="Fizik: Vektörler" subtext="Güçlü Yönün" progress={100} color="orange" />
            <ActivityBar icon="📉" label="Matematik: İntegral" subtext="Geliştirilmeli" progress={40} color="rose" />
            <ActivityBar icon="📉" label="Fizik: Enerji Korunumu" subtext="Geliştirilmeli" progress={35} color="rose" />
         </div>
     </section>
  </div>
);

/* --- ALT BİLEŞENLER --- */

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-8 py-4 text-left font-bold text-xs tracking-widest transition-colors ${active ? 'text-orange-400 border-l-4 border-orange-500 bg-black/20' : 'text-slate-400 hover:text-slate-200 border-l-4 border-transparent hover:bg-black/10'}`}>
    <span className={`text-xl ${active ? 'opacity-100' : 'opacity-70'}`}>{icon}</span>
    {label}
  </button>
);

const TopicCircle = ({ title, progress, icon, color }: { title: string, progress: number, icon: string, color: string }) => {
  const isEmerald = color === 'emerald';
  const isOrange = color === 'orange';
  const isBlue = color === 'blue';
  
  let ringColor = 'border-[#29344A]';
  if (isEmerald) ringColor = 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]';
  if (isOrange) ringColor = 'border-orange-400 border-r-[#29344A] border-b-[#29344A] shadow-[0_0_15px_rgba(251,146,60,0.3)]'; 
  if (isBlue) ringColor = 'border-blue-400 border-r-[#29344A] border-b-[#29344A] border-l-[#29344A]'; 

  return (
    <div className="flex flex-col items-center gap-3 relative z-10 group cursor-default">
      <div className={`w-20 h-20 rounded-full bg-[#36435A] flex flex-col items-center justify-center border-[6px] ${ringColor} transition-transform group-hover:scale-110`}>
         <span className="text-2xl mb-0.5">{icon}</span>
         <span className="text-[10px] font-black text-slate-200">{progress}%</span>
      </div>
      <span className="text-xs font-bold text-slate-300 text-center w-24 leading-tight uppercase tracking-wide group-hover:text-white transition-colors">{title}</span>
    </div>
  );
};

const ActivityBar = ({ icon, label, subtext, progress, color }: { icon: string, label: string, subtext: string, progress: number, color: string }) => {
  let bg = 'bg-slate-400';
  let text = 'text-slate-400';
  if (color === 'emerald') { bg = 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'; text = 'text-emerald-400'; }
  if (color === 'orange') { bg = 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]'; text = 'text-orange-400'; }
  if (color === 'rose') { bg = 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'; text = 'text-rose-500'; }

  return (
    <div className="bg-[#29344A] px-4 py-3 rounded-xl border border-slate-600/50 relative overflow-hidden flex items-center gap-3">
       <span className="text-lg opacity-80 relative z-10">{icon}</span>
       <div className="flex-1 relative z-10">
         <div className="flex items-center gap-2">
           <span className="text-sm font-bold text-slate-200">{label}</span>
           <span className={`text-sm font-semibold ${text}`}>{subtext}</span>
         </div>
       </div>
       <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#1e2638]">
          <div className={`h-full ${bg} rounded-r-full`} style={{ width: `${progress}%` }}></div>
       </div>
    </div>
  );
};

const CourseCard = ({ title, instructor, duration, active, onPlay }: { title: string, instructor: string, duration: string, active?: boolean, onPlay: () => void }) => (
  <div onClick={onPlay} className={`flex gap-4 items-center bg-[#29344A] p-4 rounded-xl border transition-colors cursor-pointer ${active ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-600/50 hover:border-slate-400'}`}>
     <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden relative flex-shrink-0 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center">
          <span className="text-xl transition-transform group-hover:scale-125">▶️</span>
        </div>
     </div>
     <div className="flex-1">
        <h3 className="text-sm font-bold mb-1 text-slate-100 group-hover:text-indigo-400 transition-colors">{title}</h3>
        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
           <span className="text-sm">🧑‍🏫</span> {instructor}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">⏱️ {duration}</span>
          {active && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Devam Ediyor</span>}
        </div>
     </div>
  </div>
);

const ExamCard = ({ title, color, status, score, onStart }: { title: string, color: string, status: 'completed' | 'pending', score?: string, onStart: () => void }) => {
  const isEmerald = color === 'emerald';
  const accent = isEmerald ? 'text-emerald-400' : 'text-orange-400';
  const border = isEmerald ? 'border-emerald-500/30' : 'border-orange-500/30';
  const bg = isEmerald ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-orange-500 hover:bg-orange-400';

  return (
    <div className={`bg-[#29344A] p-5 rounded-xl border ${border} flex justify-between items-center transition-colors hover:bg-[#2c3852]`}>
       <div>
         <h3 className="text-sm font-bold text-slate-100 mb-2">{title}</h3>
         <div className="flex gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1">📊 Seçilebilir Zorluk</span>
         </div>
       </div>
       <div>
          {status === 'completed' ? (
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                   <span className={`text-lg font-black ${accent}`}>{score}</span>
                   <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Tamamlandı</span>
                </div>
                <button onClick={onStart} className={`ml-2 px-3 py-1 border ${border} rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors`}>
                   Tekrar Çöz
                </button>
             </div>
          ) : (
             <button onClick={onStart} className={`${bg} text-slate-900 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md`}>
                Sınava Başla
             </button>
          )}
       </div>
    </div>
  )
};

export default EngineeringJourney;
