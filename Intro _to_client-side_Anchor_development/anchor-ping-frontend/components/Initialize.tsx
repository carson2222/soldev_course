import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { FC, useEffect, useState } from "react";
import idl from "../idl.json";
import { ChallengeAnchorCounter } from "../ChallengeAnchorCounter";
import { Button } from "@chakra-ui/react";
import * as web3 from "@solana/web3.js";

export interface Props {
  setCounter;
  setTransactionUrl;
}

export const Initialize: FC<Props> = ({ setCounter, setTransactionUrl }) => {
  const [program, setProgram] = useState<anchor.Program<ChallengeAnchorCounter>>();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  // const wallet = useWallet();
  useEffect(() => {
    let provider: anchor.Provider;
    try {
      provider = anchor.getProvider();
    } catch (error) {
      //@ts-ignore
      provider = new anchor.AnchorProvider(connection, wallet, {});
      anchor.setProvider(provider);
    }

    const program = new anchor.Program<ChallengeAnchorCounter>(idl as ChallengeAnchorCounter, provider);
    setProgram(program);
    console.log(program);
  }, []);

  const onClick = async () => {
    const counter = web3.Keypair.generate();

    console.log(counter.publicKey.toString());
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        user: wallet.publicKey,
      })
      .signers([counter])
      .rpc();

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    setCounter(counter.publicKey.toString());
  };

  return <Button onClick={onClick}>Initialize Counter</Button>;
};
