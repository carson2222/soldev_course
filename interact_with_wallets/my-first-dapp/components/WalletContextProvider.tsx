"use client";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { FC, ReactNode, useMemo } from "react";
import * as web3 from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint =
    "https://quick-young-road.solana-mainnet.quiknode.pro/01245698b0c2e688adf8770542c6b6b108109082/";
  const wallets = useMemo(() => [], []);

  console.log(wallets);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
export default WalletContextProvider;
