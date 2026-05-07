import React from "react";

const CONTRACT_ADDRESS = "0x864c54b482885098d824dfd1b497b10ebca7a267";

/**
 * Site footer — Windows 95 style status bar.
 */
export const Footer = () => {
  return (
    <div className="win95-statusbar w-full mt-auto">
      <div className="win95-statusbar-cell text-xs">
        Contract:{" "}
        <a href={`https://basescan.org/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="link">
          {CONTRACT_ADDRESS}
        </a>
      </div>
      <div className="win95-statusbar-cell text-xs">Base Network</div>
    </div>
  );
};
