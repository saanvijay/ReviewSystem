# ReviewSystem
Ethereum Blockchain based review system

User can create his/her account using 'Create Wallet' functionality. After creating the wallet he/she can add new product to blockchain using 'Add Product' functionality, but to add the product user should have his/her wallet address and passphrase ready if not, you can't add new product. Blockchain will reject your proposal if the wallet address or passphrase is wrong. For a successfull 'Add Product' functionality user will get blockchain transaction-id which you can verify in Explorer.

Once the product is successfully added, you can view the product in home page as list. If you notice carefully, the image will not stored in the localhost instead it will be in IPFS. User will get only IPFS image hash. 

Any product which is added to the chain, user can review it. Again to review the product user should have his/her wallet address and his/her passphrase as well. Once reviewed, you can view all the reviews in the list. 

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
    - git clone https://github.com/etherparty/explorer
    - cd explorer (edit package.json and set port to 9000)
    - npm install 
    - npm start

4. UI Setup
    - cd review-app
    - npm install
    - npm start

### Blockchain is running on port http://localhost:8545
### NodeJS server is running on port http://localhost:8000
### Blockchain Explorer is running on port http://localhost:9000
### ReactJS client is running on port http://localhost:3000

## Login Page
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Login.png)

## Register Page
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Register.png)

## Home page
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Home.png)

## Create Wallet/View All Wallets
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Wallet.png)

## Add Product
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Addproduct.png)

## View Transaction In Blockchain Explorer
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Explorer.png)

## Review Product
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Review.png)

## View All Reviews
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Viewallreviews.png)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by

Vijaya Prakash<br />
https://www.linkedin.com/in/saanvijay/<br />
