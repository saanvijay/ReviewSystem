pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract ReviewSystem {
    
    struct Product {
        string productName;
        uint productPrice;
        string productHash;
        uint avgRating;
        uint totalReviewed;
        address[] users;
    }
    struct UserInput {
        uint rating;
        string comments;
        uint dateOfReview;
        bool IsProductReviewedByUser
    }
    
    Product newProduct;
    UserInput newInput;
    uint public TotalProducts;
    
    mapping(uint => Product)   productDetails;
    uint[]    public ProductIds;
    mapping(uint => mapping (address => UserInput)) userReview;
   
    event addProductEvent( uint pid, string pname );
    event reviewProductEvent( uint pid, uint avgRating );
    
    constructor() public {
        TotalProducts = 0;
    }
    
    function addProduct(string memory pname, uint price, string memory imagehash) public {
        require(keccak256(bytes(pname)) != keccak256(""), "Product Name required !");

         TotalProducts++;
         uint pid = TotalProducts + 111110;
        
        newProduct.productName = pname;
        newProduct.productPrice = price;
        newProduct.productHash = imagehash;
        newProduct.avgRating = 0;
        newProduct.totalReviewed = 0;
        newProduct.users.push(msg.sender);

        ProductIds.push(pid);
        productDetails[pid] = newProduct;
        
        emit addProductEvent(TotalProducts, pname);
        
    }
    
    function getTotalProducts() public constant returns(uint) {
        return TotalProducts;
    }
    
    function getProduct(uint pid) public constant returns (Product) {
        return productDetails[pid];
    }
     
    
    
    function reviewProduct(uint productId, uint urating, string memory ucomments, uint reviewDate) public {
        require(productId >= 0, "Productid required !");
        require(urating > 0 && urating <= 5, "Product rating should be in 1-5 range !");
        require(userReview[productId][msg.sender].IsProductReviewedByUser == false, "Product already reviewed by user !");
        
        Product storage oldProduct = productDetails[productId];
        oldProduct.avgRating += urating * 10;
        oldProduct.totalReviewed++;
        oldProduct.users.push(msg.sender);

        newInput.rating = urating;
        newInput.comments = ucomments;
        newInput.dateOfReview = reviewDate;
        newInput.IsProductReviewedByUser = true;
        
        userReview[productId][msg.sender] = newInput;
        
        
        emit reviewProductEvent(productId, urating);
    }
    
    
    function getProductAvgRating(uint pid) public view returns (string memory pname, uint avgRating) {
        require(pid >= 0, "Productid required !");
        
        uint allAvgRating = 0;

        if(productDetails[pid].totalReviewed > 0)
            allAvgRating = productDetails[pid].avgRating / productDetails[pid].totalReviewed;
        
        return (productDetails[pid].productName, allAvgRating);
    }
    
    function getCurrentUserComments(uint pid) public view returns (string memory ucomments) {
         require(pid >= 0, "Productid required !");
         
         return userReview[pid][msg.sender].comments;
         
    }
    
    function getCurrentUserRating(uint pid) public view returns (uint urating) {
         require(pid >= 0, "Productid required !");
         
         return userReview[pid][msg.sender].rating;
         
    }
    
    function getUserComments(uint pid, address user) public view returns (string memory ucomments) {
         require(pid >= 0, "Productid required !");
         
         return userReview[pid][user].comments;
         
    }
    
    function getUserRating(uint pid, address user) public view returns (uint urating) {
         require(pid >= 0, "Productid required !");
         
         return userReview[pid][user].rating;
         
    }
    
    function getUserDateOfReview(uint pid, address user) public view returns (uint reviewDate) {
         require(pid >= 0, "Productid required !");
         
         return userReview[pid][user].dateOfReview;
         
    }
    
    function getAllProductPids() public constant returns (uint[]) {
        return ProductIds;
    }

    function getAllUsersForProduct(uint pid) public constant returns  (address[]){
       return productDetails[pid].users;
    }

   
    
    
}
