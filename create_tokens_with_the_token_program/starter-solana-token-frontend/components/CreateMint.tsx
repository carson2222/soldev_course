"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

import { FC, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from "@solana/spl-token";

export const CreateMintForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [mint, setMint] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "";
  };

  const createMint = async (event: any) => {
    try {
      event.preventDefault();
      if (!connection || !publicKey) {
        return;
      }

      const accountKeypair = web3.Keypair.generate();
      const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
      const programId = token.TOKEN_PROGRAM_ID;
      const transaction = new web3.Transaction();
      transaction.add(
        web3.SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: accountKeypair.publicKey,
          lamports,
          space: token.MINT_SIZE,
          programId,
        })
      );

      transaction.add(
        token.createInitializeMintInstruction(accountKeypair.publicKey, 2, publicKey, publicKey, programId)
      );

      const sig = await sendTransaction(transaction, connection, { signers: [accountKeypair] });
      console.log(sig);
      setTxSig(sig);
      setMint(accountKeypair.publicKey.toString());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={createMint} className={styles.form}>
          <button type="submit" className={styles.formButton}>
            Create Mint
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {txSig ? (
        <div>
          <p>Token Mint Address: {mint}</p>
          <p>View your transaction on </p>
          <a href={link()} target="_blank">
            Solana Explorer
          </a>
        </div>
      ) : null}
    </div>
  );
};
