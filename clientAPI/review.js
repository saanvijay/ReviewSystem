'use strict';
const { response } = require('express');
var Tx = require('ethereumjs-tx').Transaction
var log4js = require('log4js');
const Web3API = require('web3');

var logger = log4js.getLogger('review');

var rpcURL = 'http://localhost:8545';
const EthereumTx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "pname",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "productId",
				"type": "uint256"
			},
			{
				"name": "urating",
				"type": "uint256"
			},
			{
				"name": "ucomments",
				"type": "string"
			}
		],
		"name": "reviewProduct",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "pid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "pname",
				"type": "string"
			}
		],
		"name": "addProductEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "pid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "avgRating",
				"type": "uint256"
			}
		],
		"name": "reviewProductEvent",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllProductDetailes",
		"outputs": [
			{
				"components": [
					{
						"name": "productName",
						"type": "string"
					},
					{
						"name": "productPrice",
						"type": "uint256"
					},
					{
						"name": "productHash",
						"type": "string"
					},
					{
						"name": "avgRating",
						"type": "uint256"
					},
					{
						"name": "totalReviewed",
						"type": "uint256"
					}
				],
				"name": "",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllUsers",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"components": [
					{
						"name": "productName",
						"type": "string"
					},
					{
						"name": "productPrice",
						"type": "uint256"
					},
					{
						"name": "productHash",
						"type": "string"
					},
					{
						"name": "avgRating",
						"type": "uint256"
					},
					{
						"name": "totalReviewed",
						"type": "uint256"
					}
				],
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getProductAvgRating",
		"outputs": [
			{
				"name": "pname",
				"type": "string"
			},
			{
				"name": "avgRating",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTotalProducts",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getUserComments",
		"outputs": [
			{
				"name": "ucomments",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getUserRating",
		"outputs": [
			{
				"name": "urating",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ProductIds",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Products",
		"outputs": [
			{
				"name": "productName",
				"type": "string"
			},
			{
				"name": "productPrice",
				"type": "uint256"
			},
			{
				"name": "productHash",
				"type": "string"
			},
			{
				"name": "avgRating",
				"type": "uint256"
			},
			{
				"name": "totalReviewed",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "TotalProducts",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Users",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];
const address = '0xd2aea067e0c2a0d2662d91ba8153effbb2517b29';
const reviewProduct = async function (from, productid, rating, comments, passphrase) {
        try {
                console.log(from, to, passphrase);
                const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
                const contract = new web3.eth.Contract(abi, address);
                let isValidTransaction = false;
                let date = (new Date()).getTime();
                let currentTime = parseInt(date / 1000);
                const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
                console.log(unlock);
                
                const response = await contract.methods.reviewProduct(productid, rating, comments).send({ from: from });
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

const addProduct = async function (productname, price, from, passphrase) {
    try {
            console.log(from, to, passphrase);
            const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
            const contract = new web3.eth.Contract(abi, address);
            let isValidTransaction = false;
            let date = (new Date()).getTime();
            let currentTime = parseInt(date / 1000);
            const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
            console.log(unlock);
            
            const response = await contract.methods.addProduct(productname, price).send({ from: from });
            console.log(response);
            if (!response) {
                    return "Unable to add product/Insufficient Balance";
            } else {
                    return response.transactionHash;
            }
    }
    catch (error) {
            logger.error('###### addProduct - Failed to review the product %s for user: %s with error %s', productid, from, error.toString())
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

