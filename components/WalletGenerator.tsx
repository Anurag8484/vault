'use client';

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useEffect, useState } from "react";
import bs58 from 'bs58';
import nacl from "tweetnacl";
interface Wallet{
    pubKey: string;
    privateKey: string;
    mnemonic: string
    accountIndex: number
}


const WalletGenerator = () =>{


    
    const [mnemonicsWords, setMnemonicsWords] = useState<string[]>(Array(12).fill(" "));
    const [wallets, setWallets] = useState<Wallet[]>([]);

 


    const generateWalletfromMneomics = (mnemonic:string, accountIndex:number): Wallet | null =>{
    
        try {
            const seedBuffer = mnemonicToSeedSync(mnemonic);
            const path = `m/44'/501'/0'/${accountIndex}'`;
            const {key: derivedSeed} = derivePath(path,seedBuffer.toString('hex'));
            let publicKey;
            let privateKey;
    
            const {secretKey} = nacl.sign.keyPair.fromSeed(derivedSeed);
            const keypair = Keypair.fromSecretKey(secretKey);
            privateKey  = bs58.encode(secretKey);
            publicKey = keypair.publicKey.toBase58();
    
            return {
                accountIndex,
                mnemonic,
                privateKey,
                pubKey: publicKey
            }
            
        } catch (error) {
            console.log(error);
            return null;
        }
    
    
    }

    const AddWallet = () =>{
        if (!mnemonicsWords){
            return;
        }

        const wallet = generateWalletfromMneomics(mnemonicsWords.join(" "), wallets.length);
        if (wallet) {
          const updatedWallets = [...wallets, wallet];
          setWallets(updatedWallets);
        }


    }




    const handleGenerateWallet = () =>{
        let mnemonic;



        mnemonic = generateMnemonic();
        const words = mnemonic.split(" ");
        setMnemonicsWords(words);

        const wallet = generateWalletfromMneomics(mnemonic, wallets.length);
        if (wallet){
            const updatedWallets = [...wallets,wallet];
            setWallets(updatedWallets);
        }
    }


    return (
      <div className="flex flex-col gap-3">
        <div className="outline-1 p-3 ">
          {wallets.map((w,i)=>(
            <div key={i} className="whitespace-pre-wrap">
                {JSON.stringify(w,null,3)}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-5">

        <button
          className="cursor-pointer p-2 outline-1 rounded-md bg-white text-black font-bold hover:scale-105 duration-600"
          onClick={() => {handleGenerateWallet();}}
          >
            Generate Wallet
        </button>
        <button
          className="cursor-pointer p-2 outline-1 rounded-md bg-white text-black font-bold hover:scale-105 duration-600"
          onClick={() => {AddWallet();}}
          >
            Add Wallet
        </button>
            </div>
      </div>
    );
}


export default WalletGenerator;