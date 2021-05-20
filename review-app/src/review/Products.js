import React from 'react';
import './App.css';
const IPFS = require('ipfs-api');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});


class ProductsForm extends React.Component 
{
    constructor() {
        super();
        this.state = {
            User:"",
            Pname: "",
            Price:"",
            ImageHash:"",
            Passphrase:"",
            ImageBuffer:""

        }
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
                this.props.productData(data);
                console.log("ImageHash is", this.state.ImageHash);
            } else {
                console.log(err);
            }
        })
    }

    componentWillReceiveProps(props) {
        console.log(props.setForm);
    }

    render() {
        return(
                                        
            <form onSubmit = {this.infoSubmit} autoComplete="off">
            <label style={{color: 'brown', fontWeight: 'bold' }}>Add New Product</label>
            <div className="form-group">
                <label>User Wallet Address</label>
                <input type="text" class="form-control" placeholder="Enter Wallet Address" 
                onChange = {this.infoChange}
                name = "User"
                value = {this.state.User}
                />
            </div>
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
            <div className="form-group">
                <label>Passphrase:</label>
                <input type="password" class="form-control" placeholder="Enter Passphrase" 
                onChange = {this.infoChange}
                name = "Passphrase"
                value = {this.state.Passphrase}
                />
            </div>
            <button type="submit" class="btn btn-primary">Add Product</button>
            </form>
        )
    }
}

export default ProductsForm;