const Web3API = require('web3');
const express = require('express');
const accountrouter = express.Router();

var cors = require('cors');
accountrouter.options('*', cors());
accountrouter.use(cors());

var blockchainURL = process.env.RPCURL;
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
const web3 = new Web3API(new Web3API.providers.HttpProvider(blockchainURL));

// Create new wallet
accountrouter.post('/create', async (req, res) => {
    logger.info('================ POST on create account');
    try {
        var passphrase = req.body.passphrase;
        const result = await web3.eth.personal.newAccount(passphrase);
        res.json({ success: true, walletAddress: result});
    }
    catch(error) {
        logger.error('##### Create account/wallet Failed - %s', result);
        res.json({ success: false, message: error.toString()});
    }
});


// Create all accounts
accountrouter.get('/listAll', async (req, res) => {
    logger.info('================ GET on list all accounts');
    try {
        const response = await web3.eth.personal.getAccounts();
        res.json({success: true, accounts: {allAccounts: response}});
    }
    catch(error) {
        logger.error('##### listAll - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

// lock account
accountrouter.post('/lock', async (req, res) => {
    logger.info('================ POST lock');
    try {
        user = req.body.user;
        const result = await web3.eth.personal.lockAccount(user);
        res.json({ success: true, AccountLocked: result});
    }
    catch(error) {
        logger.error('##### POST on lockAccount - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

// unlock account
accountrouter.post('/unlock', async (req, res) => {
    logger.info('================ POST unlock');
    try {
        var user = req.body.user;
        var passphrase = req.body.passphrase; 
        const result = await web3.eth.personal.unlockAccount(user,passphrase,0);
        res.json({success: true, AccountunLocked: result});
    }
    catch(error) {
        logger.error('##### POST on unlockAccount - Failed ');
        res.json({ success: false, message: error.toString() });
    }
});

module.exports = accountrouter;