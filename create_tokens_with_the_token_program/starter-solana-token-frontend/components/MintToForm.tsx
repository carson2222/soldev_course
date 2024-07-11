"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";

export const MintToForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [balance, setBalance] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // form
  const [tokenMint, setTokenMint] = useState("");
  const [receipt, setReceipt] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const link = () => {
    return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "";
  };

  const mintTo = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();
    const mint = new web3.PublicKey(tokenMint);
    const destination = new web3.PublicKey(receipt);
    const associatedToken = await getAssociatedTokenAddress(
      mint,
      destination,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tokenMintInfo = (await connection.getParsedAccountInfo(mint)) as any;
    const tokenDecimals = Math.pow(10, tokenMintInfo.value?.data.parsed.info.decimals);
    transaction.add(createMintToInstruction(mint, associatedToken, publicKey, (amount || 0) * tokenDecimals));

    const sig = await sendTransaction(transaction, connection);
    setTxSig(sig);

    const account = await getAccount(connection, associatedToken);
    setBalance(account.amount.toString());
  };

  return (
    <div>
      <br />
      {publicKey ? (
        <form onSubmit={mintTo} className={styles.form}>
          <label htmlFor="mint">Token Mint:</label>
          <input
            id="mint"
            type="text"
            className={styles.formField}
            placeholder="Enter Token Mint"
            required
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
          />
          <label htmlFor="recipient">Recipient:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="Enter Recipient PublicKey"
            required
            value={receipt}
            onChange={(e) => setReceipt(e.target.value)}
          />
          <label htmlFor="amount">Amount Tokens to Mint:</label>
          <input
            id="amount"
            type="number"
            className={styles.formField}
            placeholder="e.g. 100"
            required
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
          />
          <button type="submit" className={styles.formButton}>
            Mint Tokens
          </button>
        </form>
      ) : (
        <span></span>
      )}
      {txSig ? (
        <div>
          <p>Token Balance: {balance} </p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};
