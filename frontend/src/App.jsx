import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Home from '@/pages/Home/Home';
import Buy from '@/pages/Buy/Buy';
import Sell from '@/pages/Sell/Sell';
import Profile from '@/pages/Profile/Profile';
import VerifiedContracts from '@/pages/VerifiedContracts/VerifiedContracts';
import Admin from '@/pages/Admin/Admin';
import './App.css';

const API_URL = "http://localhost:5000"; // Update if hosted
const CONTRACT_ADDRESS = "0xC7F8C29E5b6C238496Bbac9BffC6f09c8a1a98e0";
const CONTRACT_ABI = [
  // Your contract ABI here (kept the same)
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "PropertyListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "PropertySold",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_propertyId",
        "type": "uint256"
      }
    ],
    "name": "buyProperty",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_propertyId",
        "type": "uint256"
      }
    ],
    "name": "getProperty",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "propertyAddress",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bedrooms",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bathrooms",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "propertyOwner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "forSale",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_propertyAddress",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_size",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bedrooms",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bathrooms",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imageUrl",
        "type": "string"
      }
    ],
    "name": "listProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "propertyCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_forSale",
        "type": "bool"
      }
    ],
    "name": "setForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);

    // Connect wallet and set up contract
    async function connectWallet() {
        try {
            if (!window.ethereum) {
                alert("MetaMask is required! Please install it to use this dApp.");
                return;
            }

            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            setProvider(provider);
            setSigner(signer);
            setAccount(address);
            setContract(contract);
            setLoading(false);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet: " + error.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background-dark)]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={
                        <Home 
                            account={account} 
                            loading={loading} 
                            connectWallet={connectWallet} 
                        />
                    } />
                    <Route path="/buy" element={<Buy contract={contract} account={account} />} />
                    <Route path="/sell" element={<Sell contract={contract} account={account} />} />
                    <Route path="/profile" element={<Profile contract={contract} account={account} />} />
                    <Route path="/verified" element={<VerifiedContracts contract={contract} account={account} />} />
                    <Route path="/admin" element={<Admin account={account} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;