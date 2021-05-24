'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('review');
const Web3API = require('web3');

var express = require('express');
var reviewrouter = express.Router();

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;

// Review product
reviewrouter.post('/reviewnow', async (req, res) => {
    logger.info('================ POST reviewnow');
    from = req.body.from;
    productid = req.body.productid;
    rating = req.body.rating;
    comments = req.body.comments;
    passphrase = req.body.passphrase;

    var response = "";
    const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
	const contract = new web3.eth.Contract(abi, address);
	let isValidTransaction = false;
	let date = (new Date()).getTime();
	let currentTime = parseInt(date / 1000);
	const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
	console.log(unlock);
	console.log(productid, rating, comments, currentTime);
	
	response = await contract.methods.reviewProduct(productid, rating, comments, currentTime).send({ from: from });
    if (response != "") {
        res.json({ success: true, txid: response });
    } else {
        logger.error('##### POST on reviewnow - Failed ');
        res.json({ success: false, message: response });
    }
});

// Get transaction details
reviewrouter.get('/transactionDetails/:txid', async (req, res) => {
    logger.info('================ GET transactionDetails');
    
    const txid = req.params.txid;
    const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
	const contract = new web3.eth.Contract(abi, address);
	const details = await web3.eth.getTransactionReceipt(txnHash);
    if (details && typeof details !== 'string') {
        res.json(details);
    } else {
        logger.error('##### POST on transactionDetails - Failed ');
        res.json({ success: false, message: details });
    }
});


module.exports = reviewrouter;

