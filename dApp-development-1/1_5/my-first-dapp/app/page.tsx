import WalletContextProvider from "@/components/WalletContextProvider";
import * as web3 from "@solana/web3.js";

export default function Home() {
  return (
    <>
      <WalletContextProvider></WalletContextProvider>
      <p>test</p>
    </>
  );
}
