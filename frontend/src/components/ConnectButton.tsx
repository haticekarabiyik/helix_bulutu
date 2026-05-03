import { useFreighter } from "../hooks/useFreighter";
import styles from "./ConnectButton.module.css";

export function ConnectButton() {
  const { status, address, connect, disconnect, isInstalled, error } = useFreighter();

  if (status === "connected" && address) {
    return (
      <div className={styles.connectedRow}>
        <span className={styles.dot} />
        <span className={styles.addressBadge}>
          {address.slice(0, 6)}...{address.slice(-6)}
        </span>
        <button type="button" className={styles.disconnectBtn} onClick={disconnect}>
          Bağlantıyı Kes
        </button>
      </div>
    );
  }

  if (!isInstalled && status === "error") {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.installLink}
      >
        Freighter Yükle →
      </a>
    );
  }

  return (
    <div className={styles.connectWrap}>
      {status === "error" && error && isInstalled ? (
        <p className={styles.errorHint}>{error}</p>
      ) : null}
      <button
        type="button"
        className={styles.connectBtn}
        onClick={connect}
        disabled={status === "connecting"}
      >
        {status === "connecting" ? (
          <>
            <span className={styles.spinner} />
            Bağlanıyor...
          </>
        ) : (
          <>
            <FreighterIcon />
            Freighter ile Bağlan
          </>
        )}
      </button>
    </div>
  );
}

function FreighterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#6C63FF" />
      <path
        d="M8 10h16M8 16h10M8 22h13"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
