import React from 'react';
import './App.css';
const ethers = require("ethers");
const IPFS = require('ipfs-api');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

const contractaddress=process.env.REACT_APP_CONTRACTADDRESS;
const abi=JSON.parse(process.env.REACT_APP_ABI);
   
class AddProductForm extends React.Component 
{
    constructor() {
        super();
        this.state = {
            productData:[],
            User:"",
            Pname: "",
            Price:"",
            ImageHash:"",
            Passphrase:"",
            ImageBuffer:""

        }
    }
    async addProduct(props) {

    // metamask 
    //const provider = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    if (provider) {
       if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
      }
      
      const address = await window.ethereum.enable(); 
      
      
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethersProvider.getSigner(0);
      this.setState({currentAddress: signer})
      
      
      const reviewContract = new ethers.Contract(contractaddress, abi, signer);
      
      const response = await reviewContract.addProduct(this.state.Pname, this.state.Price, this.state.ImageHash);
      if (response) {
        this.setState({
            lastTxId: response.txid
        })
        this.props.history.push('/home');
        window.location.reload();
      }
    } else {  
    // if the provider is not detected, detectEthereumProvider resolves to null
    alert('You must install Metamask into your browser: https://metamask.io/download.html"');
    }
   
        /*
        axios.post("http://localhost:8000/product/add", {
            from: this.state.User,
            productname: this.state.Pname,
            price: this.state.Price,
            imagehash:this.state.ImageHash,
            passphrase:this.state.Passphrase
        }, {
            headers: {'auth': `${JSON.parse(localStorage.getItem('auth'))}`}
        }).then( res => {
            console.log(res.data.txid);
            alert("Transaction Successful\n" + res.data.txid);
           // this.getAllProducts();
            this.setState({
                lastTxId: res.data.txid
            })
            this.props.history.push('/home');
        })
        .catch(err => {
            alert(err);
        })*/
    }

    infoChange = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }
    infoChangeFile = event => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({
                ImageBuffer: Buffer(reader.result)
            })
        }
        console.log(this.state.ImageBuffer);
    }
    infoSubmit = event => {
        event.preventDefault();
    
         ipfs.files.add(this.state.ImageBuffer, (err, res) => {
            if(!err) {
                this.setState({
                    ImageHash: res[0].hash
                })
                let data = {
                    from: this.state.User,
                    productname: this.state.Pname,
                    price: this.state.Price,
                    imagehash:this.state.ImageHash,
                    passphrase:this.state.Passphrase
                }
                 this.addProduct(data);
               // this.state.productData(data);
                console.log("ImageHash is", this.state.ImageHash);
                //this.props.history.push('/home');
            } else {
                console.log(err);
            }
        })
    }
    infoClose = event => {
        event.preventDefault();
        window.location.href = 'home';
    }

    componentWillReceiveProps(props) {
        console.log(props.setForm);
    }

    render() {
        return(
                                        
            <form onSubmit = {this.infoSubmit} autoComplete="off">
            <label style={{color: 'brown', fontWeight: 'bold' }}>Add New Product</label>
            
            <div className="form-group">
                <label>Product Name:</label>
                <input type="text" class="form-control" placeholder="Enter Product Name" 
                onChange = {this.infoChange}
                name = "Pname"
                value = {this.state.Pname}
                />
            </div>
            <div className="form-group">
                <label>Price(US $.):</label>
                <input type="number" class="form-control" placeholder="Enter Price" 
                onChange = {this.infoChange}
                name = "Price"
                value = {this.state.Price}
                />
            </div>
            <div className="form-group">
                <label>Product Image(IPFS):</label>
                <input type="file" class="form-control"  
                onChange = {this.infoChangeFile}
                />
            </div>

            <button type="submit" class="btn btn-primary">Add Product</button>
            &nbsp;&nbsp;
            <button onClick={this.infoClose} class="btn btn-primary">Close</button>
            </form>
        )
    }
}

export default AddProductForm;