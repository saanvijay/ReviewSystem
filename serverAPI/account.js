'use strict';

const Web3API = require('web3');
const jwt = require('jsonwebtoken');
const express = require('express');
const accountrouter = express.Router();
accountrouter.use(express.json());

var cors = require('cors');
accountrouter.options('*', cors());
accountrouter.use(cors());

var rpcURL = process.env.RPCURL;
const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));

const common = require('./common');


var log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
    },
    categories: {
        default: { appenders: ['out'], level: 'info' },
    }
});
var logger = log4js.getLogger('REVIEWSYS:ACCOUNT');


// Create new wallet
accountrouter.post('/create', common.ValidateUser, async (req, res) => {
    logger.info('================ POST on create account');

    await common.JwtVerify(req, res);

    try {
        var passphrase = req.body.passphrase;
        var account = web3.eth.accounts.create(passphrase); 
        var pKey = account["privateKey"];
        pKey = pKey.substring(2);
        const wallet = await web3.eth.personal.importRawKey(pKey, passphrase);
        console.log({
            walletAddress: wallet,
            privateKey: pKey
        });
        res.json({ success: true, walletAddress: wallet, privateKey:  pKey});
    }
    catch (error) {
        logger.error('##### Create account/wallet Failed - %s', error.toString());
        res.json({ success: false, message: error.toString() });
    }
});


// List all accounts
accountrouter.get('/listAll', common.ValidateUser, async (req, res) => {
    logger.info('================ GET on list all accounts');
    await common.JwtVerify(req, res);
    try {
        const response = await web3.eth.personal.getAccounts();
        //const response = await web3.eth.getAccounts();
        res.json({ success: true, accounts: { allAccounts: response } });
    }
    catch (error) {
        logger.error('##### listAll - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

// lock account
accountrouter.post('/lock', common.ValidateUser, async (req, res) => {
    logger.info('================ POST lock');
    await common.JwtVerify(req, res);
    try {
        user = req.body.user;
        const result = await web3.eth.personal.lockAccount(user);
        res.json({ success: true, AccountLocked: result });
    }
    catch (error) {
        logger.error('##### POST on lockAccount - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

// unlock account
accountrouter.post('/unlock', common.ValidateUser, async (req, res) => {
    logger.info('================ POST unlock');
    await common.JwtVerify(req, res);
    try {
        var user = req.body.user;
        var passphrase = req.body.passphrase;
        const result = await web3.eth.personal.unlockAccount(user, passphrase, 0);
        res.json({ success: true, AccountunLocked: result });
    }
    catch (error) {
        logger.error('##### POST on unlockAccount - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

module.exports = accountrouter;
