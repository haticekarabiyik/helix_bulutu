import { useCallback, useEffect, useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import {
  ACADEMIC_CONTRACT_ID,
  addCalculation,
  addGrade,
  addSchedule,
  getAcademicCounts,
} from "../lib/academicContract";
import styles from "./AcademicRecordsContract.module.css";

type TxState = "idle" | "signing" | "success" | "error";

const initialCounts = {
  grades: 0,
  schedules: 0,
  calculations: 0,
};

export function AcademicRecordsContract() {
  const { status, address } = useFreighter();
  const connected = status === "connected" && !!address;

  const [counts, setCounts] = useState(initialCounts);
  const [txState, setTxState] = useState<TxState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const [grade, setGrade] = useState({
    course: "Fizik",
    score: "95",
    term: "2026 Bahar",
  });
  const [schedule, setSchedule] = useState({
    course: "Algoritmalar",
    day: "Pazartesi",
    startTime: "09:00",
    endTime: "10:30",
    location: "B-204",
  });
  const [calculation, setCalculation] = useState({
    formula: "F = k * |q1 * q2| / r^2",
    inputHash: "sha256:q1=2,q2=3,r=4",
    result: "3360956922112.50 N",
  });

  const refreshCounts = useCallback(async () => {
    if (!connected || !address || !ACADEMIC_CONTRACT_ID) return;
    setCounts(await getAcademicCounts(address));
  }, [connected, address]);

  useEffect(() => {
    refreshCounts().catch(() => undefined);
  }, [refreshCounts]);

  const runTx = async (action: (addr: string) => Promise<number>) => {
    if (!address) return;

    setTxState("signing");
    setMessage("Freighter'da işlemi imzalayın.");

    try {
      const index = await action(address);
      await refreshCounts();
      setTxState("success");
      setMessage(`Kayıt zincire eklendi. Index: ${index}`);
    } catch (err) {
      setTxState("error");
      setMessage(err instanceof Error ? err.message : "Bilinmeyen hata");
    }
  };

  if (!ACADEMIC_CONTRACT_ID) {
    return (
      <section className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.label}>Soroban Akademik Kayıt Kontratı</span>
          <span className={styles.badge}>Deploy gerekli</span>
        </div>
        <p className={styles.desc}>
          Notlar, ders programı ve hesaplama sonuçları için append-only Stellar
          smart contract hazır. Testnet'e deploy edip ID'yi frontend ortamına ekleyin.
        </p>
        <ol className={styles.steps}>
          <li>
            <strong>Kontratı derleyin</strong>
            <code>cd contracts/counter && stellar contract build</code>
          </li>
          <li>
            <strong>Testnet'e deploy edin</strong>
            <code>{"stellar contract deploy --wasm target/wasm32-unknown-unknown/release/academic_records.wasm --source alice --network testnet"}</code>
          </li>
          <li>
            <strong>Kontratı başlatın</strong>
            <code>{"stellar contract invoke --id C... --source alice --network testnet -- initialize --admin alice"}</code>
          </li>
          <li>
            <strong>Contract ID'yi kaydedin</strong>
            <code>VITE_ACADEMIC_CONTRACT_ID=C... &gt; frontend/.env</code>
          </li>
        </ol>
      </section>
    );
  }

  if (!connected) return null;

  const busy = txState === "signing";

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>Stellar Smart Contract</span>
          <h2>Akademik Kayıt Kasası</h2>
        </div>
        <span className={styles.contractId} title={ACADEMIC_CONTRACT_ID}>
          {ACADEMIC_CONTRACT_ID.slice(0, 6)}...{ACADEMIC_CONTRACT_ID.slice(-6)}
        </span>
      </div>

      <div className={styles.stats}>
        <div>
          <strong>{counts.grades}</strong>
          <span>Not kaydı</span>
        </div>
        <div>
          <strong>{counts.schedules}</strong>
          <span>Ders programı</span>
        </div>
        <div>
          <strong>{counts.calculations}</strong>
          <span>Hesaplama</span>
        </div>
      </div>

      <div className={styles.forms}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            runTx((addr) =>
              addGrade(addr, grade.course, Number(grade.score), grade.term)
            );
          }}
        >
          <h3>Not Kaydı</h3>
          <input
            value={grade.course}
            onChange={(e) => setGrade({ ...grade, course: e.target.value })}
            placeholder="Ders"
          />
          <input
            value={grade.score}
            onChange={(e) => setGrade({ ...grade, score: e.target.value })}
            placeholder="Not"
            type="number"
            min="0"
            max="100"
          />
          <input
            value={grade.term}
            onChange={(e) => setGrade({ ...grade, term: e.target.value })}
            placeholder="Dönem"
          />
          <button disabled={busy}>Zincire Kaydet</button>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            runTx((addr) =>
              addSchedule(
                addr,
                schedule.course,
                schedule.day,
                schedule.startTime,
                schedule.endTime,
                schedule.location
              )
            );
          }}
        >
          <h3>Ders Programı</h3>
          <input
            value={schedule.course}
            onChange={(e) => setSchedule({ ...schedule, course: e.target.value })}
            placeholder="Ders"
          />
          <input
            value={schedule.day}
            onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
            placeholder="Gün"
          />
          <div className={styles.inline}>
            <input
              value={schedule.startTime}
              onChange={(e) =>
                setSchedule({ ...schedule, startTime: e.target.value })
              }
              placeholder="Başlangıç"
            />
            <input
              value={schedule.endTime}
              onChange={(e) =>
                setSchedule({ ...schedule, endTime: e.target.value })
              }
              placeholder="Bitiş"
            />
          </div>
          <input
            value={schedule.location}
            onChange={(e) =>
              setSchedule({ ...schedule, location: e.target.value })
            }
            placeholder="Sınıf"
          />
          <button disabled={busy}>Zincire Kaydet</button>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            runTx((addr) =>
              addCalculation(
                addr,
                calculation.formula,
                calculation.inputHash,
                calculation.result
              )
            );
          }}
        >
          <h3>Hesaplama Kanıtı</h3>
          <input
            value={calculation.formula}
            onChange={(e) =>
              setCalculation({ ...calculation, formula: e.target.value })
            }
            placeholder="Formül"
          />
          <input
            value={calculation.inputHash}
            onChange={(e) =>
              setCalculation({ ...calculation, inputHash: e.target.value })
            }
            placeholder="Girdi hash"
          />
          <input
            value={calculation.result}
            onChange={(e) =>
              setCalculation({ ...calculation, result: e.target.value })
            }
            placeholder="Sonuç"
          />
          <button disabled={busy}>Zincire Kaydet</button>
        </form>
      </div>

      {message && (
        <div
          className={`${styles.status} ${
            txState === "error"
              ? styles.error
              : txState === "success"
              ? styles.success
              : styles.pending
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
}
