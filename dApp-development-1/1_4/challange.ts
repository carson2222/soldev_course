import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import * as web3 from "@solana/web3.js";
import dotenv from "dotenv";
dotenv.config();

const randomWalletAddress = new web3.PublicKey("kgwRFeQaSKpNoerwsCEwAFcPJCngmw2u9apWLyUCvPg");

const payer = getKeypairFromEnvironment("PRIVATE_KEY");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

const transferInstruction = web3.SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey: randomWalletAddress,
  lamports: 5000,
});

const transaction = new web3.Transaction().add(transferInstruction);
const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);
console.log(signature);
