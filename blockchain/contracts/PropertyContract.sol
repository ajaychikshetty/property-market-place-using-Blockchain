// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyContract {
    struct Property {
        uint256 id;
        string propertyAddress;
        uint256 price;
        uint256 size;
        uint256 bedrooms;
        uint256 bathrooms;
        string imageUrl;
        address owner;
        bool forSale;
        string smartContractAddress;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;
    address public owner;

    event PropertyListed(uint256 indexed id, address indexed owner, uint256 price);
    event PropertySold(uint256 indexed id, address indexed oldOwner, address indexed newOwner, uint256 price);

    constructor() {
        owner = msg.sender;
        propertyCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function listProperty(
        string memory _propertyAddress,
        uint256 _price,
        uint256 _size,
        uint256 _bedrooms,
        uint256 _bathrooms,
        string memory _imageUrl,
        string memory _smartContractAddress
    ) public {
        propertyCount++;
        properties[propertyCount] = Property({
            id: propertyCount,
            propertyAddress: _propertyAddress,
            price: _price,
            size: _size,
            bedrooms: _bedrooms,
            bathrooms: _bathrooms,
            imageUrl: _imageUrl,
            owner: msg.sender,
            forSale: true,
            smartContractAddress: _smartContractAddress
        });

        emit PropertyListed(propertyCount, msg.sender, _price);
    }

    function buyProperty(uint256 _id) public payable {
        Property storage property = properties[_id];
        require(property.forSale, "Property is not for sale");
        require(msg.value >= property.price, "Insufficient funds");
        require(msg.sender != property.owner, "Cannot buy your own property");

        address payable previousOwner = payable(property.owner);
        previousOwner.transfer(property.price);

        property.owner = msg.sender;
        property.forSale = false;

        emit PropertySold(_id, previousOwner, msg.sender, property.price);
    }

    function getProperty(uint256 _id) public view returns (
        uint256 id,
        string memory propertyAddress,
        uint256 price,
        uint256 size,
        uint256 bedrooms,
        uint256 bathrooms,
        string memory imageUrl,
        address propertyOwner,
        bool forSale,
        string memory smartContractAddress
    ) {
        Property memory property = properties[_id];
        return (
            property.id,
            property.propertyAddress,
            property.price,
            property.size,
            property.bedrooms,
            property.bathrooms,
            property.imageUrl,
            property.owner,
            property.forSale,
            property.smartContractAddress
        );
    }

    function setForSale(uint256 _id, bool _forSale) public {
        require(properties[_id].owner == msg.sender, "Only owner can change sale status");
        properties[_id].forSale = _forSale;
    }
}