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
        <th>TotalReviewd</th>
      </tr>
    </thead>
    <tbody>
    {
        this.props.getProductData.length > 0 ?
        (
            this.props.getProductData.map( prod =>
            <tr key = {prod.productId}>
                <td> {prod.[0]}</td>
                <td> {prod.[1]}</td>
                <td> {prod.[2]} </td>
                <td> {prod.[3]} </td>
                <td> {prod.[4]} </td>
                <td> {prod.[5]} </td>
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