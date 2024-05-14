"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";

const DisplayBalance = ({
  setFormVisible,
  balance,
  setBalance,
}: {
  setFormVisible: Dispatch<SetStateAction<boolean>>;
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
      setFormVisible(false);
    }
    setFormVisible(true);

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info?.lamports || 0);
    });
  }, [connection, publicKey]);

  return (
    <div>
      {!publicKey && (
        <div className="flex flex-col justify-center items-center">
          <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
            Connect wallet to interact
          </p>
          <ImSpinner2 size={50} className="animate-spin" />
        </div>
      )}

      {publicKey && (
        <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Balance: {(balance / LAMPORTS_PER_SOL).toFixed(2)} SOL
        </p>
      )}
    </div>
  );
};
export default DisplayBalance;
