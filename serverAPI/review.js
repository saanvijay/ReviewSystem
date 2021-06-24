'use strict';

var log4js = require('log4js');
var jwt = require('jsonwebtoken');
var logger = log4js.getLogger('REVIEWSYS:REVIEW');
const Web3API = require('web3');
const ethers = require('ethers');

var express = require('express');
var reviewrouter = express.Router();

var cors = require('cors');
reviewrouter.options('*', cors());
reviewrouter.use(cors());

var rpcURL = process.env.RPCURL;
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACTADDRESS;
const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));
const contract = new web3.eth.Contract(abi, address);
const ethersProvider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = ethersProvider.getSigner(0);
const reviewContract = new ethers.Contract(address, abi, signer);



const common = require('./common');

// Review product
reviewrouter.post('/reviewnow', common.ValidateUser, async (req, res) => {
    logger.info('================ POST reviewnow');
    await common.JwtVerify(req, res);
    try {
        
        let from = req.body.from;
        let productid = req.body.productid;
        let rating = req.body.rating;
        let comments = req.body.comments;
        let passphrase = req.body.passphrase;

        var response = "";
        
        let date = (new Date()).getTime();
        let currentTime = parseInt(date / 1000);
        // web3 interface
        // const unlock = await web3.eth.personal.unlockAccount(from, passphrase, 15000);
        // response = await contract.methods.reviewProduct(productid, rating, comments, currentTime).send({ from: from });
       
       // Metamask  
       response = await reviewContract.reviewProduct(productid, rating, comments, currentTime);
        res.json({ success: true, txid: response.transactionHash });
    }
    catch(error) {
        logger.error('##### POST on reviewnow - Failed ', error);
        res.json({ success: false, message: error.toString() });
    }
});

// Get transaction details
reviewrouter.get('/transactionDetails/:txid', common.ValidateUser, async (req, res) => {
    logger.info('================ GET transactionDetails');
    await common.JwtVerify(req, res);
    try {
        const txid = req.params.txid;
        const details = await web3.eth.getTransactionReceipt(txid);
        res.json(details);
    }
    catch(error) {
        logger.error('##### GET on transactionDetails - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});



module.exports = reviewrouter;

