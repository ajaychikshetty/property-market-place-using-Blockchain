import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './Profile.module.css';

function Profile({ contract, account }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        if (!contract || !account) return;
        
        const count = await contract.propertyCount();
        const propertiesArray = [];
        
        for (let i = 1; i <= count; i++) {
          const property = await contract.getProperty(i);
          if (property.propertyOwner.toLowerCase() === account.toLowerCase()) {
            propertiesArray.push({
              id: property.id.toString(),
              name: property.propertyAddress,
              price: property.price,
              size: property.size.toString(),
              bedrooms: property.bedrooms.toString(),
              bathrooms: property.bathrooms.toString(),
              image: property.imageUrl,
              forSale: property.forSale
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
  }, [contract, account]);

  const handleToggleSale = async (propertyId, currentStatus) => {
    try {
      if (!contract || !account) {
        alert('Please connect your wallet first');
        return;
      }
      const tx = await contract.setForSale(propertyId, !currentStatus);
      await tx.wait();
      alert('Property sale status updated successfully!');
      // Refresh properties list
      const count = await contract.propertyCount();
      const propertiesArray = [];
      for (let i = 1; i <= count; i++) {
        const property = await contract.getProperty(i);
        if (property.propertyOwner.toLowerCase() === account.toLowerCase()) {
          propertiesArray.push({
            id: property.id.toString(),
            name: property.propertyAddress,
            price: property.price,
            size: property.size.toString(),
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            image: property.imageUrl,
            forSale: property.forSale
          });
        }
      }
      setProperties(propertiesArray);
    } catch (err) {
      alert('Failed to update property status: ' + err.message);
      console.error(err);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      if (!contract || !account) {
        alert('Please connect your wallet first');
        return;
      }

      // Confirm deletion
      if (!window.confirm('Are you sure you want to remove this property from the marketplace? This will mark it as not for sale.')) {
        return;
      }

      // Set the property as not for sale
      const tx = await contract.setForSale(propertyId, false);
      await tx.wait();
      alert('Property removed from marketplace successfully!');
      
      // Refresh properties list
      const count = await contract.propertyCount();
      const propertiesArray = [];
      for (let i = 1; i <= count; i++) {
        const property = await contract.getProperty(i);
        if (property.propertyOwner.toLowerCase() === account.toLowerCase()) {
          propertiesArray.push({
            id: property.id.toString(),
            name: property.propertyAddress,
            price: property.price,
            size: property.size.toString(),
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            image: property.imageUrl,
            forSale: property.forSale
          });
        }
      }
      setProperties(propertiesArray);
    } catch (err) {
      alert('Failed to remove property: ' + err.message);
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading properties...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!account) return <div className={styles.error}>Please connect your wallet first</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Properties</h1>
      <div className={styles.grid}>
        {properties.map((property) => (
          <div key={property.id} className={`${styles.card} ${!property.forSale ? styles.removed : styles.forSale}`}>
            <img src={property.image || "https://via.placeholder.com/400x300?text=No+Image"} alt={property.name} className={styles.image} />
            <div className={styles.details}>
              <h3 className={styles.name}>{property.name}</h3>
              <p className={styles.price}>
                {ethers.formatEther(property.price)} ETH
              </p>
              <div className={styles.status}>
                Status: {property.forSale ? 'Available for Sale' : 'Removed from Marketplace'}
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.toggleButton} ${property.forSale ? styles.forSale : ''}`}
                  onClick={() => handleToggleSale(property.id, property.forSale)}
                >
                  {property.forSale ? 'Remove from Sale' : 'Put up for Sale'}
                </button>
                {property.forSale && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    Remove from Marketplace
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile; 