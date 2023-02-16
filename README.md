# Anonymous voting using Semaphore + Polygon ID

This project demonstrates a basic implementation for anonymous voting. It uses Polygon ID for authentication and Semaphore for anonymous voting.

This was done as a project at the Polygon @ The Pit Hackathon. It is a collaboration effort between [@shuklaayush](https://github.com/shuklaayush) and [@flyingnobita](https://github.com/flyingnobita)

## Demo

https://user-images.githubusercontent.com/46126470/219390188-018f569f-871d-43f5-97f5-006f0949c0f7.mp4

## How to run

### Install dependencies

```bash
yarn install
```

### Setup

#### Environment variables

Copy the `packages/contracts/.env.example` file to `packages/contracts/.env` and fill in the values.

```bash
MNEMONIC=
RPC_MUMBAI_URL=
ETHERSCAN_API_KEY=
PAGEKITE_SUBDOMIAN=
```

#### Polygon ID

1. Go to https://platform-test.polygonid.com and create a claim schema with a single attribute:
```
Reputation: number
```
2. Generate QR code to issue claims and send to claimers.
3. Install the Polygon ID app on mobile and scan the QR code on the Polygon ID app to issue a claim to yourself.
4. Add details of the claim schema and issuer to `packages/contracts/scripts/polygon-id-constants.json` file.

#### Metamask mobile

1. Install the Metamask mobile app and create a new wallet.
2. Add the pagekite address (`https://${PAGEKITE_SUBDOMAIN}.pagekite.me`) as a custom RPC network.

### Steps

#### 

1. Instantiate a local fork of the Polygon Mumbai testnet, deploy semaphore contracts and create a dummy poll. 

```bash


# Spawn a local forked network
yarn localnode
# Deploy semaphore contracts and create a dummy poll
yarn deployLocalnode
```
This also initiates a tunnel to the local server at `https://${PAGEKITE_SUBDOMAIN}.pagekite.me` using pagekite.

2. Start the web-app showing the proposal and voting choices.

```bash
yarn react
```

3. Scan the QR code on the webpage using the Polygon ID app. This generates a proof for the claim in your Polygon ID wallet and initiates a transaction to add yourself as voter.

4. Verify the nonce on Metamask mobile for the transaction, bump up the gas limit to at least 4 million and send the transaction.

5. Start the poll by running

```bash
yarn startPoll
```

6. Connect your metamask mobile to the web-app via Wallet Connect. 
  - Click connect on the frontend and wait for the wallet connect QR code to pop-up.
  - Scan it on the Metamask mobile app to connect. Click connect again to see on the signer address that it's connected.

7. Initiate the voting transaction by clicking on a choice. Verify the nonce on Metamask mobile and sign the transaction.

8. Wait for the transaction to be mined and the count to be updated on the frontend.
