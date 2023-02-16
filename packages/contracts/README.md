# Anonymous voting using Semaphore + Polygon ID

This project demonstrates a basic use case for anonymous voting. It uses Polygon ID for authentication and Semaphore for anonymous voting.

## How to run

### Install dependencies

```bash
yarn install
```

### Setup

#### Environment variables

Copy the `.env.example` file to `.env` and fill in the values.

```bash
MNEMONIC=
RPC_MUMBAI_URL=
ETHERSCAN_API_KEY=
```

#### Polygon ID

1. Go to https://platform-test.polygonid.com and create a claim schema.
2. Generate QR code to issue claims and send to claimers.
3. Scan the QR code on the Polygon ID app to issue a claim to yourself.

### Run the server

Run a local fork of the Polygon Mumbai testnet and deploy semaphore contracts.

```bash
yarn localnode
yarn deployLocalnode
```

### Run the frontend

```bash
yarn react
```