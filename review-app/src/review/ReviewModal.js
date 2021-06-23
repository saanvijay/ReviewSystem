import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import detectEthereumProvider from '@metamask/detect-provider';
import  Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const ethers = require("ethers");
//const web3 = new Web3API(new Web3API.providers.HttpProvider(rpcURL));


class ReviewDialog extends React.Component {
  async componentWillMount() {
   if (typeof window.web3 !== 'undefined') {
      this.setState({isMetamaskInstalled : true})
    //  await this.loadWeb3Interface();
   }
  }
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      rating: "",
      isMetamaskInstalled: false,
      currentAddress: null
    }
    this.reviewProductNow = this.reviewProductNow.bind(this);
  }

  infoChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }
  toggleModal = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      })
    } else {
      this.setState({
        isOpen: true
      })
    }

  }
  reload() {
    window.location.reload();
  }

  

  async loadWeb3Interface() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      Window.alert('This browser does not support Ethereum');
    }
  }

  async reviewProductNow(props) {

    // metamask 
    //const provider = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    if (provider) {
       if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
    
      // Legacy providers may only have ethereum.sendAsync
      // const chainId = await provider.request({
      //     method: 'eth_chainId'
      // })
      
      const address = await window.ethereum.enable(); 
      
      
      const CONTRACTADDRESS='0xdc9229e81cd9f720cd6d610144b1a762e1714be1';
      const ABI=JSON.parse('[ { "constant": false, "inputs": [ { "name": "pname", "type": "string" }, { "name": "price", "type": "uint256" }, { "name": "imagehash", "type": "string" } ], "name": "addProduct", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "productId", "type": "uint256" }, { "name": "urating", "type": "uint256" }, { "name": "ucomments", "type": "string" }, { "name": "reviewDate", "type": "uint256" } ], "name": "reviewProduct", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "pid", "type": "uint256" }, { "indexed": false, "name": "pname", "type": "string" } ], "name": "addProductEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "pid", "type": "uint256" }, { "indexed": false, "name": "avgRating", "type": "uint256" } ], "name": "reviewProductEvent", "type": "event" }, { "constant": true, "inputs": [], "name": "getAllProductPids", "outputs": [ { "name": "", "type": "uint256[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" } ], "name": "getAllUsersForProduct", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" } ], "name": "getCurrentUserComments", "outputs": [ { "name": "ucomments", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" } ], "name": "getCurrentUserRating", "outputs": [ { "name": "urating", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" } ], "name": "getProduct", "outputs": [ { "components": [ { "name": "productName", "type": "string" }, { "name": "productPrice", "type": "uint256" }, { "name": "productHash", "type": "string" }, { "name": "avgRating", "type": "uint256" }, { "name": "totalReviewed", "type": "uint256" }, { "name": "users", "type": "address[]" } ], "name": "", "type": "tuple" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" } ], "name": "getProductAvgRating", "outputs": [ { "name": "pname", "type": "string" }, { "name": "avgRating", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalProducts", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" }, { "name": "user", "type": "address" } ], "name": "getUserComments", "outputs": [ { "name": "ucomments", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" }, { "name": "user", "type": "address" } ], "name": "getUserDateOfReview", "outputs": [ { "name": "reviewDate", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "pid", "type": "uint256" }, { "name": "user", "type": "address" } ], "name": "getUserRating", "outputs": [ { "name": "urating", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "ProductIds", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TotalProducts", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]');
      
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethersProvider.getSigner(0);
      this.setState({currentAddress: signer})
      
      
      const reviewContract = new ethers.Contract(CONTRACTADDRESS, ABI, signer);
      let date = (new Date()).getTime();
      let currentTime = parseInt(date / 1000);
      const response = await reviewContract.reviewProduct(this.props.productid, this.state.rating, this.refs.comments.value, currentTime);
      if (response) {
        this.setState({ isOpen: false });
        this.reload();
      }
    } else {  
    // if the provider is not detected, detectEthereumProvider resolves to null
    alert('You must install Metamask into your browser: https://metamask.io/download.html"');
    }
   
    /*axios.post("http://localhost:8000/review/reviewnow", {
      from: Web3.utils.toChecksumAddress(this.state.currentAddress),//this.refs.wallet.value,
      productid: this.props.productid,
      rating: this.state.rating,
      comments: this.refs.comments.value,
      passphrase: this.refs.pass.value}, {
        headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
    }).then( res => {
      alert("ProductReviewed Successfully" + res.data.txid);
      this.setState({ isOpen: false });
      this.reload();
    }

    );*/
  }


  render() {
    return (

      <div className="reviewnow">
        <button className="btn btn-primary" onClick={this.toggleModal}>Review Now</button>

        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.toggleModal}
          contentLabel="Review Product"
        >
          <div>
            <div className="form-group">
              <h1>Review Product</h1>
              <label>ProductID:</label>
              <input ref="pid" type="text" class="form-control" value={this.props.productid} placeholder="Enter ProductID" />
            </div>
            <div className="form-group">
              <label>Rating:</label>
              <input type="number" class="form-control" name="rating" onChange={this.infoChange} value={this.state.rating} placeholder="Enter Rating" />
            </div>
            <div className="form-group">
              <label>Review Comments:</label>
              <input ref="comments" type="text" class="form-control" placeholder="Enter Review Comments" />
            </div>
          </div>
          <p />
          <button className="btn btn-primary" onClick={this.reviewProductNow}>Submit Review</button>
          &nbsp;&nbsp;&nbsp;
          <button className="btn btn-primary" onClick={this.toggleModal}>Cancel Review</button>
        </Modal>
        <ToastContainer />
      </div>

    );
  }
}
export default ReviewDialog;

