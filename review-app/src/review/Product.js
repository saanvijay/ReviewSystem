import React, { useEffect, useState }from 'react';
import './App.css';
import Modal from 'react-modal';
import ReviewDialog from './ReviewModal';
import AllReviewsDialog from './AllReviews';
import axios from 'axios';
import AddProductForm from './Products';
import { Link} from "react-router-dom";

Modal.setAppElement("#root");

class ProductForm extends React.Component 
{
    constructor(props) {
        super();   
    }
     
    HandleOnClick(prod) {
        alert(prod.productid) 
    }
    // clear jwt token which is stotred in localstorage and redirect page to login
    logoutnow = (props) => {
        localStorage.clear();
       // this.props.history.push('/login');
    }
    addproduct = (props) => {
         const { history } = this.props;
        history.push("/addproduct");
        
    }
    viewExplorer() {
        window.open('http://localhost:9000', '_blank');
    }
    
    render() {
        return(
            <div className = "container">
                    <div className = "row"> 
                        <div className = "col-1" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh', background: 'green'}}>
                            <div className="nav-right nav-menu">
                            <a> <Link to="/wallets"> Wallets </Link> </a>
                                <p/>
                                <a> <Link to="/addproduct"> Add Product </Link> </a> 
                                <p/>
                                <a href='http://localhost:9000' target="_blank">  Explorer </a> 
                                <p/>
                                <a  href="#" onClick={this.logoutnow}>Logout</a>
                                <p/>
                            </div>
                        </div>
            
                <div className = "col-3">
                    <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ProductID</th>
                        <th>ProductName</th>
                        <th>Price(US$.)</th>
                        <th>IPFS ImageHash</th>
                        <th>AvgRating</th>
                        <th>TotalReviewed</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.getProductData.length > 0 ?
                        (
                            this.props.getProductData.map( prod =>
                            <tr key = {prod.productid}>
                                <td> {prod.productid}</td>
                                <td> {prod.productName}</td>
                                <td> {prod.Price} </td>
                                <td> {prod.ImageHash} <img width="40" height="40" src={`https://ipfs.io/ipfs/${prod.ImageHash}`}/></td>
                                <td> {prod.avgRating} </td>
                                <td> {prod.totalReviewed} </td>
                                <td><ReviewDialog {...prod}/> </td>
                                <td><AllReviewsDialog {...prod}/> </td>
                            </tr>
                            )
                        ) : (
                            <tr>
                                <td> No Product </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        )
    }
}

export default ProductForm;