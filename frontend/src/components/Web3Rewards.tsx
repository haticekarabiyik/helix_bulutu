import { useCallback, useEffect, useMemo, useState } from "react";
import { useFreighter } from "../hooks/useFreighter";
import {
  explorerTxLink,
  persistHelixRewardsWithFreighter,
  readHelixRewardFromHorizon,
} from "../lib/stellar";
import styles from "./Web3Rewards.module.css";

export type LearningRewardEvent = {
  id: string;
  type: "quiz" | "course";
  topicKey: string;
  topicLabel: string;
  correct: boolean;
};

type Badge = {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
};

type RewardState = {
  tokens: number;
  streak: number;
  lastStudyDate: string | null;
  solvedQuizzes: number;
  processedEvents: string[];
  badges: Badge[];
};

type Web3RewardsProps = {
  event: LearningRewardEvent | null;
};

const emptyRewards: RewardState = {
  tokens: 0,
  streak: 0,
  lastStudyDate: null,
  solvedQuizzes: 0,
  processedEvents: [],
  badges: [],
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(address: string | null) {
  return address ? `helix:web3-rewards:${address}` : null;
}

/** Freighter getNetwork bazen küçük harf / farklı etiket döndürebilir. */
function isLikelyStellarTestnet(network: string | null): boolean {
  if (!network) return true;
  const n = network.toUpperCase();
  return n.includes("TEST") || n === "STANDALONE" || network.includes("Test SDF");
}

export default function Web3Rewards({ event }: Web3RewardsProps) {
  const wallet = useFreighter();
  const [rewards, setRewards] = useState<RewardState>(emptyRewards);
  const key = useMemo(() => storageKey(wallet.address), [wallet.address]);

  const [chainSnapshot, setChainSnapshot] = useState<string | null>(null);
  const [lastClaimHash, setLastClaimHash] = useState<string | null>(null);
  const [claimBusy, setClaimBusy] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const refreshLedgerSnapshot = useCallback(async () => {
    if (!wallet.address || wallet.status !== "connected") {
      setChainSnapshot(null);
      return;
    }
    const snapshot = await readHelixRewardFromHorizon(wallet.address);
    setChainSnapshot(snapshot);
  }, [wallet.address, wallet.status]);

  useEffect(() => {
    if (!key) {
      setRewards(emptyRewards);
      return;
    }

    const saved = window.localStorage.getItem(key);
    setRewards(saved ? { ...emptyRewards, ...JSON.parse(saved) } : emptyRewards);
  }, [key]);

  useEffect(() => {
    if (!key) return;
    window.localStorage.setItem(key, JSON.stringify(rewards));
  }, [key, rewards]);

  useEffect(() => {
    void refreshLedgerSnapshot();
  }, [refreshLedgerSnapshot]);

  useEffect(() => {
    if (!event || !event.correct || !wallet.address) return;

    setRewards((current) => {
      if (current.processedEvents.includes(event.id)) return current;

      const date = todayKey();
      const streakBonus = current.lastStudyDate === date ? 0 : 5;

      const nextBadges =
        event.type === "course" &&
        !current.badges.some((badge) => badge.id === event.topicKey)
          ? [
              ...current.badges,
              {
                id: event.topicKey,
                title: `${event.topicLabel} Sertifikası`,
                description: "Ders tamamlandı; zincire özet yazarak kalıcı kanıt ekleyebilirsiniz.",
                earnedAt: new Date().toISOString(),
              },
            ]
          : current.badges;

      return {
        tokens: current.tokens + 10 + streakBonus,
        streak: streakBonus > 0 ? current.streak + 1 : current.streak,
        lastStudyDate: date,
        solvedQuizzes: current.solvedQuizzes + 1,
        processedEvents: [...current.processedEvents, event.id],
        badges: nextBadges,
      };
    });
  }, [event, wallet.address]);

  const handlePersistRewards = async () => {
    if (!wallet.address) return;

    const testnetOk = isLikelyStellarTestnet(wallet.network);
    if (!testnetOk) {
      setClaimError("Ödül özeti yazmak için Freighter'da Testnet seçin.");
      return;
    }

    setClaimBusy(true);
    setClaimError(null);
    setLastClaimHash(null);

    try {
      const txHash = await persistHelixRewardsWithFreighter({
        address: wallet.address,
        tokens: rewards.tokens,
        streak: rewards.streak,
        badgeCount: rewards.badges.length,
      });
      setLastClaimHash(txHash);
      await refreshLedgerSnapshot();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "İşlem gönderilemedi; hesaba yeterli XLM ve rezerv var mı?";
      setClaimError(
        `${msg} (İlk zincir yazımı yaklaşık +0.5 XLM rezerv tüketir; Friendbot ile test XLM ekleyebilirsiniz.)`,
      );
    } finally {
      setClaimBusy(false);
    }
  };

  const shortAddr = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-6)}`
    : null;

  const showWrongNetworkNotice =
    wallet.status === "connected" && wallet.network != null && !isLikelyStellarTestnet(wallet.network);

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Stellar Testnet • Freighter</p>
          <h2>Web3 Ödül Cüzdanı</h2>
        </div>
        {wallet.status === "connected" && shortAddr ? (
          <div className={styles.connected}>
            <span className={styles.statusDot} />
            <span>{shortAddr}</span>
          </div>
        ) : wallet.isInstalled ? (
          <button type="button" className={styles.primaryButton} onClick={wallet.connect}>
            {wallet.status === "connecting" ? "Bağlanıyor..." : "Freighter bağla"}
          </button>
        ) : (
          <a className={styles.primaryButton} href="https://www.freighter.app/" target="_blank" rel="noreferrer">
            Freighter kur
          </a>
        )}
      </div>

      {wallet.error ? <div className={styles.alert}>{wallet.error}</div> : null}

      {showWrongNetworkNotice ? (
        <div className={styles.networkNotice}>
          <span>Özet yazmak için Freighter üzerinden Testnet ağını seçin.</span>
        </div>
      ) : null}

      <div className={styles.statsGrid}>
        <div>
          <span className={styles.statValue}>{rewards.tokens}</span>
          <span className={styles.statLabel}>HELIX puanı (yerel)</span>
        </div>
        <div>
          <span className={styles.statValue}>{rewards.streak}</span>
          <span className={styles.statLabel}>Günlük seri</span>
        </div>
        <div>
          <span className={styles.statValue}>{rewards.badges.length}</span>
          <span className={styles.statLabel}>Tamamlanan ders rozeti</span>
        </div>
      </div>

      <div className={styles.chainActions}>
        <h3>Zincir üstü doğrulanabilir özet</h3>
        <p>
          Yerel HELIX puanınızın bir kopyası, hesabınıza bağlı küçük bir veri kaydı (
          <code>ManageData · HELIXREW_V1</code>
          ) olarak Stellar Testnet&apos;e yazılır — Freighter imzası ister.
          Böylece <strong>sadece tarayıcı değil, ledger özetinizden de doğrulanabilir</strong>. İlk
          kayıtta ek yaklaşık <strong>0,5 XLM rezerv</strong> gerekebilir.
        </p>
        <button
          type="button"
          className={styles.syncButton}
          disabled={claimBusy || wallet.status !== "connected" || showWrongNetworkNotice}
          onClick={() => void handlePersistRewards()}
        >
          {claimBusy ? "İşlem bekleniyor…" : "Ödül özetini Stellar’a yaz"}
        </button>
        {claimError ? <p className={styles.claimErr}>{claimError}</p> : null}
        {chainSnapshot ? <p className={styles.snapRow}>Ledger özeti: {chainSnapshot}</p> : null}
        {!chainSnapshot &&
        wallet.status === "connected" &&
        !showWrongNetworkNotice &&
        !claimBusy ? (
          <p className={styles.snapRow}>Henüz zincir özeti okunmadı — yukarıdaki düğümle oluşturun.</p>
        ) : null}
        {lastClaimHash ? (
          <a
            className={styles.miniLink}
            href={explorerTxLink(lastClaimHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Son yazım işlemi: {lastClaimHash}
          </a>
        ) : null}
      </div>

      <div className={styles.badgeList}>
        {rewards.badges.length > 0 ? (
          rewards.badges.map((badge) => (
            <article className={styles.badge} key={badge.id}>
              <div className={styles.badgeMark}>NFT</div>
              <div>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
            </article>
          ))
        ) : (
          <p className={styles.empty}>
            Quiz doğru Çözümünde puan eklenir; konunun tüm soruları bitince rozet oluşur. Ardından isterseniz
            özeti zincire yazın.
          </p>
        )}
      </div>
    </section>
  );
}
