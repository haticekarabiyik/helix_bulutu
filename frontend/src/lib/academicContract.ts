import {
  BASE_FEE,
  Contract,
  nativeToScVal,
  rpc as StellarRpc,
  scValToNative,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { config, rpc } from "./stellar";

export const ACADEMIC_CONTRACT_ID =
  import.meta.env.VITE_ACADEMIC_CONTRACT_ID ?? "";

type ContractArg = xdr.ScVal;

async function buildTx(
  userAddress: string,
  method: string,
  args: ContractArg[] = []
) {
  const account = await rpc.getAccount(userAddress);
  const contract = new Contract(ACADEMIC_CONTRACT_ID);

  return new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(180)
    .build();
}

function addressArg(address: string) {
  return nativeToScVal(address, { type: "address" });
}

function stringArg(value: string) {
  return nativeToScVal(value, { type: "string" });
}

function u32Arg(value: number) {
  return nativeToScVal(value, { type: "u32" });
}

async function invokeAndWait(
  userAddress: string,
  method: string,
  args: ContractArg[]
): Promise<number> {
  if (!ACADEMIC_CONTRACT_ID) {
    throw new Error("Akademik kontrat ID tanımlı değil.");
  }

  const tx = await buildTx(userAddress, method, args);
  const sim = await rpc.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(sim)) throw new Error(sim.error);

  const assembled = StellarRpc.assembleTransaction(tx, sim).build();
  const { signedTxXdr, error } = await signTransaction(assembled.toXDR(), {
    networkPassphrase: config.networkPassphrase,
  });
  if (error) throw new Error(error);

  const signed = TransactionBuilder.fromXDR(
    signedTxXdr,
    config.networkPassphrase
  ) as Transaction;

  const response = await rpc.sendTransaction(signed);
  if (response.status === "ERROR") {
    throw new Error("İşlem ağ tarafından reddedildi.");
  }

  let result = await rpc.getTransaction(response.hash);
  while (result.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = await rpc.getTransaction(response.hash);
  }

  if (result.status !== "SUCCESS" || !result.returnValue) {
    throw new Error("İşlem başarısız oldu.");
  }

  return scValToNative(result.returnValue) as number;
}

async function readCount(userAddress: string, method: string): Promise<number> {
  if (!ACADEMIC_CONTRACT_ID) return 0;

  const tx = await buildTx(userAddress, method, [addressArg(userAddress)]);
  const sim = await rpc.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  if (!sim.result) return 0;
  return scValToNative(sim.result.retval) as number;
}

export function addGrade(
  userAddress: string,
  course: string,
  score: number,
  term: string
) {
  return invokeAndWait(userAddress, "add_grade", [
    addressArg(userAddress),
    stringArg(course),
    u32Arg(score),
    stringArg(term),
  ]);
}

export function addSchedule(
  userAddress: string,
  course: string,
  day: string,
  startTime: string,
  endTime: string,
  location: string
) {
  return invokeAndWait(userAddress, "add_schedule", [
    addressArg(userAddress),
    stringArg(course),
    stringArg(day),
    stringArg(startTime),
    stringArg(endTime),
    stringArg(location),
  ]);
}

export function addCalculation(
  userAddress: string,
  formula: string,
  inputHash: string,
  result: string
) {
  return invokeAndWait(userAddress, "add_calculation", [
    addressArg(userAddress),
    stringArg(formula),
    stringArg(inputHash),
    stringArg(result),
  ]);
}

export function getAcademicCounts(userAddress: string) {
  return Promise.all([
    readCount(userAddress, "grade_count"),
    readCount(userAddress, "schedule_count"),
    readCount(userAddress, "calculation_count"),
  ]).then(([grades, schedules, calculations]) => ({
    grades,
    schedules,
    calculations,
  }));
}
