// Imports
// ========================================================
import { Identity } from "@semaphore-protocol/identity"
import QRCode from 'qrcode'
import uuid from 'uuid-random';

import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";
import {schema, issuer} from "./polygon-id-constants.json"

const proofRequest = {
    // 1. UUID for the request
    // - can be anything UUID
    "id": uuid(),
    // 2. Content type used by the Polygon ID wallet
    // - needs to be constant / does not change
    "typ": "application/iden3comm-plain-json",
    "type": "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
    // 4. Payload to send for proof request
    "body": {
        // Function to be executed from the contract for the zk response
        "transaction_data": {
            // - deployed contract address where it will call a specific function
            "contract_address": semaphoreVotingAddress,
            // - hash of the function name from the ABI - b68967e2 = submitZKPResponse
            "method_id": "b68967e2",
            // - chain id of the network
            "chain_id": 1337,
            // - network name
            // "network": "polygon-mumbai"
            "network": "localhost"
        },
        // Reason for the request
        // - Unknown if used or not
        "reason": "dao voting",
        // Scope of request and information required
        // - Currently only supports a single array request
        "scope": [
            {
                // - random integer id of the scope
                "id": 1,
                // - type of request currently supports `credentialAtomicQuerySig` and `credentialAtomicQueryMTP` (not currently used)
                "circuit_id": "credentialAtomicQuerySig",
                // - conditions of the request
                "rules": {
                    // - only accepts query
                    "query": {
                        // - whitelist of polygon ID platform identifier
                        "allowed_issuers": [
                            issuer,
                            // "*"
                        ],
                        // - conditions to be met with zk-query-language - see https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/
                        "req": {
                            "Reputation": {
                                "$gt": 69
                            }
                        },
                        // - schema of the proof and type, type is case-sensitive
                        "schema": {
                            "url": schema.url,
                            "type": schema.type
                        }
                    }
                }
            }
        ]
    }
};


async function main(): Promise<void> {
  const identity = new Identity("test")
  console.log(`Created identity with commitment ${identity.commitment}`)

  const filename = "qr.png"
  await QRCode.toFile(filename, JSON.stringify(proofRequest), {errorCorrectionLevel: 'Q', type:'terminal', small: true})
  console.log(`QR code saved to ${filename}`)
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

