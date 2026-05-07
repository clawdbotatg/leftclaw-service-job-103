# Base Guest Book

An on-chain guest book on Base blockchain with a Windows 95 aesthetic.

## What it does

Users connect their Ethereum wallet and leave a permanent message on-chain. All entries are stored in the GuestBook smart contract on Base and are publicly readable forever.

## Contract

- **GuestBook**: [`0x864c54b482885098d824dfd1b497b10ebca7a267`](https://basescan.org/address/0x864c54b482885098d824dfd1b497b10ebca7a267)
- Network: Base (Chain ID 8453)
- Owner: Pending acceptance by client

## Live App

Deployed on IPFS via bgipfs.

## Local Development

```bash
yarn install
yarn fork --network base
yarn deploy
yarn start
```
