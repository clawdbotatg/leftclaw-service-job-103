"use client";

import { useMemo, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { base } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const MAX_MESSAGE_LENGTH = 280;

type Entry = {
  signer: `0x${string}`;
  message: string;
  timestamp: bigint;
};

const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  const datePart = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${datePart} ${timePart}`;
};

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const [message, setMessage] = useState("");

  const { data: entries, refetch: refetchEntries } = useScaffoldReadContract({
    contractName: "GuestBook",
    functionName: "getEntries",
  });

  const { data: entryCount } = useScaffoldReadContract({
    contractName: "GuestBook",
    functionName: "getEntryCount",
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract({
    contractName: "GuestBook",
  });

  const sortedEntries = useMemo(() => {
    if (!entries) return [] as Entry[];
    return [...(entries as readonly Entry[])].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [entries]);

  const onWrongNetwork = isConnected && chainId !== base.id;
  const isReady = isConnected && !onWrongNetwork;

  const handleSign = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      notification.warning("Please write a message before signing.");
      return;
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      notification.error(`Message too long (max ${MAX_MESSAGE_LENGTH} characters).`);
      return;
    }

    try {
      await writeContractAsync({
        functionName: "sign",
        args: [trimmed],
      });
      setMessage("");
      await refetchEntries();
    } catch (error) {
      console.error(error);
      notification.error("Failed to sign the guest book. Please try again.");
    }
  };

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="win95-window w-full max-w-3xl">
        {/* Title bar */}
        <div className="win95-titlebar">
          <span className="select-none">📖 Base Guest Book</span>
          <div className="win95-titlebar-buttons">
            <span className="win95-titlebar-button" aria-hidden>
              _
            </span>
            <span className="win95-titlebar-button" aria-hidden>
              □
            </span>
            <span className="win95-titlebar-button" aria-hidden>
              ✕
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Sign form section */}
          <section className="win95-raised bg-[#c0c0c0] p-4">
            <h2 className="m-0 mb-3 text-base">Sign the Guest Book</h2>

            {!isConnected && (
              <div className="flex flex-col gap-3">
                <p className="m-0">Connect your wallet to leave a permanent message on Base.</p>
                <button type="button" className="win95-button self-start" onClick={() => openConnectModal?.()}>
                  Connect Wallet
                </button>
              </div>
            )}

            {onWrongNetwork && (
              <div className="flex flex-col gap-3">
                <p className="m-0">You are on the wrong network. Please switch to Base.</p>
                <button
                  type="button"
                  className="win95-button self-start"
                  onClick={() => switchChain({ chainId: base.id })}
                >
                  Switch to Base
                </button>
              </div>
            )}

            {isReady && (
              <div className="flex flex-col gap-2">
                <label htmlFor="guestbook-message" className="font-bold">
                  Your message
                </label>
                <textarea
                  id="guestbook-message"
                  className="win95-input w-full resize-none"
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Leave a message for the chain..."
                  disabled={isPending}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    {message.length} / {MAX_MESSAGE_LENGTH}
                  </span>
                  <button
                    type="button"
                    className="win95-button"
                    onClick={handleSign}
                    disabled={isPending || message.trim().length === 0}
                  >
                    {isPending ? "Signing..." : "Sign Guest Book"}
                  </button>
                </div>
                {connectedAddress && (
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span>Signing as:</span>
                    <Address address={connectedAddress} />
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Entries section */}
          <section className="win95-raised bg-[#c0c0c0] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="m-0 text-base">Entries</h2>
              <span className="win95-statusbar-cell text-xs">
                {entryCount !== undefined ? `${entryCount.toString()} total` : "..."}
              </span>
            </div>

            <div className="win95-sunken bg-white p-2 max-h-[480px] overflow-y-auto">
              {sortedEntries.length === 0 ? (
                <div className="p-4 text-center text-sm">No entries yet. Be the first to sign!</div>
              ) : (
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  {sortedEntries.map((entry, idx) => (
                    <li
                      key={`${entry.signer}-${entry.timestamp.toString()}-${idx}`}
                      className="win95-sunken bg-[#c0c0c0] p-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Address address={entry.signer} />
                        <span className="text-xs">{formatTimestamp(entry.timestamp)}</span>
                      </div>
                      <p className="mt-2 mb-0 break-words whitespace-pre-wrap">{entry.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
