#!/bin/bash

set -ex

## Check for 2 input arguments
if [ ! $# -eq 2 ]
  then
    echo "Usage: `basename $0` CIRCUIT PROVE[plonk|groth16]" 
    exit 0
fi

## Exit if error occurs
set -e

## 0. Preparation

### 0.1. Go to $1 dir
cd $1

### 0.2. Check for Circom file and Input file

if [ ! -f $1.circom ]; then
    echo "$1.circom does not exists!"
    exit 1
fi

if [ ! -f $1_input.json ]; then
    echo "$1_input.json does not exists!"
    exit 1
fi

## 1. Compile Circuit with Circom
circom $1.circom --r1cs --sym --wasm --c

### 1.2. Export R1CS to JSON for readability
snarkjs r1cs export json $1.r1cs $1.r1cs.json

## 3. Compute Witness  
node $1_js/generate_witness.js $1_js/$1.wasm $1_input.json $1_witness.wtns

### 4.2 Generate `zkey`
if [ ! -d zkeys ]; then
    mkdir zkeys
fi
snarkjs $2 setup $1.r1cs ../ptau/pot12_final.ptau zkeys/$1_$2_final.zkey

### 4.3.1. Export Verification key
snarkjs zkey export verificationkey zkeys/$1_$2_final.zkey zkeys/$1_verification_key_$2.json

## 5.1. Generate Proof
if [ ! -d proof ]; then
    mkdir proof
fi
snarkjs $2 prove zkeys/$1_$2_final.zkey $1_witness.wtns proof/$1_proof_$2.json proof/$1_public_$2.json

## 6 Verify Proof with CLI
snarkjs $2 verify zkeys/$1_verification_key_$2.json proof/$1_public_$2.json proof/$1_proof_$2.json

## 7.2. Generate `verifyProof()` Call Parameters 
snarkjs zkey export soliditycalldata proof/$1_public_$2.json proof/$1_proof_$2.json > $1_sol_calldata_$2.txt

## 7.3. Generate Verify Solidity Contract
snarkjs zkey export solidityverifier zkeys/$1_$2_final.zkey proof/$1_$2.sol

## 8. Copy wasm, zkey and verification key to react_app
cp $1_js/$1.wasm zkeys/$1_$2_final.zkey zkeys/$1_verification_key_$2.json ../../react_app/public/

set +ex