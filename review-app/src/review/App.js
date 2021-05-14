import React from 'react';
import ProductsForm from './Products';
import ProductForm from './Product';
import axios from 'axios';
import './App.css';

class App extends React.Component 
{
    constructor() {
        super();
        this.state = {
            productData:[],
            reviewData:[]
        }
    }

    create = productData => {
        axios.post("http://localhost:8000/addProduct", productData).then( res => {
            console.log(res.data.txid);
            this.getAllProducts();
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
        let i=0;
        axios.get("http://localhost:8000/getAllProductDetailes").then( res => {
            console.log(res);
            this.setState({
                productData:res.data
            })
        });
    }
    render() {
        return(
            <div className = "container">
                <div className = "row"> 
                    <div className = "col-6">
                      <ProductsForm productData = {this.create} setForm = {this.state.reviewData}/>
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