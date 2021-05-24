'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('review');
const Web3API = require('web3');

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;

const reviewProduct = async function (from, productid, rating, comments, passphrase) {
        try {
                const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
                const contract = new web3.eth.Contract(abi, address);
                let isValidTransaction = false;
                let date = (new Date()).getTime();
                let currentTime = parseInt(date / 1000);
                const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
                console.log(unlock);
                console.log(productid, rating, comments, currentTime);
                
                const response = await contract.methods.reviewProduct(productid, rating, comments, currentTime).send({ from: from });
                console.log(response);
                if (!response) {
                        return "Unable to review/Insufficient Balance";
                } else {
                        return response.transactionHash;
                }
        }
        catch (error) {
                logger.error('###### reviewProduct - Failed to review the product %s for user: %s with error %s', productid, from, error.toString())
                return 'failed ' + error.toString();
        }
}

const addProduct = async function (from, productname, price, imagehash, passphrase) {
    try {
            
            const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
            const contract = new web3.eth.Contract(abi, address);
            let isValidTransaction = false;
            let date = (new Date()).getTime();
            let currentTime = parseInt(date / 1000);
            const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
            console.log(unlock);
            
            const response = await contract.methods.addProduct(productname, price, imagehash).send({ from: from });
            console.log(response);
            if (!response) {
                    return "Unable to add product/Insufficient Balance";
            } else {
                    return response.transactionHash;
            }
    }
    catch (error) {
            logger.error('###### addProduct - Failed to review the product %s for user: %s with error %s', productname, from, error.toString())
            return 'failed ' + error.toString();
    }
}

const getTransactionDetails = async function (txnHash) {
    try {
            console.log(txnHash);
            const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
            const contract = new web3.eth.Contract(abi, address);
            var txid = "";
            const details = await web3.eth.getTransactionReceipt(txnHash);
            return details;
    }
    catch (error) {
            logger.error('###### getTransactionDetails - Failed to get transaction detail for txid: %s with error %s', txnHash, error.toString())
            return 'failed ' + error.toString();
    }
}
exports.getTransactionDetails = getTransactionDetails;
exports.reviewProduct = reviewProduct;
exports.addProduct = addProduct;

