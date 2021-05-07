'use strict';
const { response } = require('express');
var log4js = require('log4js');
const Web3API = require('web3');
var logger = log4js.getLogger('product');
var rpcURL = 'http://localhost:8545';
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
			},
			{
				"name": "imagehash",
				"type": "string"
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
			},
			{
				"name": "reviewDate",
				"type": "uint256"
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
						"name": "productId",
						"type": "uint256"
					},
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
		"inputs": [
			{
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getAllUsersForProduct",
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
		"name": "getCurrentUserComments",
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
		"name": "getCurrentUserRating",
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
				"name": "pid",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"components": [
					{
						"name": "productId",
						"type": "uint256"
					},
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
			},
			{
				"name": "user",
				"type": "address"
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
			},
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserDateOfReview",
		"outputs": [
			{
				"name": "reviewDate",
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
			},
			{
				"name": "user",
				"type": "address"
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
				"name": "productId",
				"type": "uint256"
			},
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
	}
];

const address = '0x85b43b889f1ce01df469e17f736df1824e44a3ea';

const getProductAvgRating = async function (productid) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const avgRating = await contract.methods.getProductAvgRating(productid).call();
        return avgRating;
    }
    catch (error) {
        logger.error('###### getProductAvgRating - Failed to get average rating for productid: %s with error %s', productid, error.toString())
        return 'failed ' + error.toString();
    }
}

const getTotalProducts = async function () {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const totalProducts = await contract.methods.getTotalProducts().call();
        return totalProducts;
    }
    catch (error) {
        logger.error('###### getTotalProducts - Failed to get total products: with error %s', error.toString())
        return 'failed ' + error.toString();
    }
}

const getProductDetails = async function (productid) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const product = await contract.methods.getProduct(productid).call();
        return product;
    }
    catch (error) {
        logger.error('###### getProductDetails - Failed to get productDetails for product: %s with error %s',productid, error.toString())
        return 'failed ' + error.toString();
    }
}

const getAllProductDetailes = async function () {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const allProductDetails = await contract.methods.getAllProductDetailes().call();
        return allProductDetails;
    }
    catch (error) {
        logger.error('###### getAllProductDetailes - Failed to get all product details: with error %s', error.toString())
        return 'failed ' + error.toString();
    }
}

const getAllUsersForProduct = async function (productid) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const allUsersDetails = await contract.methods.getAllUsersForProduct(productid).call();
        return allUsersDetails;
    }
    catch (error) {
        logger.error('###### getAllUsersForProduct - Failed to get all user details: with error %s', error.toString())
        return 'failed ' + error.toString();
    }
}

const getUserComments = async function (productid, user) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const userComments = await contract.methods.getUserComments(productid, user).call();
        return userComments;
    }
    catch (error) {
        logger.error('###### getUserComments - Failed to get user comments for the product %s for the user %s: with error %s', productid, user, error.toString())
        return 'failed ' + error.toString();
    }
}

const getUserRating = async function (productid, user) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const userRating = await contract.methods.getUserRating(productid, user).call();
        return userRating;
    }
    catch (error) {
        logger.error('###### getUserRating - Failed to get user comments for the product %s for the user %s: with error %s', productid, user, error.toString())
        return 'failed ' + error.toString();
    }
}

const getUserDateOfReview = async function (productid, user) {
    try {
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const dateOfReview = await contract.methods.getUserDateOfReview(productid, user).call();
        return dateOfReview;
    }
    catch (error) {
        logger.error('###### getUserDateOfReview - Failed to get user date of review for the product %s for the user %s: with error %s', productid, user, error.toString())
        return 'failed ' + error.toString();
    }
}

exports.getProductAvgRating = getProductAvgRating;
exports.getTotalProducts = getTotalProducts;
exports.getProductDetails = getProductDetails;
exports.getAllProductDetailes = getAllProductDetailes;
exports.getAllUsersForProduct = getAllUsersForProduct;
exports.getUserComments = getUserComments;
exports.getUserRating = getUserRating;
exports.getUserDateOfReview = getUserDateOfReview;



