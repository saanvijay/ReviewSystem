import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';
import axios from 'axios';


class AllReviewsDialog extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
        isOpen:false,
        rating:"",
        allReviewData:[]
    }
    this.viewAllReviews = this.viewAllReviews.bind(this);
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

     componentWillMount() {
        this.viewAllReviews();
       
    } 
     viewAllReviews(props) {
           axios.get("http://localhost:8000/getAllReviewedDetails/" + this.props.productid).then( res => {
               this.setState({
                allReviewData: res.data
               })
            });
    }
  
    render () {
        return(
    
      <div className="allreview">
        <button className = "btn btn-primary" onClick={this.toggleModal}>All Reviews</button>
  
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.toggleModal}
          contentLabel="View All Reviews"
        >
          
           <div className="form-group">
                <h1> All Users Review Details </h1>
                <hr style={{
                            color: 'green',
                            backgroundColor: 'green',
                            height: 5
                        }}/>
                <label><h3>ProductID : </h3></label>
                <label><h4>{this.props.productid}</h4></label> <p/>
                <label><h3>ProductName : </h3></label>
                <label><h4>{this.props.productName}</h4></label> <p/>
                <label><h3>Average Rating : </h3></label>
                <label><h4>{this.props.avgRating}</h4></label> <p/>
                <img  width="200" height="200" src={`https://ipfs.io/ipfs/${this.props.ImageHash}`}/>
            </div>
          <table className="table table-striped">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Comments</th>
                    <th>Rating</th>
                    <th>DateOfReview</th>
                </tr>
            </thead>
            <tbody>
            {
                
                    this.state.allReviewData.map( prod =>
                    <tr key = {prod.productid}>
                        <td> {prod.user}</td>
                        <td> {prod.comments} </td>
                        <td> {prod.rating} </td>
                        <td> {prod.dateOfProductReview} </td>
                    </tr>
                    )
                
            }
        </tbody>
         </table>
          <p/> 
          <button className = "btn btn-primary" onClick={this.toggleModal}>Close All Reviews</button>
        </Modal>
      </div>
    );
  }
}
export default AllReviewsDialog;

