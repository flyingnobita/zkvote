yarn hardhat run --network localhost scripts/01-deploy_SemaphoreVoting.ts
yarn hardhat run --network localhost scripts/02-createPoll.ts

# ngrok --log stdout http 8545
python3 ~/python/pagekite.py 8545 zkvoting.pagekite.me

python3 /workspaces/zkvote/pagekite.py 8545 zkvoting2.pagekite.me