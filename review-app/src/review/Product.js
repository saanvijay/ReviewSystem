import React from 'react';
import './App.css';


class ProductForm extends React.Component 
{
    constructor() {
        super();
    }
    render() {
        return(
                                        
            <table className="table table-striped">
    <thead>
      <tr>
        <th>ProductID</th>
        <th>ProductName</th>
        <th>Price(Rs.)</th>
        <th>ImageHash</th>
        <th>AvgRating</th>
        <th>TotalReviewed</th>
      </tr>
    </thead>
    <tbody>
    {
        this.props.getProductData.length > 0 ?
        (
            this.props.getProductData.map( prod =>
            <tr key = {prod.productId}>
                <td> {prod.productid}</td>
                <td> {prod.productName}</td>
                <td> {prod.Price} </td>
                <td> {prod.ImageHash} </td>
                <td> {prod.avgRating} </td>
                <td> {prod.totalReviewed} </td>
                <td> <button className = "btn btn-primary" 
                onClick = {
                    event => {
                        this.props.setData( prod )
                    }
                }
                > Review Product </button></td>
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