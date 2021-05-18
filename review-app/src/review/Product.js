import React from 'react';
import './App.css';
import ReviewForm from './ReviewModal';


class ProductForm extends React.Component 
{
    constructor() {
        super();
    }
    
    HandleOnClick(prod) {
       // alert(prod.productid)
        return (<div><ReviewForm/></div>)
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
                    () => {
                        this.HandleOnClick(prod)
                    }
                    // this.,
                    // event => {
                    //     this.props.setData( prod )
                    //    // alert(prod.productid)
                    //     <ReviewForm/>
                    // }
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