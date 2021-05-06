pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract ReviewSystem {
    
    struct Product {
        string productName;
        uint productPrice;
        string productHash;
        uint avgRating;
        uint totalReviewed;
    }
    
    Product[] public Products;
    address[] public Users;
    uint[]    public ProductIds;
    
    Product newProduct;
    mapping (uint => Product)   productDetails;
    mapping(uint => mapping (address => uint)) rating;
    mapping(uint => mapping (address => string)) comments;
    mapping(uint => mapping(address => bool)) IsProductReviewedByUser;
    
    uint public TotalProducts;
    
    event addProductEvent( uint pid, string pname );
    event reviewProductEvent( uint pid, uint avgRating );
    
    constructor() public {
        TotalProducts = 0;
    }
    
    function addProduct(string memory pname, uint price) public {
        require(keccak256(bytes(pname)) != keccak256(""), "Product Name required !");
        
        newProduct.productName = pname;
        newProduct.productPrice = price;
        newProduct.productHash = "0x00ff00ff";
        newProduct.avgRating = 0;
        newProduct.totalReviewed = 0;
        
        TotalProducts++;
        productDetails[TotalProducts + 111111] = newProduct;
        
        ProductIds.push(TotalProducts + 111111);
        Products.push(newProduct);

        
        emit addProductEvent(TotalProducts, pname);
        
    }
    
    function getTotalProducts() public constant returns(uint) {
        return TotalProducts;
    }
    
    function getProduct(uint pid) public constant returns (Product) {
        return productDetails[pid];
    }
     
    
    
    function reviewProduct(uint productId, uint urating, string memory ucomments) public {
        require(productId >= 0, "Productid required !");
        require(urating > 0 && urating <= 5, "Product rating should be in 1-5 range !");
        require(IsProductReviewedByUser[productId][msg.sender] == false, "Product already reviewed by user !");
        
        Product storage oldProduct = productDetails[productId];
        oldProduct.avgRating += urating * 10;
        oldProduct.totalReviewed++;
        
        rating[productId][msg.sender] = urating;
        comments[productId][msg.sender] = ucomments;
        
        IsProductReviewedByUser[productId][msg.sender] = true;
        Users.push(msg.sender);
        
        emit reviewProductEvent(productId, urating);
    }
    
    
    function getProductAvgRating(uint pid) public view returns (string memory pname, uint avgRating) {
        require(pid >= 0, "Productid required !");
        
        uint allAvgRating = 0;

        if(productDetails[pid].totalReviewed > 0)
            allAvgRating = productDetails[pid].avgRating / productDetails[pid].totalReviewed;
        
        return (productDetails[pid].productName, allAvgRating);
    }
    
    function getUserComments(uint pid) public view returns (string memory ucomments) {
         require(pid >= 0, "Productid required !");
         
         return comments[pid][msg.sender];
         
    }
    
    function getUserRating(uint pid) public view returns (uint urating) {
         require(pid >= 0, "Productid required !");
         
         return rating[pid][msg.sender];
         
    }
    
    function getAllProductDetailes() public constant returns (Product[]) {
        
        return Products;
    }
    
    function getAllUsers() public constant returns (address[]) {
        
        return Users;
    }
    
    
    
}
