import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  isConnected,
  isAllowed,
  getAddress,
  getNetwork,
  requestAccess,
} from "@stellar/freighter-api";

export type WalletStatus = "idle" | "connecting" | "connected" | "error";

export interface FreighterState {
  status: WalletStatus;
  address: string | null;
  network: string | null;
  error: string | null;
  isInstalled: boolean;
}

export type UseFreighterResult = FreighterState & {
  connect: () => Promise<void>;
  disconnect: () => void;
};

const FreighterContext = createContext<UseFreighterResult | null>(null);

function formatApiError(err?: { message?: string }): string {
  return err?.message?.trim() ? err.message : "İşlem başarısız.";
}

export function FreighterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FreighterState>({
    status: "idle",
    address: null,
    network: null,
    error: null,
    isInstalled: false,
  });

  useEffect(() => {
    void syncFromExtension();
  }, []);

  const syncFromExtension = async () => {
    const connResult = await isConnected();
    if (connResult.error) {
      setState((s) => ({ ...s, isInstalled: false }));
      return;
    }
    if (!connResult.isConnected) {
      setState((s) => ({ ...s, isInstalled: false }));
      return;
    }

    setState((s) => ({ ...s, isInstalled: true }));

    const allowedResult = await isAllowed();
    if (!allowedResult.isAllowed || allowedResult.error) {
      return;
    }

    const addrResult = await getAddress();
    if (addrResult.error || !addrResult.address) {
      return;
    }

    const netResult = await getNetwork();
    setState({
      status: "connected",
      address: addrResult.address,
      network: netResult.error ? null : netResult.network,
      error: null,
      isInstalled: true,
    });
  };

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, status: "connecting", error: null }));

    try {
      const connResult = await isConnected();
      if (connResult.error) {
        setState((s) => ({
          ...s,
          status: "error",
          error: formatApiError(connResult.error),
          isInstalled: false,
        }));
        return;
      }
      if (!connResult.isConnected) {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Freighter yüklü değil. Tarayıcı eklentisini kurun.",
          isInstalled: false,
        }));
        return;
      }

      const access = await requestAccess();
      if (access.error) {
        setState((s) => ({
          ...s,
          status: "error",
          error: formatApiError(access.error),
          isInstalled: true,
        }));
        return;
      }
      if (!access.address) {
        setState((s) => ({
          ...s,
          status: "error",
          error: "Cüzdan adresi alınamadı.",
          isInstalled: true,
        }));
        return;
      }

      const netResult = await getNetwork();
      setState({
        status: "connected",
        address: access.address,
        network: netResult.error ? null : netResult.network,
        error: null,
        isInstalled: true,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bağlantı başarısız.";
      setState((s) => ({
        ...s,
        status: "error",
        error: message,
        isInstalled: s.isInstalled,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "idle",
      address: null,
      network: null,
      error: null,
    }));
  }, []);

  const value: UseFreighterResult = { ...state, connect, disconnect };

  return <FreighterContext.Provider value={value}>{children}</FreighterContext.Provider>;
}

export function useFreighter(): UseFreighterResult {
  const ctx = useContext(FreighterContext);
  if (!ctx) {
    throw new Error("useFreighter yalnızca FreighterProvider içinde kullanılabilir.");
  }
  return ctx;
}
