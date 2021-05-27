import React from 'react';
import AddProductForm from './Products';
import ProductForm from './Product';
import WalletForm from './wallets';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from '../auth/login';
import Register from '../auth/register';

import {Switch, Route} from 'react-router-dom';
import ProtectedRouter from '../auth/protected';




class App extends React.Component 
{
    constructor() {
        super();
        this.state = {
            productData:[],
            reviewData:[],
            wallets:[],
            lastTxId:""
        }
        
    }

    reviewProduct = productData => {
        this.setState(
            {reviewData:productData}
        )
    }
    componentDidMount() {
        this.getAllProducts();
       
    }

    getAllProducts() {
        axios.get("http://localhost:8000/product/getAllDetailes", {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
        }).then( res => {
          //  console.log(res);
            this.setState({
                productData:res.data
            })
        });
      //  this.allwallets();
    }

    viewLastTransaction = txid =>  {
         axios.get("http://localhost:8000/review/transactionDetails/" + this.state.lastTxId, {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
         }).then( res => {

        })
             window.open('http://localhost:9000/#/transaction/' + this.state.lastTxId, '_blank');
           
    }
    viewExplorer() {
        window.open('http://localhost:9000', '_blank');
    }

    render() {
        return(
            <div>
                <Switch>
                    <Route exact path = "/" component = {Login}/>
                    <Route exact path = "/login" component = {Login}/>
                    <Route exact path = "/register" component = {Register}/>
                    <Route exact path = "/wallets" component = {WalletForm}/>
                    <Route exact path = "/addproduct" component = {AddProductForm}/>
                    <ProtectedRouter exact path = "/home" component = {(props) => (<ProductForm history={this.props.history} getProductData = {this.state.productData} show={true} setData = {this.reviewProduct}/>)}/>
                </Switch>
                <ToastContainer />
            </div>
        )
    }
}

export default App;