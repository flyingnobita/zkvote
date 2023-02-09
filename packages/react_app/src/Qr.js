import { Contract as semaphoreVotingAddress } from "@nft-zk/contracts/frontend/SemaphoreVoting_address.json";

export const proofRequest = {
  // 1. UUID for the request
  // - can be anything UUID
  id: "c811849d-6bfb-4d85-936e-3d9759c7f105",
  // 2. Content type used by the Polygon ID wallet
  // - needs to be constant / does not change
  typ: "application/iden3comm-plain-json",
  // 3. ?
  type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
  // 4. Payload to send for proof request
  body: {
    // Function to be executed from the contract for the zk response
    transaction_data: {
      // - deployed contract address where it will call a specific function
      contract_address: semaphoreVotingAddress,
      // - hash of the function name from the ABI - b68967e2 = submitZKPResponse
      method_id: "b68967e2",
      // - chain id of the network
      chain_id: 1337,
      // - network name
      // "network": "polygon-mumbai"
      network: "localhost",
    },
    // Reason for the request
    // - Unknown if used or not
    reason: "DAO voting",
    // Scope of request and information required
    // - Currently only supports a single array request
    scope: [
      {
        // - random integer id of the scope
        id: 1,
        // - type of request currently supports `credentialAtomicQuerySig` and `credentialAtomicQueryMTP` (not currently used)
        circuit_id: "credentialAtomicQuerySig",
        // - conditions of the request
        rules: {
          // - only accepts query
          query: {
            // - whitelist of polygon ID platform identifier
            allowed_issuers: [
              "118FaDqXhUcL1eZSV1fgupqkHDqc5Vgh4HXDrhFZP",
              // "*"
            ],
            // - conditions to be met with zk-query-language - see https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/
            req: {
              "Reputation": {
                $gt: 69,
              },
            },
            // - schema of the proof and type, type is case-sensitive
            schema: {
              url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/a6b5ae9b-758d-44c3-a86b-c3ddf4a9739e.json-ld",
              type: "DeFi DAO Member",
            },
          },
        },
      },
    ],
  },
};
