import dotenv from "dotenv";
dotenv.config();
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("PRIVATE_KEY");
console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);

const airdropSignature = await connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL);
await connection.confirmTransaction(airdropSignature);

// This is a shortcut that runs:
// SystemProgram.createAccount
// token.createInitializeMintInstruction
// See https://www.soldev.app/course/token-program
const tokenMint = await createMint(connection, user, user.publicKey, null, 2);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");
console.log(`✅ Finished! Created token mint: ${link}`);
