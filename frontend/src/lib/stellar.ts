import {
  Horizon,
  Networks,
  rpc as StellarRpc,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  Transaction,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

export const NETWORK = "testnet";

export const config = {
  horizonUrl: "https://horizon-testnet.stellar.org",
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: Networks.TESTNET,
  explorerUrl: "https://stellar.expert/explorer/testnet",
};

export const horizon = new Horizon.Server(config.horizonUrl);
export const rpc = new StellarRpc.Server(config.rpcUrl);

export async function getAccountInfo(address: string) {
  try {
    const account = await horizon.loadAccount(address);
    const xlmBalance = account.balances.find((b) => b.asset_type === "native");
    return {
      address,
      balance: xlmBalance?.balance ?? "0",
      sequence: account.sequence,
      subentryCount: account.subentry_count,
    };
  } catch (err: unknown) {
    const e = err as { response?: { status: number } };
    if (e?.response?.status === 404) {
      return { address, balance: "0", sequence: "0", subentryCount: 0 };
    }
    throw err;
  }
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function explorerLink(address: string): string {
  return `${config.explorerUrl}/account/${address}`;
}

// Freighter ile ödeme ve txHash alma
export async function payWithFreighter({
  from,
  to,
  amount,
  memo = "",
}: {
  from: string;
  to: string;
  amount: string;
  memo?: string;
}): Promise<string> {
  // Hesapları yükle
  const sourceAccount = await horizon.loadAccount(from);
  const fee = await horizon.fetchBaseFee();

  const builder = new TransactionBuilder(sourceAccount, {
    fee: fee.toString(),
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: to,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(60);

  if (memo) {
    builder.addMemo(Memo.text(memo));
  }

  const tx = builder.build();

  // Freighter ile imzala ve gönder
  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: config.networkPassphrase,
  });

  if (error) throw new Error(error);

  const signed = TransactionBuilder.fromXDR(
    signedTxXdr,
    config.networkPassphrase
  ) as Transaction;

  const result = await horizon.submitTransaction(signed);
  return result.hash;
}

/** Hesap datasında HELIX ödül özeti (max 64 bayt); blockchain'de doğrulanabilir. */
export const HELIX_REWARD_DATA_KEY = "HELIXREW_V1";

/** Horizon account.data alanından base64 değeri okur */
function horizonDataToAscii(b64: string): string {
  try {
    if (typeof atob !== "function") return "";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return "";
  }
}

export async function readHelixRewardFromHorizon(
  address: string,
): Promise<string | null> {
  try {
    const res = await fetch(`${config.horizonUrl}/accounts/${encodeURIComponent(address)}`);
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Record<string, string> };
    const b64 = body.data?.[HELIX_REWARD_DATA_KEY];
    if (!b64) return null;
    const ascii = horizonDataToAscii(b64);
    return ascii || null;
  } catch {
    return null;
  }
}

/** Ödül cüzdanı özetini Testnet ledger'a yazar (ManageData → ilave ~0.5 XLM rezerv gerektirir). */
export async function persistHelixRewardsWithFreighter(opts: {
  address: string;
  tokens: number;
  streak: number;
  badgeCount: number;
}): Promise<string> {
  const valueRaw = `t${opts.tokens}:s${opts.streak}:b${opts.badgeCount}:${Math.floor(Date.now() / 1000)}`;
  const value = valueRaw.slice(0, 64);

  const sourceAccount = await horizon.loadAccount(opts.address);
  const fee = await horizon.fetchBaseFee();

  const tx = new TransactionBuilder(sourceAccount, {
    fee: fee.toString(),
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(
      Operation.manageData({
        name: HELIX_REWARD_DATA_KEY,
        value,
      }),
    )
    .setTimeout(60)
    .build();

  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: config.networkPassphrase,
  });

  if (error) {
    const msg =
      typeof error === "string"
        ? error
        : typeof error === "object" &&
            error &&
            "message" in error &&
            typeof (error as { message?: string }).message === "string"
          ? (error as { message: string }).message
          : "Freighter imzası reddedildi";
    throw new Error(msg);
  }

  const signed = TransactionBuilder.fromXDR(
    signedTxXdr,
    config.networkPassphrase,
  ) as Transaction;

  const result = await horizon.submitTransaction(signed);
  return result.hash;
}

export function explorerTxLink(hash: string): string {
  return `${config.explorerUrl}/tx/${encodeURIComponent(hash)}`;
}
