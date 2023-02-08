yarn hardhat run --network localhost scripts/01-deploy_SemaphoreVoting.ts
yarn hardhat run --network localhost scripts/02-createPoll.ts
yarn hardhat run --network localhost scripts/03-addVoter.ts

# ngrok --log stdout http 8545
python3 ~/python/pagekite.py 8545 zkvoting.pagekite.me