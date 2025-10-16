'use client'
import Button from "@/components/Button";
import Header from "@/components/Header";
import WalletGenerator from "@/components/WalletGenerator";
import { useState } from "react";
export default function Home() {

  const [walletSelected,setWalletSelected] = useState<string>("");
  return (
    <div>
      <Header />
      {
        !walletSelected ? 
      <div className="min-h-96 mt-5 p-30 flex flex-col">
        <span className="text-4xl">Vault suports multiple blockchains</span>
        <span className="text-xl font-semibold  text-neutral-400">Choose a blockchain to get started</span>
        <div className="flex gap-4 my-3">
          <Button onClick={()=>{setWalletSelected('501')}} label="Solana" variant="dark"/>
          <Button onClick={()=>{setWalletSelected('60')}} label="Ethereum" variant="light"/>
        </div>
      </div>
        
         :
         <WalletGenerator walletSelected={walletSelected}  />
      }
    </div>
  );
}
