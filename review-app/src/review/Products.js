import React from 'react';
import './App.css';


class ProductsForm extends React.Component 
{
    constructor() {
        super();
        this.state = {
            User:"",
            Pname: "",
            Price:"",
            ImageHash:"",
            Passphrase:""

        }
    }
    infoChange = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }
    infoSubmit = event => {
        event.preventDefault();
        let data = {
            from: this.state.User,
            productname: this.state.Pname,
            price: this.state.Price,
            imagehash:this.state.ImageHash,
            passphrase:this.state.Passphrase
        }
        this.props.productData(data);
    }

    componentWillReceiveProps(props) {
        console.log(props.setForm);
    }

    render() {
        return(
                                        
            <form onSubmit = {this.infoSubmit} autoComplete="off">
            <b>Add New Product</b>
            <div className="form-group">
                <label>User</label>
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
                <label>Price:</label>
                <input type="number" class="form-control" placeholder="Enter Price" 
                onChange = {this.infoChange}
                name = "Price"
                value = {this.state.Price}
                />
            </div>
            <div className="form-group">
                <label>ImageHash:</label>
                <input type="text" class="form-control" placeholder="Enter Imagehash" 
                onChange = {this.infoChange}
                name = "ImageHash"
                value = {this.state.ImageHash}
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