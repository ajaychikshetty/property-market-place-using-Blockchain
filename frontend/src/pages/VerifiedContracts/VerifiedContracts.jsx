import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styles from './VerifiedContracts.module.css';

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
  },
  {
    "inputs": [],
    "name": "verificationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function VerifiedContracts({ contract, account }) {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationCount, setVerificationCount] = useState(0);
  const [completedVerifications, setCompletedVerifications] = useState(0);

  useEffect(() => {
    async function fetchVerifications() {
      try {
        if (!account) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const verificationContract = new ethers.Contract(
          VERIFICATION_CONTRACT_ADDRESS,
          VERIFICATION_CONTRACT_ABI,
          signer
        );

        const count = await verificationContract.verificationCount();
        setVerificationCount(Number(count));

        const verificationsArray = [];
        let completed = 0;
        for (let i = 1; i <= count; i++) {
          try {
            const verification = await verificationContract.getVerification(i);
            if (verification.buyer !== ethers.ZeroAddress) {
              if (verification.verified) completed++;
              verificationsArray.push({
                id: i,
                propertyId: verification.propertyId.toString(),
                buyer: verification.buyer,
                seller: verification.seller,
                buyerName: verification.buyerName,
                buyerEmail: verification.buyerEmail,
                buyerPhone: verification.buyerPhone,
                buyerAddress: verification.buyerAddress,
                verificationDocument: verification.verificationDocument,
                timestamp: new Date(Number(verification.timestamp) * 1000).toLocaleString(),
                verified: verification.verified
              });
            }
          } catch (err) {
            console.error(`Error fetching verification ${i}:`, err);
            continue;
          }
        }

        setCompletedVerifications(completed);
        setVerifications(verificationsArray);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchVerifications:', err);
        setError('Failed to fetch verifications: ' + err.message);
        setLoading(false);
      }
    }

    fetchVerifications();
  }, [account]);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner} />
      Loading verifications...
    </div>
  );
  
  if (error) return <div className={styles.error}>{error}</div>;
  if (!account) return <div className={styles.error}>Please connect your wallet first</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verified Contracts</h1>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{verificationCount}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{completedVerifications}</div>
          <div className={styles.statLabel}>Verified</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{verificationCount - completedVerifications}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
      </div>

      {verifications.length === 0 ? (
        <div className={styles.empty}>
          <p>No verified contracts found</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {verifications.map((verification) => (
            <div key={verification.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.propertyId}>Property #{verification.propertyId}</h3>
                <span className={`${styles.statusBadge} ${verification.verified ? styles.verified : styles.pending}`}>
                  {verification.verified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
              <div className={styles.details}>
                <div className={styles.info}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>👤 Buyer</div>
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
                      {new Date(verification.timestamp).toLocaleDateString()}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VerifiedContracts; 