"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";

import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

export const CreateTokenAccountForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [mintInp, setMintInp] = useState("");
  const [ownerInp, setOwnerInp] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "";
  };

  const createTokenAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }

    const mint = new web3.PublicKey(mintInp);
    const owner = new web3.PublicKey(ownerInp);
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const transaction = new web3.Transaction();
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );

    const sig = await sendTransaction(transaction, connection);
    setTxSig(sig);
    setTokenAccount(associatedToken.toString());
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={createTokenAccount} className={styles.form}>
          <label htmlFor="owner">Token Mint:</label>
          <input
            value={mintInp}
            onChange={(e) => setMintInp(e.target.value)}
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
          />
          <label htmlFor="owner">Token Account Owner:</label>
          <input
            value={ownerInp}
            onChange={(e) => setOwnerInp(e.target.value)}
            id="owner"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Account Owner PublicKey"
            required
          />
          <button type="submit" className={styles.formButton}>
            Create Token Account
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div>
          <p>Token Account Address: {tokenAccount}</p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};
