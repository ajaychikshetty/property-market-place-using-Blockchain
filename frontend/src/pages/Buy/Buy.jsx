import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './Buy.module.css';

const VERIFICATION_CONTRACT_ADDRESS = import.meta.env.VITE_VERIFICATION_CONTRACT_ADDRESS;
const VERIFICATION_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_propertyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_buyer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_seller",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_buyerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_buyerEmail",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_buyerPhone",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_buyerAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_verificationDocument",
        "type": "string"
      }
    ],
    "name": "createVerification",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_verificationId",
        "type": "uint256"
      }
    ],
    "name": "getVerification",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "propertyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "buyerName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "buyerEmail",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "buyerPhone",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "buyerAddress",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "verificationDocument",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function Buy({ contract, account }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [verificationData, setVerificationData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerAddress: '',
    verificationDocument: ''
  });

  useEffect(() => {
    async function fetchProperties() {
      try {
        if (!contract) return;
        
        const count = await contract.propertyCount();
        const propertiesArray = [];
        
        for (let i = 1; i <= count; i++) {
          const property = await contract.getProperty(i);
          if (property.forSale) {
            propertiesArray.push({
              id: property.id.toString(),
              name: property.propertyAddress,
              price: property.price,
              size: property.size.toString(),
              bedrooms: property.bedrooms.toString(),
              bathrooms: property.bathrooms.toString(),
              image: property.imageUrl,
              owner: property.propertyOwner
            });
          }
        }
        
        setProperties(propertiesArray);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties');
        setLoading(false);
        console.error(err);
      }
    }

    fetchProperties();
  }, [contract]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuyProperty = async (propertyId, price) => {
    try {
      if (!contract || !account) {
        alert('Please connect your wallet first');
        return;
      }

      const property = properties.find(p => p.id === propertyId);
      if (property.owner.toLowerCase() === account.toLowerCase()) {
        alert('You cannot buy your own property');
        return;
      }

      // Get the provider and signer from the window.ethereum object
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create the verification contract with the signer
      const verificationContract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        signer
      );

      // First, create the verification record
      const verificationTx = await verificationContract.createVerification(
        propertyId,
        account,
        property.owner,
        verificationData.buyerName,
        verificationData.buyerEmail,
        verificationData.buyerPhone,
        verificationData.buyerAddress,
        verificationData.verificationDocument
      );
      await verificationTx.wait();

      // Create the property contract with the signer
      const propertyContract = new ethers.Contract(
        contract.target,
        contract.interface,
        signer
      );

      // Then proceed with the property purchase
      const tx = await propertyContract.buyProperty(propertyId, { value: price });
      await tx.wait();
      alert('Property purchased successfully!');
      
      // Reset form and close modal
      setVerificationData({
        buyerName: '',
        buyerEmail: '',
        buyerPhone: '',
        buyerAddress: '',
        verificationDocument: ''
      });
      setShowModal(false);
      
      // Refresh properties list
      const count = await propertyContract.propertyCount();
      const propertiesArray = [];
      for (let i = 1; i <= count; i++) {
        const property = await propertyContract.getProperty(i);
        if (property.forSale) {
          propertiesArray.push({
            id: property.id.toString(),
            name: property.propertyAddress,
            price: property.price,
            size: property.size.toString(),
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            image: property.imageUrl,
            owner: property.propertyOwner
          });
        }
      }
      setProperties(propertiesArray);
    } catch (err) {
      alert('Failed to purchase property: ' + err.message);
      console.error(err);
    }
  };

  const openPurchaseModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  if (loading) return <div className={styles.loading}>Loading properties...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!account) return <div className={styles.error}>Please connect your wallet first</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Available Properties</h1>
      <div className={styles.grid}>
        {properties.map((property) => (
          <div key={property.id} className={`${styles.card} ${property.owner.toLowerCase() === account.toLowerCase() ? styles.owned : ''}`}>
            <img src={property.image || "https://via.placeholder.com/400x300?text=No+Image"} alt={property.name} className={styles.image} />
            <div className={styles.details}>
              <h3 className={styles.name}>{property.name}</h3>
              <p className={styles.price}>
                {ethers.formatEther(property.price)} ETH
              </p>
              <div className={styles.status}>
                {property.owner.toLowerCase() === account.toLowerCase() ? 'Your Property' : 'Available for Purchase'}
              </div>
              <button
                className={`${styles.buyButton} ${property.owner.toLowerCase() === account.toLowerCase() ? styles.disabled : ''}`}
                onClick={() => openPurchaseModal(property)}
                disabled={property.owner.toLowerCase() === account.toLowerCase()}
              >
                {property.owner.toLowerCase() === account.toLowerCase() ? 'Your Property' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProperty && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Purchase Property</h2>
            <p>Property: {selectedProperty.name}</p>
            <p>Price: {ethers.formatEther(selectedProperty.price)} ETH</p>
            
            <form className={styles.verificationForm}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="buyerName"
                  value={verificationData.buyerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={verificationData.buyerEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="buyerPhone"
                  value={verificationData.buyerPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="buyerAddress"
                  value={verificationData.buyerAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Verification Document (URL)</label>
                <input
                  type="text"
                  name="verificationDocument"
                  value={verificationData.verificationDocument}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={() => handleBuyProperty(selectedProperty.id, selectedProperty.price)}
                >
                  Confirm Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Buy; 