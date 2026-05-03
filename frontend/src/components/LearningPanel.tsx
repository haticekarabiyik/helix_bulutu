import { useState } from "react";
import styles from "./LearningPanel.module.css";
import type { LearningRewardEvent } from "./Web3Rewards";

const topics = [
  { key: "vectors", label: "Vektorel Toplama" },
  { key: "coulomb", label: "Coulomb Yasasi" },
  { key: "electric_field", label: "Elektrik Alani" },
  { key: "electric_potential", label: "Elektrik Potansiyeli" },
  { key: "ohm", label: "Ohm Yasasi" },
  { key: "circuits", label: "Elektrik Devreleri" },
  { key: "capacitors", label: "Sigaclar" },
  { key: "newton", label: "Newton'un 2. Yasasi" },
  { key: "energy", label: "Is ve Enerji" },
  { key: "momentum", label: "Momentum" },
  { key: "pressure", label: "Basinc" },
  { key: "waves", label: "Dalgalar" },
  { key: "optics", label: "Optik" },
  { key: "thermo", label: "Termodinamik" },
  { key: "magnetism", label: "Manyetizma" },
  { key: "trial", label: "Karma Fizik Denemesi" },
] as const;

type TopicKey = (typeof topics)[number]["key"];
type QuizResult = "correct" | "wrong";
type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
};

