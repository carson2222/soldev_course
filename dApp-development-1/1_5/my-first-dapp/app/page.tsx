"use client";
import DisplayBalance from "@/components/DisplayBalance";
import { PingButton } from "@/components/PingButton";
import { SendSolForm } from "@/components/SendSolForm";
import WalletContextProvider from "@/components/WalletContextProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { NextPage } from "next";
import solanaIcon from "../assets/solanaLogo.png";
const Home: NextPage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <WalletContextProvider>
        <header className="w-full h-20 bg-white flex justify-between items-center px-3">
          <img src={solanaIcon.src} className="h-full w-auto p-3" />
          <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-5xl">Solana money sender</h1>
          <div className="">
            <WalletMultiButton />
          </div>
        </header>
        <DisplayBalance />
        <SendSolForm />
        <PingButton />
      </WalletContextProvider>
    </div>
  );
};
export default Home;
