import { Server, TransactionBuilder, BASE_FEE, Networks, Operation, Keypair } from 'stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');
const contractId = 'YOUR_CONTRACT_ID'; // Replace with actual contract ID

export async function purchaseLesson(lessonId: number, buyerSecret: string, amount: number) {
  const buyerKeypair = Keypair.fromSecret(buyerSecret);
  const buyerPublicKey = buyerKeypair.publicKey();

  const account = await server.loadAccount(buyerPublicKey);
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.manageData({
        name: `purchase_lesson_${lessonId}`,
        value: amount.toString(),
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(buyerKeypair);
  await server.submitTransaction(transaction);
}

export async function getBalance(ownerPublicKey: string): Promise<number> {
  const account = await server.loadAccount(ownerPublicKey);
  const balanceEntry = account.data_attr[`balance_${contractId}`];
  return balanceEntry ? parseInt(balanceEntry, 10) : 0;
}

export async function withdraw(ownerSecret: string, amount: number) {
  const ownerKeypair = Keypair.fromSecret(ownerSecret);
  const ownerPublicKey = ownerKeypair.publicKey();

  const account = await server.loadAccount(ownerPublicKey);
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.manageData({
        name: `withdraw_${contractId}`,
        value: amount.toString(),
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(ownerKeypair);
  await server.submitTransaction(transaction);
}