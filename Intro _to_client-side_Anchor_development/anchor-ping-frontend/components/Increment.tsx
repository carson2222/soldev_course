import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { FC, useCallback, useEffect, useState } from "react";
import idl from "../idl.json";
import { Button, HStack, VStack, Text } from "@chakra-ui/react";
import { ChallengeAnchorCounter } from "../ChallengeAnchorCounter";

export interface Props {
  counter;
  setTransactionUrl;
}

export const Increment: FC<Props> = ({ counter, setTransactionUrl }) => {
  const [count, setCount] = useState(0);
  const [program, setProgram] = useState<anchor.Program<ChallengeAnchorCounter>>();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

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
    refreshCount(program);
  }, []);

  const incrementCount = async () => {
    const sig = await program.methods.increment().accounts({ counter: counter, user: wallet.publicKey }).rpc();
    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const decrementCount = async () => {
    const sig = await program.methods.decrement().accounts({ counter: counter, user: wallet.publicKey }).rpc();
    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const refreshCount = async (program) => {
    const counterAcc = await program.account.counter.fetch(counter);
    setCount(counterAcc.count.toNumber());
  };

  return (
    <VStack>
      <HStack>
        <Button onClick={incrementCount}>Increment Counter</Button>
        <Button onClick={decrementCount}>Decrement Counter</Button>
        <Button onClick={() => refreshCount(program)}>Refresh count</Button>
      </HStack>
      <Text color="white">Count: {count}</Text>
    </VStack>
  );
};
