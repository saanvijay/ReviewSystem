# ReviewSystem
Ethereum Blockchain based review system

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
    - Open clientAPI/product.js and clientAPI/review.js and add ABI and contract address
    - cd ClinetAPI; npm install; npm start

3. Configure Blockchain Explorer
    - git clone https://github.com/etherparty/explorer
    - cd explorer; npm start

4. UI Setup
    - cd review-app
    - npm install
    - npm start

## Home page
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Home-Page.png)

## Create Wallet
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Create-Wallet.png)

## Add Product
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Add-Product.png)

## View Transaction
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/View-Transaction.png)

## Review Product
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/Review-Product.png)

## View All Reviews
![alt text](https://github.com/saanvijay/ReviewSystem/blob/main/imgs/View-AllReviews.png)

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by

Vijaya Prakash<br />
https://www.linkedin.com/in/saanvijay/<br />