import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

const VERIFICATION_CONTRACT_ADDRESS = import.meta.env.VITE_VERIFICATION_CONTRACT_ADDRESS;
const PROPERTY_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const VERIFICATION_CONTRACT_ABI = [
  "function verifications(uint256) view returns (uint256 propertyId, address buyer, address seller, string buyerName, string buyerEmail, string buyerPhone, string buyerAddress, string verificationDocument, uint256 timestamp, bool verified)",
  "function verificationCount() view returns (uint256)",
  "function approveVerification(uint256 _verificationId) external",
  "function rejectVerification(uint256 _verificationId) external",
  "function getVerification(uint256 _verificationId) external view returns (uint256 propertyId, address buyer, address seller, string buyerName, string buyerEmail, string buyerPhone, string buyerAddress, string verificationDocument, uint256 timestamp, bool verified)",
  "function admins(address) view returns (bool)"
];

const PROPERTY_CONTRACT_ABI = [
  "function transferProperty(uint256 _propertyId, address _to) external",
  "function properties(uint256) view returns (string name, string description, string location, uint256 price, address owner, bool isVerified, bool isForSale)"
];

function Admin({ account }) {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      checkAdminAccess();
    } else {
      setLoading(false);
      alert('Please connect your wallet first');
      navigate('/');
    }
  }, [account]);

  const checkAdminAccess = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const verificationContract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        provider
      );

      const isAdminUser = await verificationContract.admins(account);
      if (!isAdminUser) {
        alert('You are not authorized to access this page');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchVerifications();
    } catch (err) {
      console.error('Error checking admin access:', err);
      alert('Error checking admin access: ' + err.message);
      navigate('/');
    }
  };

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const verificationContract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        provider
      );

      const count = await verificationContract.verificationCount();
      console.log('Total verifications:', Number(count));

      const verificationPromises = [];
      for (let i = 1; i <= Number(count); i++) {
        verificationPromises.push(verificationContract.getVerification(i));
      }

      const results = await Promise.all(verificationPromises);
      console.log('Fetched verifications:', results);

      const formattedVerifications = results.map((result, index) => ({
        id: index + 1,
        propertyId: Number(result[0]),
        buyer: result[1],
        seller: result[2],
        buyerName: result[3],
        buyerEmail: result[4],
        buyerPhone: result[5],
        buyerAddress: result[6],
        verificationDocument: result[7],
        timestamp: Number(result[8]),
        verified: result[9]
      }));

      console.log('Formatted verifications:', formattedVerifications);
      setVerifications(formattedVerifications);
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to fetch verifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId, propertyId) => {
    try {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get verification contract instance
      const verificationContract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        signer
      );

      // Get property contract instance
      const propertyContract = new ethers.Contract(
        PROPERTY_CONTRACT_ADDRESS,
        PROPERTY_CONTRACT_ABI,
        signer
      );

      console.log('Approving verification:', verificationId);
      console.log('Current account:', account);

      // First approve the verification
      const approveTx = await verificationContract.approveVerification(verificationId);
      console.log('Approve transaction sent:', approveTx.hash);
      await approveTx.wait();
      console.log('Verification approved');

      // Get the verification details to get the buyer's address
      const verification = verifications.find(v => v.id === verificationId);
      if (!verification) {
        throw new Error('Verification not found');
      }

      // Then transfer the property
      console.log('Transferring property:', propertyId, 'to:', verification.buyer);
      const propertyTx = await propertyContract.transferProperty(propertyId, verification.buyer);
      console.log('Transfer transaction sent:', propertyTx.hash);
      await propertyTx.wait();
      console.log('Property transferred');

      // Refresh verifications
      await fetchVerifications();
      alert('Verification approved and property transferred successfully!');
    } catch (err) {
      console.error('Error approving verification:', err);
      if (err.code === 'CALL_EXCEPTION') {
        alert('Transaction failed: You may not have permission to approve this verification or the verification may not exist.');
      } else {
        alert('Failed to approve verification: ' + err.message);
      }
    }
  };

  const handleReject = async (verificationId) => {
    try {
      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const verificationContract = new ethers.Contract(
        VERIFICATION_CONTRACT_ADDRESS,
        VERIFICATION_CONTRACT_ABI,
        signer
      );

      const tx = await verificationContract.rejectVerification(verificationId);
      await tx.wait();

      // Refresh verifications
      await fetchVerifications();
      alert('Verification rejected successfully!');
    } catch (err) {
      console.error('Error rejecting verification:', err);
      alert('Failed to reject verification: ' + err.message);
    }
  };

  const filteredVerifications = verifications.filter(v => 
    activeTab === 'pending' ? !v.verified : v.verified
  );

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  if (loading) {
    return <div className={styles.loading}>Loading verifications...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{verifications.length}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {verifications.filter(v => v.verified).length}
          </div>
          <div className={styles.statLabel}>Approved</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {verifications.filter(v => !v.verified).length}
          </div>
          <div className={styles.statLabel}>Pending</div>
        </div>
      </div>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Verifications
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'approved' ? styles.active : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Verifications
        </button>
      </div>
  
      {filteredVerifications.length === 0 ? (
        <div className={styles.empty}>
          <p>No {activeTab} verifications found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.propertyId}>Property #{verification.propertyId}</h3>
                <span className={`${styles.statusBadge} ${verification.verified ? styles.verified : styles.pending}`}>
                  {verification.verified ? '✓ Approved' : '⏳ Pending'}
                </span>
              </div>
              <div className={styles.details}>
                <div className={styles.info}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>👤 Buyer Name</div>
                    <div className={styles.infoValue}>{verification.buyerName}</div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>📧 Email</div>
                    <div className={styles.infoValue}>{verification.buyerEmail}</div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>📱 Phone</div>
                    <div className={styles.infoValue}>{verification.buyerPhone}</div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>🕒 Date</div>
                    <div className={styles.infoValue}>
                      {new Date(verification.timestamp * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className={`${styles.infoItem} ${styles.full}`}>
                    <div className={styles.infoLabel}>📍 Address</div>
                    <div className={styles.infoValue}>{verification.buyerAddress}</div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>🔗 Buyer</div>
                    <div className={styles.infoValue}>
                      {`${verification.buyer.slice(0, 6)}...${verification.buyer.slice(-4)}`}
                    </div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>🔗 Seller</div>
                    <div className={styles.infoValue}>
                      {`${verification.seller.slice(0, 6)}...${verification.seller.slice(-4)}`}
                    </div>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>📄 Document</div>
                    <div className={styles.infoValue}>
                      <a href={verification.verificationDocument} target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </div>
                  </div>
                </div>
                
                {!verification.verified && (
                  <div className={styles.actions}>
                    <button
                      className={styles.approveButton}
                      onClick={() => handleApprove(verification.id, verification.propertyId)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleReject(verification.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin; 