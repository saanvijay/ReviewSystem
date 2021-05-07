const Web3API = require('web3');
var blockchainURL = 'http://localhost:8545';
const createAccount = async function(passphrase) {
    const web3 = new Web3API(new Web3API.providers.HttpProvider(blockchainURL));
    const result = await web3.eth.personal.newAccount(passphrase);
    var response = {
        walletAddress: result,
    };
    return response;
};
const listAllAccounts = async function() {
    const web3 = new Web3API(new Web3API.providers.HttpProvider(blockchainURL));
    const result = await web3.eth.personal.getAccounts();
    var response = {
        allAccounts: result,
    };
    return response;
};
const lockAccount = async function(user) {
    const web3 = new Web3API(new Web3API.providers.HttpProvider(blockchainURL));
    const result = await web3.eth.personal.lockAccount(user);
    var response = {
        AccountLocked: result,
    };
    
    return response;
};
const unlockAccount = async function(user,passphrase) {
    const web3 = new Web3API(new Web3API.providers.HttpProvider(blockchainURL));
    const result = await web3.eth.personal.unlockAccount(user,passphrase,0);
    var response = {
        AccountunLocked: result,
    };
    
    return response;
};
exports.createAccount = createAccount;
exports.lockAccount = lockAccount;
exports.unlockAccount = unlockAccount;
exports.listAllAccounts = listAllAccounts;