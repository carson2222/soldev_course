import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

export const SendSolForm = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = (event: string) => {
    // event.preventDefault();
    console.log(connection, publicKey);
    if (!connection || !publicKey) return;

    const transaction = new web3.Transaction();
    // const recipientPubKey = new web3.PublicKey(event.target.recipient.value);
    const recipientPubKey = new web3.PublicKey(event);

    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.1,
    });

    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
    });
  };

  return (
    <div>
      <button onClick={() => sendSol("BRY58qFVaTnemDhGB8kKvEDC9edhiTmRJufLvULLtkHz")}>Send Sol </button>
    </div>
  );
};
