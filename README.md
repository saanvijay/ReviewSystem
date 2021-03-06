

# ReviewSystem
Ethereum Blockchain based review system

User can create his/her account using 'Create Wallet' functionality. After creating the wallet he/she can add new product to blockchain using 'Add Product' functionality, but to add the product user should have connected to metamask wallet, if not you can't add new product. For a successfull 'Add Product' functionality user will get blockchain transaction-id which you can verify in Explorer.

Once the product is successfully added, you can view the product in home page as list. If you notice carefully, the image will not stored in the localhost instead it will be in IPFS. User will get only IPFS image hash. 

Any product which is added to the chain, any user can review it. Again to review the product user should connected to metamask as well. Once reviewed, you can view all the reviews in the list. 

All the data will be stored and verified in Ethereum Private Blockchain.

[![Node.js](https://img.shields.io/badge/Node.js-14.15.4-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.14.10-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


## Pre-requisites
1. Ethereum Blockchain (geth)
2. Solidity
3. NodeJS 
4. ReactJS 
5. Metamask Wallet
6. MongoDB

## Steps
1. Setup Blockchain Network
    - Install Ethereum 
    - Create new geth account
    - Use puppet to configure Private blockchain network
    - Initialize network with genesis configuration
    - Bring-up geth network

2. Compile and Deploy smart-contract
    - Open remix and paste the smart-contract
    - Select the Solidity 4.24 version compiler and compile it.
    - Make sure you have dummy Ether in your wallet and in Remix click Deploy
    - Copy the contract address and ABI
    - Open .env and add ABI and contract address
    - cd ServerAPI; npm install; npm start

3. Configure Blockchain Explorer
    - git clone https://github.com/web3labs/epirus-free.git
    - NODE_ENDPOINT=http://172.16.239.1:8545 docker-compose up
    - http://localhost/

4. UI Setup
    - cd review-app
    - npm install
    - npm start

### Blockchain is running on port http://localhost:8545
### NodeJS server is running on port http://localhost:8000
### Blockchain Explorer is running on port http://localhost
### ReactJS client is running on port http://localhost:3000

## Demo
https://user-images.githubusercontent.com/30116233/123213865-272fad00-d4e4-11eb-96a9-bc3b9b638f9e.mp4


## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by

Vijaya Prakash<br />
https://www.linkedin.com/in/saanvijay/<br />
