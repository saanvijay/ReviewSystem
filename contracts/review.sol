pragma solidity ^0.6.0;

contract review {
    
    struct Product {
        string productName;
        uint productId;
        uint avgRating;
        uint totalReviewed;
        mapping(address => bool) hasReviewed;
        mapping(address => uint) rating; 
        mapping(address => string) comments; 
    }
    
    mapping(uint => Product) Products;
    uint public TotalProducts;
    
    event addProductEvent( uint pid, string pname );
    event reviewProductEvent( uint pid, uint avgRating );
    
 
    constructor() public {
        TotalProducts = 0;
    }
    
    function addProduct(uint pid, string memory pname) public {
        require(pid > 0, "Product ID required !");
        require(keccak256(bytes(pname)) != keccak256(""), "Product Name required !"); 
        
        Product memory newProduct = Product({
            productId: pid,
            productName: pname,
            avgRating: 0,
            totalReviewed: 0
        });
        
        Products[TotalProducts++] = newProduct;
        emit addProductEvent(newProduct.productId, newProduct.productName);
        
    }
    
    function reviewProduct(uint productId, uint rating, string memory comments) public {
        require(productId > 0, "Productid required !");
        require(rating > 0 && rating <= 5, "Product rating should be in 1-5 range !");
        require(Products[productId].hasReviewed[msg.sender] == false, "Product already reviewed by user !");
        
        Product storage oldProduct = Products[productId];
        oldProduct.hasReviewed[msg.sender] = true;
        oldProduct.rating[msg.sender] = rating;
        oldProduct.comments[msg.sender] = comments;
        oldProduct.avgRating += rating * 10;
        oldProduct.totalReviewed++;
        
        emit reviewProductEvent(oldProduct.productId, oldProduct.avgRating);
    }
    
    function getProductDetails(uint pid) public view returns (string memory pname, uint avgRating) {
        require(pid > 0, "Productid required !");
        
        Product storage product = Products[pid];
        uint allAvgRating = 0;

        if(product.totalReviewed > 0)
            allAvgRating = product.avgRating / product.totalReviewed;
        
        return (product.productName, allAvgRating);
    }
    
    function getUserComments(uint pid) public view returns (string memory comments) {
         require(pid > 0, "Productid required !");
         
         Product storage product = Products[pid]; 
         
         return product.comments[msg.sender];
         
    }
    
    function getUserRating(uint pid) public view returns (uint rating) {
         require(pid > 0, "Productid required !");
         
         Product storage product = Products[pid];
         
         return product.rating[msg.sender];
         
    }
    
}
