"use client";

import { Keypair } from "@solana/web3.js";
import {
  generateMnemonic,
  mnemonicToSeed,
  mnemonicToSeedSync,
  validateMnemonic,
} from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useEffect, useState } from "react";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { ethers } from "ethers";
import copy from "copy-to-clipboard";
import { Copy } from "lucide-react";
import Button from "@/components/Button";
import Header from "@/components/Header";
interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  accountIndex: number;
}

export default function WalletGenerator() {
  const [mnemonicsWords, setMnemonicsWords] = useState<string[]>(
    Array(12).fill(" ")
  );
  const [mneomicsInput, setMenomicsInput] = useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [path, setPath] = useState<string>();

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonics = localStorage.getItem("mnemonics");
    const walletSelected = localStorage.getItem("path");

    if (storedWallets && storedMnemonics && walletSelected) {
      setMnemonicsWords(JSON.parse(storedMnemonics));
       setWallets(JSON.parse(storedWallets));
      setPath(walletSelected);
    }
    console.log(mnemonicsWords)
    console.log(wallets)
  }, []);

  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };
  const pathTypeName = pathTypeNames[pathTypes[0]] || "";

  const handleClearWallets = ()=>{
    localStorage.removeItem('wallets');
    localStorage.removeItem('mnemonics');
    setWallets([]);
    setMnemonicsWords([]);
    setPath("");

  }
  const generateWalletfromMneomics = (
    mnemonic: string,
    accountIndex: number,
    pathType: string
  ): Wallet | null => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
      console.log(path);
      const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));
      let publicKeyEncoded;
      let privateKeyEncoded;

      if (pathType === "501") {
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);
        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathType === "60") {
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;

        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        return null;
      }

      return {
        accountIndex,
        mnemonic,
        privateKey: privateKeyEncoded,
        publicKey: publicKeyEncoded,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const AddWallet = () => {
    if (!mneomicsInput) {
      return;
    }
   const words = mneomicsInput.split(" ");
    setMnemonicsWords(words)
    console.log(mnemonicsWords)
    const wallet = generateWalletfromMneomics(
      words.join(" "),
      wallets.length,
      path || "501"
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("mnemonics", JSON.stringify(words));
    }
  };

  const handleGenerateWallet = () => {
    let mnemonic = mneomicsInput.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        console.log("Invalid Mnemonic");
      }
    } else {
      mnemonic = generateMnemonic();
    }

    const words = mnemonic.split(" ");
    setMnemonicsWords(words);

    const wallet = generateWalletfromMneomics(
      mnemonic,
      wallets.length,
      path || ""
    );
    console.log(wallet);
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("mnemonics", JSON.stringify(words));
      localStorage.setItem("path", path || "501");
    }
  };

  return (
    <div>
      <Header />
      {!path ? (
        <div className="min-h-96 mt-5 p-30 flex flex-col">
          <span className="text-4xl">Vault suports multiple blockchains</span>
          <span className="text-xl font-semibold  text-neutral-400">
            Choose a blockchain to get started
          </span>
          <div className="flex gap-4 my-3">
            <Button
              onClick={() => {
                setPath("501");
                localStorage.setItem('path',"501")
              }}
              label="Solana"
              variant="dark"
              />
            <Button
              onClick={() => {
                setPath("60");
                localStorage.setItem('path',"60")
              }}
              label="Ethereum"
              variant="light"
            />
          </div>
        </div>
      ) : (
        <div>
          {wallets.length !== 0 ? (
            <div className="flex flex-col ">
              <div
                className="m-20 flex flex-col  cursor-pointer gap-10 outline-1 outline-neutral-200 p-5 rounded-md"
                onClick={() => copy(mnemonicsWords.join(" "))}
              >
                <div className="flex flex-col">
                  <span className="text-4xl font-bold tracking-tight  ">
                    Secret Recovery Phase
                  </span>
                  <span className="text-md text-neutral-600 font-bold tracking-wide ">
                    Save these words in a safe place
                  </span>
                </div>
                <div className="grid grid-cols-4  gap-3 gap-x-20 ">
                  {mnemonicsWords.map((word, i) => (
                    <div
                      key={i}
                      className="outline-1 flex  py-3 px-2 rounded-md bg-neutral-50 outline-neutral-400"
                    >
                      {word}
                    </div>
                  ))}
                  <span className="text-sm text-neutral-500 font-semibold">
                    Click anywhere to copy
                  </span>
                </div>
              </div>
              <div className="flex justify-between   gap-2 items-center mx-20">
                <div>
                  <span className="text-3xl font-semibold">
                    {path === "501" ? "Solana" : "Ethereum"} Wallet
                  </span>
                </div>
                <div className="flex gap-10">
                  <Button
                    variant="dark"
                    onClick={() => {
                      AddWallet();
                    }}
                    label="Add Wallet"
                  />
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleClearWallets();
                    }}
                    label="Delete Wallets"
                  />
                </div>
              </div>
              {wallets.map((w, i) => (
                <div className="mx-20 my-3 flex flex-col  cursor-pointer gap-2 outline-1 outline-neutral-200  rounded-xl">
                  <div className="flex flex-col p-5">
                    <span className="text-3xl font-bold tracking-tight  ">
                      Wallet {i + 1}
                    </span>
                    {/* <span className="text-md text-neutral-600 font-bold tracking-wide ">
                Save these words in a safe place
              </span> */}
                  </div>
                  <div className="flex flex-col gap-10 bg-neutral-50 p-5 rounded-t-3xl  ">
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-neutral-600">
                        Private Key:
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center gap-2 font-semibold">
                        {w.privateKey}{" "}
                        <Copy
                          className="size-4"
                          onClick={() => copy(w.privateKey)}
                        />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-neutral-600">
                        Public Key:
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center gap-2 font-semibold">
                        {w.publicKey}{" "}
                        <Copy
                          className="size-4"
                          onClick={() => copy(w.publicKey)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="m-20 flex flex-col">
              <span className="text-4xl font-bold tracking-tight ">
                Secret Recovery Phase
              </span>
              <span className="text-md text-neutral-600 font-bold tracking-wide ">
                Save these words in a safe place
              </span>
              <div className="flex gap-2 items-center mt-3">
                <input
                  onChange={(e) => setMenomicsInput(e.target.value)}
                  value={mneomicsInput}
                  className="outline-1 outline-neutral-200 py-2 text-sm px-3 w-310 rounded-sm focus:outline-2 focus:outline-black "
                  placeholder="Enter your secret phrase (or leave blank to generate)"
                  type="password"
                />
                {mneomicsInput ? (
                  <Button
                    variant="dark"
                    onClick={() => {
                      AddWallet();
                    }}
                    label="Add Wallet"
                  />
                ) : (
                  <Button
                    variant="dark"
                    onClick={() => {
                      handleGenerateWallet();
                    }}
                    label="Generate Wallet"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

