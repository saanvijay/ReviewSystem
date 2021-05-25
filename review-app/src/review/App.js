import React from 'react';
import ProductsForm from './Products';
import ProductForm from './Product';
import ReviewDialog from './ReviewModal';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
        axios.post("http://localhost:8000/product/add", productData).then( res => {
            console.log(res.data.txid);
            toast.success(<div>Transaction Successful {res.data.txid}</div>);
            this.getAllProducts();
            this.setState({
                lastTxId: res.data.txid
            })
        })
    }

    allwallets = () => {
        axios.get("http://localhost:8000/account/listAll").then( res => {
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
        axios.get("http://localhost:8000/product/getAllDetailes").then( res => {
          //  console.log(res);
            this.setState({
                productData:res.data
            })
        });
        this.allwallets();
    }


    CreateWallet() {
        axios.post("http://localhost:8000/account/create",{passphrase:this.refs.pass.value}).then( res => {
            toast.success(<div>Wallet Created Successfully {res.data.walletAddress}</div>);
            //, "Wallet Address : ", res.data.walletAddress);
            this.allwallets();

    })
    }
    viewLastTransaction = txid =>  {
         axios.get("http://localhost:8000/review/transactionDetails/" + this.state.lastTxId).then( res => {
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
            <div className = "container">
                <div className = "row"> 
                    <div className = "col-6">
                        <hr style={{
                            color: 'green',
                            backgroundColor: 'green',
                            height: 5
                        }}/>
                    <label style={{color: 'brown', fontWeight: 'bold' }}>Create Wallet</label>
                      <div className="form-group">
                          Passphrase &nbsp;&nbsp;
                            <input ref="pass" type="password" class="form-control" placeholder="Enter Passphrase"/>
                            <button onClick={this.CreateWallet} class="btn btn-primary">Create Wallet</button>
                     </div>
                     <hr style={{
                            color: 'green',
                            backgroundColor: 'green',
                            height: 5
                        }}/>
                     <p/><p/>
                      <ProductsForm productData = {this.addProduct} setForm = {this.state.reviewData}/><p/>
                      <hr style={{
                            color: 'green',
                            backgroundColor: 'green',
                            height: 5
                        }}/>
                      <button onClick={this.viewLastTransaction} txid = {this.state.lastTxId} class="btn btn-primary">View Last Transaction</button>
                      &nbsp;&nbsp;&nbsp; 
                      
                    <button onClick={this.viewExplorer}  class="btn btn-primary">View All Transactions</button>
                    <hr style={{
                            color: 'green',
                            backgroundColor: 'green',
                            height: 5
                        }}/>
                      
                      <p/>
                      
                     <p/><p/><p/>
                     <div> 
                         <label style={{color: 'brown', fontWeight: 'bold' }}>All Wallets</label>
                         <ul>
                                {
                                this.state.wallets.map(wallet => (
                                    <li> {wallet}</li>
                                 ))
                                 }
                         </ul>
                     </div>
                    </div>
                    <div className="col-6">
                      <ProductForm getProductData = {this.state.productData} show={true} setData = {this.reviewProduct}/>
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    }
}

export default App;