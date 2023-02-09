# Anonymous voting using Semaphore + Polygon ID

This project demonstrates a basic implementation for anonymous voting. It uses Polygon ID for authentication and Semaphore for anonymous voting.

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

1. Go to https://platform-test.polygonid.com and create a claim schema.
2. Generate QR code to issue claims and send to claimers.
3. Install the Polygon ID app on mobile and scan the QR code on the Polygon ID app to issue a claim to yourself.

#### Metamask mobile

1. Install the Metamask mobile app and create a new wallet.
2. Add the pagekite address (`https://${PAGEKITE_SUBDOMAIN}.pagekite.me`) as a custom RPC network.

### Run the server

Run a local fork of the Polygon Mumbai testnet and deploy semaphore contracts. This also initiates a tunnel to the local server using pagekite at `https://${PAGEKITE_SUBDOMAIN}.pagekite.me`.

```bash
cd packages/contracts

yarn localnode
yarn deployLocalnode
```

### Run the frontend

```bash
yarn react
```

###

Issuer is responsible for issuing a claim of whether a person is a member of a DAO and whether they're degen or not, not to do the actual voting.