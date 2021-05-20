import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';
import axios from 'axios';


class ReviewDialog extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
        isOpen:false,
        rating:""
    }
    this.reviewProductNow = this.reviewProductNow.bind(this);
   }
    
   infoChange = event => {
    const {name, value} = event.target;
    this.setState({
        [name]: value
    })
}
     toggleModal = () => {
      if(this.state.isOpen) {
        this.setState({
            isOpen: false
        })
      } else {
        this.setState({
            isOpen: true
        })
      }
      
     }

      
      reviewProductNow(props) {
         
           axios.post("http://localhost:8000/reviewProduct", {
           from:this.refs.wallet.value,
               productid:this.props.productid,
               rating:this.state.rating,
              comments:this.refs.comments.value,
              passphrase:this.refs.pass.value

             }).then( res => {
            alert("ProductReviewed Successfully"+ res.data.txid);}
             );
           this.setState({isOpen:false});
        
    }
  
    render () {
        return(
    
      <div className="reviewnow">
        <button className = "btn btn-primary" onClick={this.toggleModal}>Review Now</button>
  
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.toggleModal}
          contentLabel="Review Product"
        >
          <div>
            <div className="form-group">
                <h1>Review Product</h1>
                <label>ProductID:</label>
                <input ref="pid" type="text" class="form-control" value={this.props.productid} placeholder="Enter ProductID" />
            </div>
            <div className="form-group">
                <label>Rating:</label>
                <input  type="number" class="form-control"  name="rating" onChange={this.infoChange} value={this.state.rating} placeholder="Enter Rating" />
            </div>
            <div className="form-group">
                <label>Review Comments:</label>
                <input ref="comments" type="text" class="form-control" placeholder="Enter Review Comments" />
            </div>
            <div className="form-group">
                <label>Wallet Address:</label>
                <input ref="wallet" type="text" class="form-control" placeholder="Enter wallet address" />
            </div>
            <div className="form-group">
                <label>Passphrase:</label>
                <input ref="pass" type="password" class="form-control" placeholder="Enter passphrase" />
            </div>
          </div>
          <p/>
          <button className = "btn btn-primary" onClick={this.reviewProductNow}>Submit Review</button> 
          &nbsp;&nbsp;&nbsp; 
          <button className = "btn btn-primary" onClick={this.toggleModal}>Cancel Review</button>
        </Modal>
      </div>
     
    );
  }
}
  export default ReviewDialog;

