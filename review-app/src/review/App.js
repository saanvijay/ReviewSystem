import React from 'react';
import ProductsForm from './Products';
import ProductForm from './Product';
import ReviewForm from './ReviewModal';
import axios from 'axios';
import './App.css';

class App extends React.Component 
{
    constructor() {
        super();
        this.state = {
            productData:[],
            reviewData:[],
            wallets:[]
        }
        this.CreateWallet = this.CreateWallet.bind(this);
    }

    create = productData => {
        axios.post("http://localhost:8000/addProduct", productData).then( res => {
            console.log(res.data.txid);
            alert("Transaction Successful\nTxID: " + res.data.txid);
            this.getAllProducts();
        })
    }

    allwallets = () => {
        axios.get("http://localhost:8000/listAllAccounts").then( res => {
            
            this.setState({
                wallets : res.data.accounts.allAccounts
            })
            
        })
    }

    reviewProduct = productData => {
        this.setState(
            {reviewData:productData}
        )
       /* axios.post("http://localhost:8000/reviewProduct", productData).then( res => {
            this.getAllProducts();
        })*/
        
    }
    componentDidMount() {
        this.getAllProducts();
       
    }

    getAllProducts() {
        axios.get("http://localhost:8000/getAllProductDetailes").then( res => {
          //  console.log(res);
            this.setState({
                productData:res.data
            })
        });
        this.allwallets();
    }


    CreateWallet() {
        axios.post("http://localhost:8000/createAccount",{passphrase:this.refs.pass.value}).then( res => {
            alert("Wallet Created Successfully\nWallet Address : "+res.data.walletAddress);
            this.allwallets();
    })
    }
    
    render() {
        return(
            <div className = "container">
                <div className = "row"> 
                    <div className = "col-6">
                      <ProductsForm productData = {this.create} setForm = {this.state.reviewData}/>
                      <p/>
                      <b>Create Wallet</b>
                      <div>
                          Enter Passphrase
                            <input ref="pass" type="password" /><p/>
                            <button onClick={this.CreateWallet} class="btn btn-primary">Create Wallet</button>
                     </div>
                     <p/><p/><p/>
                     <div> 
                         <b>All Wallets</b>
                         <ul>
                                {
                                this.state.wallets.map(wallet => (
                                    <li>{wallet}</li>
                                 ))
                                 }
                         </ul>
                     </div>
                    </div>
                    <div className="col-6">
                      <ProductForm getProductData = {this.state.productData} setData = {this.reviewProduct}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;