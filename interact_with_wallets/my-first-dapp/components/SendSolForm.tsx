import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import notify from "../lib/toastify";

export const SendSolForm = ({ balance }: { balance: number }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [inputAdress, setInputAdress] = useState("");
  const [inputAmount, setInputAmount] = useState<number>();
  const [signature, setSignature] = useState("");
  const sendSol = () => {
    if (!connection || !publicKey) {
      notify("error", "Failed to connect with wallet", 3000);
      return;
    }
    const balanceSol = balance / web3.LAMPORTS_PER_SOL;

    if (inputAdress === "" || inputAmount === undefined) {
      notify("error", "Inputs can NOT be empty", 3000);
      return;
    }

    if (balanceSol <= 0) {
      notify("error", "Balance can't be 0 or below 0", 3000);
      return;
    }

    if (balanceSol < inputAmount) {
      notify("error", "Not enough balance", 3000);
      return;
    }
    const transaction = new web3.Transaction();
    // const recipientPubKey = new web3.PublicKey(event.target.recipient.value);
    const recipientPubKey = new web3.PublicKey(inputAdress);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: web3.LAMPORTS_PER_SOL * inputAmount,
    });

    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
      setSignature(sig);
      notify("success", "Transaction sent succesfully");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {signature && (
        <a href={`https://solscan.io/tx/${signature}?cluster=devnet`}>
          <p className="text-center text-mainPurple hover:text-mainPurple/80">{`${signature.slice(
            0,
            4
          )}...${signature.slice(signature.length - 4, signature.length)}`}</p>
        </a>
      )}
      <Label htmlFor="address">Address</Label>
      <Input
        type="text"
        id="address"
        className=""
        onChange={(e) => setInputAdress(e.target.value)}
      />

      <Label htmlFor="amount">Amount</Label>
      <Input
        type="number"
        id="amount"
        className=""
        onChange={(e) => setInputAmount(+e.target.value)}
      />

      <Button variant={"purple"} className="mt-5" onClick={sendSol}>
        Send Sol
      </Button>
    </div>
  );
};
