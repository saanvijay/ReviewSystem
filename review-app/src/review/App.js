import React from 'react';
import ProductsForm from './Products';
import ProductForm from './Product';
import ReviewDialog from './ReviewModal';
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
        this.CreateWallet = this.CreateWallet.bind(this);
    }

    addProduct = productData => {
        axios.post("http://localhost:8000/product/add", productData, {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
        }).then( res => {
            console.log(res.data.txid);
            toast.success(<div>Transaction Successful {res.data.txid}</div>);
            this.getAllProducts();
            this.setState({
                lastTxId: res.data.txid
            })
        })
    }

    allwallets = () => {
        axios.get("http://localhost:8000/account/listAll", {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
        }).then( res => {
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
        axios.get("http://localhost:8000/product/getAllDetailes", {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
        }).then( res => {
          //  console.log(res);
            this.setState({
                productData:res.data
            })
        });
        this.allwallets();
    }

    // headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
    CreateWallet() {
        axios.post("http://localhost:8000/account/create",{passphrase:this.refs.pass.value}, {headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}}).then( res => {
            toast.success(<div>Wallet Created Successfully {res.data.walletAddress}</div>);
            //, "Wallet Address : ", res.data.walletAddress);
            this.allwallets();

    })
    }
    viewLastTransaction = txid =>  {
         axios.get("http://localhost:8000/review/transactionDetails/" + this.state.lastTxId, {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
         }).then( res => {
            //  alert(
            //      "Transaction Details" + 
            //      "\nblockhash: " + res.data.blockHash +
            //      "\nblockNumber: " + res.data.blockNumber +
            //      "\ncumulativeGasUsed: " + res.data.cumulativeGasUsed +
            //      "\nfrom: " + res.data.from +
            //      "\ngasUsed: " + res.data.gasUsed +
            //      "\nstatus: " + res.data.status +
            //      "\nto: " + res.data.to +
            //      "\ntransactionHash: " + res.data.transactionHash +
            //      "\ntransactionIndex: " + res.data.transactionIndex);
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
                    <ProtectedRouter exact path = "/home" component = {(props) => (<ProductForm getProductData = {this.state.productData} show={true} setData = {this.reviewProduct}/>)}/>
                </Switch>
                <ToastContainer />
            </div>
        )
    }
}

export default App;