const quizzes: Record<TopicKey, QuizQuestion[]> = {
  vectors: [
    {
      q: "Ayni dogrultu ve ayni yondeki 3 N ve 4 N vektorlerin bileskesi nedir?",
      options: ["7 N", "1 N", "5 N"],
      answer: 0,
    },
    {
      q: "Birbirine dik 3 N ve 4 N vektorlerin bileske buyuklugu nedir?",
      options: ["5 N", "7 N", "1 N"],
      answer: 0,
    },
    {
      q: "Iki vektor zit yonluyse bileske buyuklugu nasil bulunur?",
      options: ["Buyukten kucuk cikarilir", "Her zaman toplanir", "Her zaman sifirdir"],
      answer: 0,
    },
  ],
  coulomb: [
    {
      q: "Coulomb yasasinda elektriksel kuvvet hangi ifade ile bulunur?",
      options: ["F = k * |q1 * q2| / r^2", "F = m * a", "V = I * R"],
      answer: 0,
    },
    {
      q: "Iki yuk arasindaki uzaklik iki katina cikarsa kuvvet nasil degisir?",
      options: ["Dortte bire iner", "Iki katina cikar", "Degismez"],
      answer: 0,
    },
  ],
  electric_field: [
    {
      q: "Elektrik alani hangi ifade ile tanimlanir?",
      options: ["E = F / q", "E = m * g", "E = I * R"],
      answer: 0,
    },
    {
      q: "Noktasal yukun elektrik alani uzaklik iki katina cikarsa nasil degisir?",
      options: ["Dortte bire iner", "Iki katina cikar", "Degismez"],
      answer: 0,
    },
    {
      q: "Elektrik alanin SI birimi hangisidir?",
      options: ["N/C", "Ohm", "Joule"],
      answer: 0,
    },
  ],
  electric_potential: [
    {
      q: "Elektriksel potansiyel enerji ile potansiyel iliskisi hangisidir?",
      options: ["U = q * V", "V = I / R", "P = F / A"],
      answer: 0,
    },
    {
      q: "Noktasal yuk icin elektrik potansiyeli hangi ifade ile verilir?",
      options: ["V = k * q / r", "V = f * lambda", "V = m * a"],
      answer: 0,
    },
    {
      q: "Potansiyel farkin birimi nedir?",
      options: ["Volt", "Tesla", "Newton"],
      answer: 0,
    },
  ],
  ohm: [
    {
      q: "Ohm yasasinin formulu nedir?",
      options: ["V = I * R", "F = k * |q1 * q2| / r^2", "E = m * c^2"],
      answer: 0,
    },
    {
      q: "Direnc sabitken akim iki katina cikarsa gerilim ne olur?",
      options: ["Iki katina cikar", "Yariya iner", "Sifir olur"],
      answer: 0,
    },
    {
      q: "V = 12 V ve R = 4 ohm ise akim kac amperdir?",
      options: ["3 A", "16 A", "48 A"],
      answer: 0,
    },
  ],
  circuits: [
    {
      q: "Seri bagli direnclerde esdeger direnc nasil bulunur?",
      options: ["Direncler toplanir", "Direncler carpilir", "En kucuk direnc alinir"],
      answer: 0,
    },
    {
      q: "Paralel bagli ozdes iki direnc icin esdeger direnc nasildir?",
      options: ["Bir direncin yarisidir", "Bir direncin iki katidir", "Sonsuzdur"],
      answer: 0,
    },
    {
      q: "Elektriksel guc hangi formulle bulunabilir?",
      options: ["P = V * I", "P = m * v", "P = F / A"],
      answer: 0,
    },
  ],
  capacitors: [
    {
      q: "Sigac yuk, siga ve gerilim iliskisi hangisidir?",
      options: ["Q = C * V", "F = m * a", "V = I * R"],
      answer: 0,
    },
    {
      q: "Paralel levhali sigacta levha alani artarsa siga nasil degisir?",
      options: ["Artar", "Azalir", "Degismez"],
      answer: 0,
    },
    {
      q: "Sigacta depolanan enerji hangi ifade ile verilebilir?",
      options: ["E = 1/2 * C * V^2", "E = m * c * deltaT", "E = F * A"],
      answer: 0,
    },
  ],
  newton: [
    {
      q: "Newton'un 2. yasasi nedir?",
      options: ["F = m * a", "V = I * R", "P = F / A"],
      answer: 0,
    },
    {
      q: "Net kuvvet sifirsa cismin ivmesi icin ne soylenir?",
      options: ["Ivme sifirdir", "Ivme kesin artar", "Kutle sifirdir"],
      answer: 0,
    },
  ],
  energy: [
    {
      q: "Kinetik enerji formulu nedir?",
      options: ["E_k = 1/2 * m * v^2", "E_p = m * g * h", "p = m * v"],
      answer: 0,
    },
    {
      q: "Yerden yuksekte duran cismin sahip oldugu enerji hangisidir?",
      options: ["Potansiyel enerji", "Manyetik enerji", "Elektrik akimi"],
      answer: 0,
    },
  ],
  momentum: [
    {
      q: "Momentum formulu nedir?",
      options: ["p = m * v", "F = q * E", "V = I * R"],
      answer: 0,
    },
    {
      q: "Kapali bir sistemde carpismalarda hangi buyukluk korunur?",
      options: ["Toplam momentum", "Toplam hacim", "Toplam sicaklik"],
      answer: 0,
    },
  ],
  pressure: [
    {
      q: "Basinc formulu nedir?",
      options: ["P = F / A", "F = m * a", "Q = m * c * deltaT"],
      answer: 0,
    },
    {
      q: "Ayni kuvvet daha kucuk alana uygulanirsa basinc nasil degisir?",
      options: ["Artar", "Azalir", "Degismez"],
      answer: 0,
    },
  ],
  waves: [
    {
      q: "Dalga hizi hangi ifade ile verilir?",
      options: ["v = f * lambda", "P = F / A", "E = m * c^2"],
      answer: 0,
    },
    {
      q: "Frekans artarken dalga hizi sabitse dalga boyu ne olur?",
      options: ["Azalir", "Artar", "Degismez"],
      answer: 0,
    },
  ],
  optics: [
    {
      q: "Yansima yasasina gore gelme acisi neye esittir?",
      options: ["Yansima acisina", "Kirilmaya", "Odak uzakligina"],
      answer: 0,
    },
    {
      q: "Ince kenarli mercek paralel isinlari nasil etkiler?",
      options: ["Odakta toplar", "Tamamen sogurur", "Rastgele sacilir"],
      answer: 0,
    },
  ],
  thermo: [
    {
      q: "Isi miktari icin temel ifade hangisidir?",
      options: ["Q = m * c * deltaT", "p = m * v", "F = q * v * B"],
      answer: 0,
    },
    {
      q: "Sicaklik farki artarsa alinan/verilen isi genelde nasil degisir?",
      options: ["Artar", "Azalir", "Her zaman sifir olur"],
      answer: 0,
    },
  ],
  magnetism: [
    {
      q: "Manyetik alanda hareket eden yuke etkiyen kuvvet hangi buyukluge baglidir?",
      options: ["Yukun hizi", "Kabinin rengi", "Ses siddeti"],
      answer: 0,
    },
    {
      q: "Akım gecen telin cevresinde ne olusur?",
      options: ["Manyetik alan", "Sadece isik", "Kutle kaybi"],
      answer: 0,
    },
  ],
  trial: [
    {
      q: "3 N ve 4 N dik vektorlerin bileskesi ile 6 ohm direncten 2 A akim gecince gerilim toplam kaci verir?",
      options: ["17", "11", "24"],
      answer: 0,
    },
    {
      q: "Q = C * V bagintisinda C = 2 F ve V = 5 V ise yuk kac C olur?",
      options: ["10 C", "2.5 C", "7 C"],
      answer: 0,
    },
    {
      q: "F = q * E bagintisinda q = 3 C ve E = 4 N/C ise kuvvet kac N olur?",
      options: ["12 N", "1.33 N", "7 N"],
      answer: 0,
    },
  ],
};

