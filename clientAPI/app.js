'use strict';
var log4js = require('log4js');
const Web3 = require('web3');
log4js.configure({
        appenders: {
          out: { type: 'stdout' },
        },
        categories: {
          default: { appenders: ['out'], level: 'info' },
        }
});
var logger = log4js.getLogger('REVIEWSYS');
const WebSocketServer = require('ws');
var express = require('express');
var bodyParser = require('body-parser');
var account = require('./account.js');
var product = require('./product.js');
var review = require('./review.js');
var http = require('http');
var util = require('util');
const fs = require('fs');
var app = express();
var cors = require('cors');
const { json } = require('body-parser');
var host = 'localhost';
var port = 8000;
var blockchainPort = 8545;
let constraint = 0;
let user = '';
let productid = 0;
let from = '';
let passphrase ='';
let productname ='';
let price = 0;
let imagehash = '';
let rating = '';
let comments = '';

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATIONS ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: false
}));
app.use(function(req, res, next) {
        logger.info(' ##### New request for URL %s',req.originalUrl);
        return next();
});
//wrapper to handle errors thrown by async functions. We can catch all
//errors thrown by async functions in a single place, here in this function,
//rather than having a try-catch in every function below. The 'next' statement
//used here will invoke the error handler function - see the end of this script
const awaitHandler = (fn) => {
        return async (req, res, next) => {
                try {
                        await fn(req, res, next)
                }
                catch (err) {
                        next(err)
                }
        }
}
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  Listening on: http://%s:%s  ******************',host,port);
server.timeout = 240000;
function getErrorMessage(field) {
        var response = {
                success: false,
                message: field + ' field is missing or Invalid in the request'
        };
        return response;
}
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START WEBSOCKET SERVER ///////////////////////
///////////////////////////////////////////////////////////////////////////////
const wss = new WebSocketServer.Server({ server });
wss.on('connection', function connection(ws) {
        logger.info('****************** WEBSOCKET SERVER - received connection ************************');
        ws.on('message', function incoming(message) {
                console.log('##### Websocket Server received message: %s', message);
        });
        ws.send('something');
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Health check - can be called by load balancer to check health of REST API
app.get('/health', awaitHandler(async (req, res) => {
        res.sendStatus(200);
}));
// Create new wallet
app.post('/createAccount', awaitHandler(async (req, res) => {
    logger.info('================ POST on create account');
    
    var passphrase = req.body.passphrase;
    let response = await account.createAccount(passphrase);
    if (response && typeof response !== 'string') {
       logger.info('##### Create account/wallet failed - %s', response);
        res.json(response);
    } else {
        logger.error('##### Create account/wallet failed');
        res.json({ success: false, message: response });
    }
}));
// Create all accounts
app.get('/listAllAccounts', awaitHandler(async (req, res) => {
    logger.info('================ GET on list all accounts');
    
    let response = await account.listAllAccounts();
    if (response && typeof response !== 'string') {
        res.json({success: true, accounts: response});
    } else {
        logger.error('##### listAllAccounts - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Review product
app.post('/reviewProduct', awaitHandler(async (req, res) => {
    logger.info('================ POST reviewProduct');
    from = req.body.from;
    productid = req.body.productid;
    rating = req.body.rating;
    comments = req.body.comments;
    passphrase = req.body.passphrase;

    var response = "";
    response = await review.reviewProduct(from, productid, rating, comments, passphrase);
    
    if (response != "") {
        res.json({ success: true, txid: response });
    } else {
        logger.error('##### POST on reviewProduct - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Add product
app.post('/addProduct', awaitHandler(async (req, res) => {
    logger.info('================ POST addProduct');
    from = req.body.from;
    productname = req.body.productname;
    price = req.body.price;
    imagehash = req.body.imagehash;
    passphrase = req.body.passphrase;

    var response = "";
    response = await review.addProduct(from, productname, price, imagehash, passphrase);
    
    if (response != "") {
        res.json({ success: true, txid: response });
    } else {
        logger.error('##### POST on addProduct - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get transaction details
app.get('/transactionDetails/:txid', awaitHandler(async (req, res) => {
    logger.info('================ GET transactionDetails');
    
    const txid = req.params.txid;
    let response = await review.getTransactionDetails(txid);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### POST on transactionDetails - Failed ');
        res.json({ success: false, message: response });
    }
}));
// lock account
app.post('/lockAccount', awaitHandler(async (req, res) => {
    logger.info('================ POST lockAccount');
    
    user = req.body.user;
    let response = await account.lockAccount(user);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### POST on lockAccount - Failed ');
        res.json({ success: false, message: response });
    }
}));
// unlock account
app.post('/unlockAccount', awaitHandler(async (req, res) => {
    logger.info('================ POST unlockAccount');
    
    var user = req.body.user;
    var passphrase = req.body.passphrase; 
    let response = await account.unlockAccount(user, passphrase);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### POST on unlockAccount - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get product average rating
app.get('/getProductAvgRating/:productid', awaitHandler(async (req, res) => {
    logger.info('================ GET getProductAvgRating');
    
    const productid = req.params.productid;
    let response = await product.getProductAvgRating(productid);
    if (response && typeof response !== 'string') {
        res.json({productname : response[0], avgRating: parseInt(response[1])/10});
    } else {
        logger.error('##### GET on getProductAvgRating - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get total number of products in the review system
app.get('/getTotalProducts', awaitHandler(async (req, res) => {
    logger.info('================ GET getTotalProducts');
    
    let response = await product.getTotalProducts();
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getTotalProducts - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get product details for productid
app.get('/getProductDetails/:productid', awaitHandler(async (req, res) => {
    logger.info('================ GET getProductDetails');
    
    const productid = req.params.productid;
    let response = await product.getProductDetails(productid);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getProductDetails - Failed ');
        res.json({ success: false, message: response });
    }
}));


// Get all product details
app.get('/getAllProductDetailes', awaitHandler(async (req, res) => {
    logger.info('================ GET getAllProductDetailes');
    
    let response = await product.getAllProductDetailes();
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getAllProductDetailes - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get all users for productid
app.get('/getAllUsersForProduct/:productid', awaitHandler(async (req, res) => {
    logger.info('================ GET getAllUsersForProduct');
    
    const productid = req.params.productid;
    let response = await product.getAllUsersForProduct(productid);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getAllUsersForProduct - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get user comments for particular user for productid
app.get('/getUserComments/:productid/:user', awaitHandler(async (req, res) => {
    logger.info('================ GET getUserComments');
    
    const productid = req.params.productid;
    const user = req.params.user;
    let response = await product.getUserComments(productid, user);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getUserComments - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get user reviewed details for particular user for productid
app.get('/getReviewedDetails/:productid/:user', awaitHandler(async (req, res) => {
    logger.info('================ GET getReviewedDetails');
    
    const productid = req.params.productid;
    const user = req.params.user;
    let response = await product.getReviewedDetails(productid, user);
    if (response && typeof response !== 'string') {
        res.json({response});
    } else {
        logger.error('##### GET on getReviewedDetails - Failed ');
        res.json({ success: false, message: response });
    }
}));

function onlyUniqueUsers(value, index, self) {
    return self.indexOf(value) === index;
  }

// Get user reviewed details for particular user for productid
app.get('/getAllReviewedDetails/:productid', awaitHandler(async (req, res) => {
    logger.info('================ GET getAllReviewedDetails');
    
    const productid = req.params.productid;
    var allReviews = [];

    var allusers = await product.getAllUsersForProduct(productid);
    var uniqueUsers = allusers.filter(onlyUniqueUsers);

    for (var i = 0; i < uniqueUsers.length; i++) {
        let response = await product.getReviewedDetails(productid, uniqueUsers[i]);
        if (response) {
            allReviews.push(response);
        } 
    }
    
    if (allReviews && typeof allReviews !== 'string') {
        res.json(allReviews);
    } else {
        logger.error('##### GET on getAllReviewedDetails - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get user rating for particular user for productid
app.get('/getUserRating/:productid/:user', awaitHandler(async (req, res) => {
    logger.info('================ GET getUserRating');
    
    const productid = req.params.productid;
    const user = req.params.user;
    let response = await product.getUserRating(productid, user);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getUserRating - Failed ');
        res.json({ success: false, message: response });
    }
}));


// Get user rdate of review for productid
app.get('/getUserDateOfReview/:productid/:user', awaitHandler(async (req, res) => {
    logger.info('================ GET getUserDateOfReview');
    
    const productid = req.params.productid;
    const user = req.params.user;
    let response = await product.getUserDateOfReview(productid, user);
    if (response && typeof response !== 'string') {
        res.json(response);
    } else {
        logger.error('##### GET on getUserDateOfReview - Failed ');
        res.json({ success: false, message: response });
    }
}));
/************************************************************************************
 * Error handler
 ************************************************************************************/
app.use(function(error, req, res, next) {
    res.status(500).json({ error: error.toString() });
});
