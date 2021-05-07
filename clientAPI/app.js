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
var logger = log4js.getLogger('RMSAPI');
const WebSocketServer = require('ws');
var express = require('express');
var bodyParser = require('body-parser');
var account = require('./account.js');
var balance = require('./product.js');
var transfer = require('./review.js');
var http = require('http');
var util = require('util');
const fs = require('fs');
var app = express();
var cors = require('cors');
var host = 'localhost';
var port = 3000;
var blockchainPort = 8545;
let constraint = 0;
let user = '';
let validity = 0;
let from = '';
let to = '';
let coins = 0;
let passphrase ='';

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
       logger.info('##### POST on wallet - wallet address %s', response);
        res.json(response);
    } else {
        logger.error('##### POST on wallet - Failed ');
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
        logger.error('##### POST on wallet - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Review product
app.post('/reviewProduct', awaitHandler(async (req, res) => {
    logger.info('================ POST reviewProduct');
    from = req.body.from;
    to = req.body.productid;
    rating = req.body.rating;
    comments = req.body.comments;
    passphrase = req.body.passphrase;

    var response = "";
    response = await transfer.reviewProduct(from, productid, rating, comments, passphrase);
    
    if (response != "") {
        res.json({ success: true, txid: response });
    } else {
        logger.error('##### POST on reviewProduct - Failed ');
        res.json({ success: false, message: response });
    }
}));

// Get transaction details
app.get('/transactionDetails/:txid', awaitHandler(async (req, res) => {
    logger.info('================ POST transactionDetails');
    
    const txid = req.params.txid;
    let response = await transfer.getTransactionDetails(txid);
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
/************************************************************************************
 * Error handler
 ************************************************************************************/
app.use(function(error, req, res, next) {
    res.status(500).json({ error: error.toString() });
});
