import React, { useEffect, useState } from 'react';
import './App.css';
import Modal from 'react-modal';


export default function ReviewDialog(reviewProps) {
    const [isOpen, setIsOpen] = useState(false);
  
    function toggleModal() {
      setIsOpen(!isOpen);
     }
  
    return (
      <div className="App">
        <button className = "btn btn-primary" onClick={toggleModal}>Review Now</button>
  
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          contentLabel="Review Product"
        >
          <div>
            <div className="form-group">
                <label>Wallet Address:</label>
                <input type="text" class="form-control" placeholder="Enter wallet address" />
            </div>
            <div className="form-group">
                <label>Passphrase:</label>
                <input type="password" class="form-control" placeholder="Enter passphrase" />
            </div>
            <div className="form-group">
                <label>ProductID:</label>
                <input type="number" class="form-control" placeholder="Enter ProductID" />
            </div>
            <div className="form-group">
                <label>Rating:</label>
                <input type="number" class="form-control" placeholder="Enter Rating" />
            </div>
            <div className="form-group">
                <label>Review Comments:</label>
                <input type="text" class="form-control" placeholder="Enter Review Comments" />
            </div>
          </div>
          <button onClick={toggleModal}>Submit Review</button>
        </Modal>
      </div>
    );
  }

