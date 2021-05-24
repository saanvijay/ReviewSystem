'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('product');
const Web3API = require('web3');
require('dotenv/config');

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;

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

const getReviewedDetails = async function (productid, user) {
	try {
        var reviewData = {};
        const userComments = await this.getUserComments(productid, user);
		const userRating = await this.getUserRating(productid, user);
		const dateOfReview = await this.getUserDateOfReview(productid, user);
	
		if (!parseInt(userRating)) {
			return "";
		}
		reviewData.user = user;
		reviewData.productid = productid;
		reviewData.comments = userComments;
		reviewData.rating = parseInt(userRating);
		reviewData.dateOfProductReview = (new Date(parseInt(dateOfReview * 1000))).toUTCString();
	
        return reviewData;
    }
    catch (error) {
        logger.error('###### getReviewedDetails - Failed to get product reviewed details: with error %s', error.toString())
        return 'failed ' + error.toString();
    }
}
const getAllProductDetailes = async function () {
    try {
		console.log(abi);
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
        return allProducts;
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
exports.getReviewedDetails = getReviewedDetails;



