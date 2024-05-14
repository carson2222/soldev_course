import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();
import { getKeypairFromEnvironment, requestAndConfirmAirdropIfRequired } from "@solana-developers/helpers";

// Generate new keypair
const randomKeypair = Keypair.generate();
// const pubKey = randomKeypair.publicKey;
// const secKey = randomKeypair.secretKey;
// console.log(pubKey.toBase58());
// console.log(secKey.toString());

// Get keypair from secret key (old way)
// const secret = JSON.parse(process.env.PRIVATE_KEY.toString()) as number[];
// const secretKey = Uint8Array.from(secret);
// const keypairFromSecretKey = Keypair.fromSecretKey(secretKey);

// Get keypair from secret key (new way)
const ownerKeypair = getKeypairFromEnvironment("PRIVATE_KEY");
console.log(ownerKeypair);
// ------------------
// Sending transaction
// ------------------

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: ownerKeypair.publicKey,
  toPubkey: randomKeypair.publicKey,
  lamports: LAMPORTS_PER_SOL * 0.1,
});
transaction.add(sendSolInstruction);

const connection = new Connection(clusterApiUrl("devnet"));

await requestAndConfirmAirdropIfRequired(
  connection,
  ownerKeypair.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);

const signature = await sendAndConfirmTransaction(connection, transaction, [ownerKeypair]);
console.log(signature);
