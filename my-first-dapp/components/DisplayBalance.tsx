"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";

const DisplayBalance: FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

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
      <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : `Balance: ??? SOL`}</p>
   
    </div>
  );
};
export default DisplayBalance;
