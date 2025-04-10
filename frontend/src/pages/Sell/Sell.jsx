import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import styles from './Sell.module.css';

// Define your API base URL (adjust this to match your backend URL)
const API_BASE_URL = 'http://localhost:5000'; // Change this to your actual backend URL

function Sell({ contract, account }) {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    price: '',
    imageUrl: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    smartContractAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!account) {
        alert('Please connect your wallet first');
        return;
      }

      setLoading(true);
      
      // Set the smart contract address from the connected contract
      const data = {
        ...formData,
        smartContractAddress: contract ? contract.target : '',
        forSale: true,
      };
      
      // Convert price to Wei string format if needed
      if (data.price && !data.price.includes('0000000000000000')) {
        data.price = ethers.parseEther(data.price).toString();
      }

      console.log('Sending data to API:', data);
      
      // Use the full URL to your backend API endpoint
      const response = await axios.post(`${API_BASE_URL}/list-property`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include if you need cookies/credentials
      });
      
      if (response.data.success) {
        alert('Property listed successfully!');
        setFormData({
          propertyAddress: '',
          price: '',
          imageUrl: '',
          size: '',
          bedrooms: '',
          bathrooms: '',
          smartContractAddress: '',
        });
      } else {
        throw new Error(response.data.error || 'Failed to list property');
      }
    } catch (err) {
      setError('Failed to list property: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>List a Property</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="propertyAddress">Property Address</label>
          <input
            type="text"
            id="propertyAddress"
            name="propertyAddress"
            value={formData.propertyAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price (ETH)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="size">Size (sqft)</label>
          <input
            type="number"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Listing...' : 'List Property'}
        </button>
      </form>
    </div>
  );
}

export default Sell;