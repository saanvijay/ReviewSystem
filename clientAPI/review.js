'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('review');
const Web3API = require('web3');

var express = require('express');
var reviewrouter = express.Router();

var cors = require('cors');
reviewrouter.options('*', cors());
reviewrouter.use(cors());

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;

// Review product
reviewrouter.post('/reviewnow', async (req, res) => {
    logger.info('================ POST reviewnow');
    try {
        let from = req.body.from;
        let productid = req.body.productid;
        let rating = req.body.rating;
        let comments = req.body.comments;
        let passphrase = req.body.passphrase;

        var response = "";
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        let isValidTransaction = false;
        let date = (new Date()).getTime();
        let currentTime = parseInt(date / 1000);
        const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
        
        response = await contract.methods.reviewProduct(productid, rating, comments, currentTime).send({ from: from });
        res.json({ success: true, txid: response.transactionHash });
    }
    catch(error) {
        logger.error('##### POST on reviewnow - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

// Get transaction details
reviewrouter.get('/transactionDetails/:txid', async (req, res) => {
    logger.info('================ GET transactionDetails');
    try {
        const txid = req.params.txid;
        const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
        const contract = new web3.eth.Contract(abi, address);
        const details = await web3.eth.getTransactionReceipt(txnHash);
        res.json(details);
    }
    catch(error) {
        logger.error('##### POST on transactionDetails - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});


module.exports = reviewrouter;

