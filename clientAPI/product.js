'use strict';
const request = require('supertest');
var express = require('express');
const prodrouter = express.Router();
prodrouter.use(express.json());

const Web3API = require('web3');
require('dotenv/config');

var cors = require('cors');
prodrouter.options('*', cors());
prodrouter.use(cors());

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;

var log4js = require('log4js');
log4js.configure({
        appenders: {
          out: { type: 'stdout' },
        },
        categories: {
          default: { appenders: ['out'], level: 'info' },
        }
});
var logger = log4js.getLogger('REVIEWSYS:PRODUCT');

// Get product average rating
prodrouter.get('/getAvgRating/:productid', async (req, res) => {
    logger.info('================ GET getAvgRating');
    try {
		const productid = req.params.productid;
    	const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
    	const contract = new web3.eth.Contract(abi, address);
    	const response = await contract.methods.getProductAvgRating(productid).call();
		res.json({productname : response[0], avgRating: parseInt(response[1])/10});
	}
	catch(error) {
		logger.error('##### GET on getAvgRating - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Get total number of products in the review system
prodrouter.get('/getTotal', async (req, res) => {
    logger.info('================ GET getTotal');
    try {
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
    	const contract = new web3.eth.Contract(abi, address);
    	const response = await contract.methods.getTotalProducts().call();
		res.json({ success: true, totalProducts: parseInt(response) });
	}
	catch(error) {
		logger.error('##### GET on getTotal - Failed ');
        res.json({ success: false, message: response });
	}
});

// Get product details for productid
prodrouter.get('/getDetails/:productid', async (req, res) => {
    logger.info('================ GET getDetails');
    try {
		const productid = req.params.productid;
    	const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
    	const contract = new web3.eth.Contract(abi, address);
    	const response = await contract.methods.getProduct(productid).call();
		var jsonResponse = {
			ProductName : response[0],
			Price : parseInt(response[1]),
			IPFSHash : response[2],
			TotalReviews : parseInt(response[4]),
			ReviewedUsers: response[5]
		}
		res.json(jsonResponse);
	}
	catch(error) {
		logger.error('##### GET on getDetails - Failed ');
        res.json({ success: false, message: response });
	}
});

async function getReviewdDetailsForUserLocal(pid, usr) {
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const productid = pid;
		const user = usr;
		
		console.log(productid, user);
		var reviewData = {};
		const userComments = await contract.methods.getUserComments(productid, user).call();
		console.log(userComments);
		const userRating = await contract.methods.getUserRating(productid, user).call();
		console.log(userRating);
		const dateOfReview = await contract.methods.getUserDateOfReview(productid, user).call();
		console.log(dateOfReview);

		if (!parseInt(userRating)) {
			return("");
		} else {
			reviewData.user = user;
			reviewData.productid = productid;
			reviewData.comments = userComments;
			reviewData.rating = parseInt(userRating);
			reviewData.dateOfProductReview = (new Date(parseInt(dateOfReview * 1000))).toUTCString();
		}
		console.log(reviewData);
		return reviewData;
}

const  getReviewedDetailsForUser = async (req, res, next) => {
	try {
		let response = await getReviewdDetailsForUserLocal(req.params.productid, req.params.user);
		res.json(response)
	}
	catch(error) {
		logger.error('##### GET on getReviewedDetails - Failed ');
		res.json({ success: false, message: error.toString() });
	}
}

// Get user reviewed details for particular user for productid
prodrouter.get('/getReviewedDetails/:productid/:user', getReviewedDetailsForUser);

// Get all product details
prodrouter.get('/getAllDetailes', async (req, res) => {
    logger.info('================ GET getAllDetailes');

	try {
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const allPids = await contract.methods.getAllProductPids().call();

		var allProducts = []; 
		
		for (var i = 0; i < allPids.length; i++) {
			var product = {};
			const response = await contract.methods.getProduct(allPids[i]).call();
			product.productid = parseInt(allPids[i]);
			product.productName = response.productName;
			product.Price = parseInt(response.productPrice);
			product.ImageHash = response.productHash;
			product.avgRating = (parseInt(response.avgRating) * 0.1)/response.totalReviewed;
			product.totalReviewed = parseInt(response.totalReviewed);
			product.allusers = response.users;
			console.log(product.avgRating);
			allProducts.push(product);
		}
		res.json(allProducts);
	}
	catch(error) {
		logger.error('##### GET on getAllDetailes - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Get all users for productid
prodrouter.get('/getAllUsers/:productid', async (req, res) => {
    logger.info('================ GET getAllUsers');

	try {
		const productid = req.params.productid;
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const allUsersDetails = await contract.methods.getAllUsersForProduct(productid).call();
		res.json(allUsersDetails);
	}
	catch(error) {
		logger.error('##### GET on getAllUsers - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Get user comments for particular user for productid
prodrouter.get('/getUserComments/:productid/:user', async (req, res) => {
    logger.info('================ GET getUserComments');
    
	try {
		const productid = req.params.productid;
		const user = req.params.user;
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const userComments = await contract.methods.getUserComments(productid, user).call();
		res.json(userComments);
	}
	catch(error) {
		logger.error('##### GET on getUserComments - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Get user rating for particular user for productid
prodrouter.get('/getUserRating/:productid/:user', async (req, res) => {
    logger.info('================ GET getUserRating');
    try {
		const productid = req.params.productid;
		const user = req.params.user;
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const userRating = await contract.methods.getUserRating(productid, user).call();
		res.json(userRating);
	}
	catch(error) {
		logger.error('##### GET on getUserRating - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Get user rdate of review for productid
prodrouter.get('/getUserDateOfReview/:productid/:user', async (req, res) => {
    logger.info('================ GET getUserDateOfReview');
    
	try{
		const productid = req.params.productid;
		const user = req.params.user;
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const dateOfReview = await contract.methods.getUserDateOfReview(productid, user).call();
		res.json(dateOfReview);
	}
	catch(error) {
		logger.error('##### GET on getUserDateOfReview - Failed ');
        res.json({ success: false, message: eror.toString() });
	}
});

//Unique values
function onlyUniqueUsers(value, index, self) {
    return self.indexOf(value) === index;
  }

// Get user reviewed details for particular user for productid
prodrouter.get('/getAllReviewedDetails/:productid', async (req, res) => {
    logger.info('================ GET getAllReviewedDetails');
    
	try {
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		const productid = req.params.productid;
		var allReviews = [];

		var allusers = await contract.methods.getAllUsersForProduct(productid).call();
		console.log("all users " + allusers);
		var uniqueUsers = allusers.filter(onlyUniqueUsers);
		console.log("unique users " + uniqueUsers);

		for (var i = 0; i < uniqueUsers.length; i++) {
			console.log("user " + uniqueUsers[i]);
			let response =  await getReviewdDetailsForUserLocal(req.params.productid, uniqueUsers[i]);
			console.log(response);
			if (response) {
				allReviews.push(response);
			}
			
		}
		res.json(allReviews);
	}
	catch(error) {
		logger.error('##### GET on getAllReviewedDetails - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

// Add product
prodrouter.post('/add', async (req, res) => {
    logger.info('================ POST add');
	try {
		let from = req.body.from;
		let productname = req.body.productname;
		let price = req.body.price;
		let imagehash = req.body.imagehash;
		let passphrase = req.body.passphrase;

		var response = "";
		const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
		const contract = new web3.eth.Contract(abi, address);
		let isValidTransaction = false;
		let date = (new Date()).getTime();
		let currentTime = parseInt(date / 1000);
		const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
		console.log(unlock);
		
		response = await contract.methods.addProduct(productname, price, imagehash).send({ from: from });
		res.json({ success: true, txid: response.transactionHash });
	}
	catch(error) {
		logger.error('##### POST on add - Failed ');
        res.json({ success: false, message: error.toString() });
	}
});

module.exports = prodrouter;


