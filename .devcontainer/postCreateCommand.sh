#!/bin/bash

sudo chown vscode node_modules
sudo chown vscode packages/react_app/node_modules

# yarn global add snarkjs@latest # DON'T USE - yarn require command prefix 'yarn snarkjs...' and 'file paths defaults to workspace root when in yarn'

npm install -g snarkjs

yarn
