import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

export const PingButton = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const PING_PROGRAM_ADRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
  const PING_PROGRAM_DATA_ADRESS = "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";
  const pingClicked = async () => {
    console.log("Ping!");

    if (!connection || !publicKey) return;

    const transaction = new web3.Transaction();

    const programId = new web3.PublicKey(PING_PROGRAM_ADRESS);
    const programDataAccount = new web3.PublicKey(PING_PROGRAM_DATA_ADRESS);

    const pingInstruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programDataAccount,
          isSigner: false,
          isWritable: true,
        },
      ],
      programId,
    });
    transaction.add(pingInstruction);
    const signature = await sendTransaction(transaction, connection);
    console.log(signature);
  };
  return (
    <div>
      <button onClick={pingClicked}>Ping!</button>
    </div>
  );
};
