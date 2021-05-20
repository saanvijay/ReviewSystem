import React, { useEffect, useState }from 'react';
import './App.css';
//import ReviewDialog from './ReviewModal';
import Modal from 'react-modal';
import ReviewDialog from './ReviewModal';
import AllReviewsDialog from './AllReviews';

Modal.setAppElement("#root");



class ProductForm extends React.Component 
{
    constructor() {
        super();   
    }
     
    HandleOnClick(prod) {
        alert(prod.productid) 
    }

    render() {
        return(
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
        )
    }
}

export default ProductForm;