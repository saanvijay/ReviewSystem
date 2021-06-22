import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import detectEthereumProvider from '@metamask/detect-provider';
import  Web3 from 'web3';
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
    const provider = await detectEthereumProvider()
    
    if (provider) {
    
       alert('Ethereum successfully detected!')
    
       if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
    
      // Legacy providers may only have ethereum.sendAsync
      const chainId = await provider.request({
          method: 'eth_chainId'
      })
      
      const address = await window.ethereum.enable(); 
      
      this.setState({currentAddress: address[0]})
      alert("address 1" +this.state.currentAddress)
      
      alert(parseInt(chainId))
     
    } else {
    
    // if the provider is not detected, detectEthereumProvider resolves to null
    alert('You must install Metamask into your browser: https://metamask.io/download.html"');
    }
    alert("address 2" +this.state.currentAddress)
    axios.post("http://localhost:8000/review/reviewnow", {
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

    );
  }

  // reviewProductNow(props) {
  //    this.metamaskInteg();

  // }

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
            <div className="form-group">
              <label>Wallet Address:</label>
              <input ref="wallet" type="text" class="form-control" value={this.state.currentAddress} placeholder="Enter wallet address" />
            </div>
            <div className="form-group">
              <label>Passphrase:</label>
              <input ref="pass" type="password" class="form-control" placeholder="Enter passphrase" />
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