type LearningPanelProps = {
  onReward?: (event: LearningRewardEvent) => void;
  onReviewNeeded?: (topicLabel: string) => void;
};

export default function LearningPanel({ onReward, onReviewNeeded }: LearningPanelProps) {
  const [results, setResults] = useState<Partial<Record<TopicKey, QuizResult>>>({});
  const [current, setCurrent] = useState<TopicKey | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = (topic: TopicKey) => {
    setCurrent(topic);
    setQuizIdx(0);
    setSelected(null);
    setShowResult(false);
  };

  const handleAnswer = (idx: number) => {
    if (!current) return;

    const topic = topics.find((item) => item.key === current);
    const isCorrect = quizzes[current][quizIdx].answer === idx;

    setSelected(idx);
    setShowResult(true);
    setResults((prev) => ({
      ...prev,
      [current]: isCorrect ? "correct" : "wrong",
    }));

    if (topic && isCorrect) {
      onReward?.({
        id: `${current}-${quizIdx}-${Date.now()}`,
        type: quizIdx === quizzes[current].length - 1 ? "course" : "quiz",
        topicKey: topic.key,
        topicLabel: topic.label,
        correct: true,
      });
    } else if (topic) {
      onReviewNeeded?.(topic.label);
    }
  };

  const nextQuiz = () => {
    setQuizIdx((q) => q + 1);
    setSelected(null);
    setShowResult(false);
  };

  const analyze = () => {
    const weak = Object.entries(results)
      .filter(([, value]) => value === "wrong")
      .map(([key]) => topics.find((topic) => topic.key === key)?.label)
      .filter(Boolean);

    if (weak.length === 0) return "Tebrikler! Simdilik zayif konu gorunmuyor.";
    return `${weak.join(", ")} konusuna tekrar bakmalisin.`;
  };

  return (
    <div className={styles.panel}>
      <h2>Kisisel Ogrenme Paneli</h2>
      <div className={styles.topics}>
        {topics.map((topic) => (
          <button key={topic.key} onClick={() => startQuiz(topic.key)}>
            {topic.label}
          </button>
        ))}
      </div>
      {current && (
        <div className={styles.quizBox}>
          <div className={styles.question}>{quizzes[current][quizIdx].q}</div>
          <div className={styles.options}>
            {quizzes[current][quizIdx].options.map((option, index) => (
              <button
                key={option}
                className={
                  showResult && index === quizzes[current][quizIdx].answer
                    ? styles.correct
                    : showResult && index === selected
                      ? styles.wrong
                      : ""
                }
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {option}
              </button>
            ))}
          </div>
          {showResult && (
            <div className={styles.feedback}>
              {selected === quizzes[current][quizIdx].answer ? "Dogru!" : "Yanlis."}
              {quizIdx < quizzes[current].length - 1 ? (
                <button onClick={nextQuiz}>Sonraki Soru</button>
              ) : (
                <button onClick={() => setCurrent(null)}>Panele Don</button>
              )}
            </div>
          )}
        </div>
      )}
      <div className={styles.analysis}>{analyze()}</div>
    </div>
  );
}
