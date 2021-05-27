import React from 'react';
import './App.css';
import axios from 'axios';

class WalletForm extends React.Component {
    constructor() {
        super();
        this.state = {
            wallets:[]
        }
        this.CreateWallet = this.CreateWallet.bind(this);
    }

    componentDidMount() {
        this.allwallets();
       
    }
    CreateWallet = event => {
        event.preventDefault();
        axios.post("http://localhost:8000/account/create",{passphrase:this.refs.pass.value}, {headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}}).then( res => {
            alert("Wallet Created Successfully" + res.data.walletAddress);
            //, "Wallet Address : ", res.data.walletAddress);
            this.allwallets();

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
    infoCloseWallets = event => {
        event.preventDefault();
        window.location.href = 'home';
    }

    render() {
        return(
            <div> 
                <label style={{color: 'brown', fontWeight: 'bold' }}>Create Wallet</label>
                      <div className="form-group">
                          Passphrase &nbsp;&nbsp;
                            <input ref="pass" type="password" class="form-control" placeholder="Enter Passphrase"/>
                            <button onClick={this.CreateWallet} class="btn btn-primary">Create Wallet</button>&nbsp;&nbsp;
                            <button onClick={this.infoCloseWallets} class="btn btn-primary">Close</button>
                     </div>
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
        );
    }
}

export default WalletForm;