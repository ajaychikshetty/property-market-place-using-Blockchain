// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyVerification is Ownable {
    struct Verification {
        uint256 propertyId;
        address buyer;
        address seller;
        string buyerName;
        string buyerEmail;
        string buyerPhone;
        string buyerAddress;
        string verificationDocument;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => Verification) public verifications;
    uint256 public verificationCount;
    mapping(address => bool) public admins;

    event VerificationCreated(uint256 indexed verificationId, uint256 indexed propertyId, address buyer, address seller);
    event VerificationApproved(uint256 indexed verificationId);
    event VerificationRejected(uint256 indexed verificationId);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    constructor() Ownable(msg.sender) {
        admins[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    function addAdmin(address _admin) external onlyOwner {
        require(!admins[_admin], "Already an admin");
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin], "Not an admin");
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function createVerification(
        uint256 _propertyId,
        address _buyer,
        address _seller,
        string memory _buyerName,
        string memory _buyerEmail,
        string memory _buyerPhone,
        string memory _buyerAddress,
        string memory _verificationDocument
    ) external returns (uint256) {
        verificationCount++;
        verifications[verificationCount] = Verification({
            propertyId: _propertyId,
            buyer: _buyer,
            seller: _seller,
            buyerName: _buyerName,
            buyerEmail: _buyerEmail,
            buyerPhone: _buyerPhone,
            buyerAddress: _buyerAddress,
            verificationDocument: _verificationDocument,
            timestamp: block.timestamp,
            verified: false
        });

        emit VerificationCreated(verificationCount, _propertyId, _buyer, _seller);
        return verificationCount;
    }

    function getVerification(uint256 _verificationId) external view returns (
        uint256 propertyId,
        address buyer,
        address seller,
        string memory buyerName,
        string memory buyerEmail,
        string memory buyerPhone,
        string memory buyerAddress,
        string memory verificationDocument,
        uint256 timestamp,
        bool verified
    ) {
        Verification memory verification = verifications[_verificationId];
        return (
            verification.propertyId,
            verification.buyer,
            verification.seller,
            verification.buyerName,
            verification.buyerEmail,
            verification.buyerPhone,
            verification.buyerAddress,
            verification.verificationDocument,
            verification.timestamp,
            verification.verified
        );
    }

    function approveVerification(uint256 _verificationId) external onlyAdmin {
        require(_verificationId > 0 && _verificationId <= verificationCount, "Invalid verification ID");
        require(!verifications[_verificationId].verified, "Already verified");
        
        verifications[_verificationId].verified = true;
        emit VerificationApproved(_verificationId);
    }

    function rejectVerification(uint256 _verificationId) external onlyAdmin {
        require(_verificationId > 0 && _verificationId <= verificationCount, "Invalid verification ID");
        require(!verifications[_verificationId].verified, "Already verified");
        
        delete verifications[_verificationId];
        emit VerificationRejected(_verificationId);
    }
} 