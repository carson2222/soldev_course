import { Keypair } from "@solana/web3.js";

const randomKeypair = Keypair.generate();
console.log(randomKeypair.secretKey.toString());
