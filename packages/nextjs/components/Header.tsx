"use client";

import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header — Windows 95 styled title bar
 */
export const Header = () => {
  return (
    <div className="w-full" style={{ background: "#008080" }}>
      <div className="win95-titlebar" style={{ borderBottom: "1px solid #000000" }}>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              background: "#c0c0c0",
              boxShadow:
                "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #404040",
              marginRight: 4,
            }}
          />
          <span style={{ fontSize: 13 }}>Base Guest Book</span>
        </div>
        <div className="flex items-center gap-2">
          <RainbowKitCustomConnectButton />
          <div className="win95-titlebar-buttons">
            <span className="win95-titlebar-button" aria-label="minimize">
              _
            </span>
            <span className="win95-titlebar-button" aria-label="maximize">
              □
            </span>
            <span className="win95-titlebar-button" aria-label="close">
              ✕
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
