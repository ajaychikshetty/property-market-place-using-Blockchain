import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Check if required environment variables are set
const requiredEnvVars = ['SEPOLIA_RPC_URL', 'PRIVATE_KEY', 'CONTRACT_ADDRESS', 'VERIFICATION_CONTRACT_ADDRESS'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize provider and wallet with retry logic
let provider;
let wallet;
let propertyContract;
let verificationContract;

async function initializeContracts() {
    try {
        console.log('Initializing provider and wallet...');
        provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log('Wallet address:', wallet.address);

        console.log('Loading contract addresses...');
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const verificationContractAddress = process.env.VERIFICATION_CONTRACT_ADDRESS;
        console.log('Property Contract Address:', contractAddress);
        console.log('Verification Contract Address:', verificationContractAddress);

        console.log('Loading contract ABIs...');
        const propertyContractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, '../blockchain/artifacts/contracts/PropertyContract.sol/PropertyContract.json'), 'utf8')).abi;
        const verificationContractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, '../blockchain/artifacts/contracts/PropertyVerification.sol/PropertyVerification.json'), 'utf8')).abi;

        console.log('Initializing contracts...');
        propertyContract = new ethers.Contract(contractAddress, propertyContractAbi, wallet);
        verificationContract = new ethers.Contract(verificationContractAddress, verificationContractAbi, wallet);
        console.log('Contracts initialized successfully');
    } catch (error) {
        console.error('Error initializing contracts:', error);
        // Retry after 5 seconds
        setTimeout(initializeContracts, 5000);
    }
}

// Initialize contracts
initializeContracts();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// List property endpoint
app.post('/list-property', async (req, res) => {
    try {
        if (!propertyContract) {
            throw new Error('Contract not initialized. Please try again in a few seconds.');
        }

        console.log('Received list property request:', req.body);
        const { propertyAddress, price, size, bedrooms, bathrooms, imageUrl, smartContractAddress } = req.body;
        
        // Validate required fields
        if (!propertyAddress || !price || !size || !bedrooms || !bathrooms || !imageUrl || !smartContractAddress) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const priceInWei = ethers.parseEther(price.toString());

        console.log('Calling listProperty with:', {
            propertyAddress,
            price: priceInWei.toString(),
            size,
            bedrooms,
            bathrooms,
            imageUrl,
            smartContractAddress
        });

        const tx = await propertyContract.listProperty(
            propertyAddress,
            priceInWei,
            size,
            bedrooms,
            bathrooms,
            imageUrl,
            smartContractAddress
        );

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        res.json({ success: true, transactionHash: tx.hash });
    } catch (error) {
        console.error('Error in list-property endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/buy-property', async (req, res) => {
    try {
        const { propertyId, value, verificationData } = req.body;
        
        // First create verification record
        const verificationTx = await verificationContract.createVerification(
            propertyId,
            verificationData.buyerAddress,
            verificationData.sellerAddress,
            verificationData.buyerName,
            verificationData.buyerEmail,
            verificationData.buyerPhone,
            verificationData.buyerAddress,
            verificationData.verificationDocument
        );
        await verificationTx.wait();

        // Then proceed with property purchase
        const tx = await propertyContract.buyProperty(propertyId, { value: ethers.parseUnits(value, "wei") });
        await tx.wait();
        
        res.json({ 
            success: true, 
            txHash: tx.hash,
            verificationTxHash: verificationTx.hash
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/properties', async (req, res) => {
    try {
        const propertyCount = await propertyContract.propertyCount();
        const properties = [];

        for (let i = 1; i <= propertyCount; i++) {
            const property = await propertyContract.getProperty(i);
            properties.push({
                id: property.id.toString(),
                propertyAddress: property.propertyAddress,
                price: property.price.toString(),
                size: property.size.toString(),
                bedrooms: property.bedrooms.toString(),
                bathrooms: property.bathrooms.toString(),
                imageUrl: property.imageUrl,
                owner: property.owner,
                forSale: property.forSale,
                smartContractAddress: property.smartContractAddress
            });
        }

        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/verifications/:propertyId', async (req, res) => {
    try {
        const { propertyId } = req.params;
        const verificationCount = await verificationContract.verificationCount();
        const verifications = [];

        for (let i = 1; i <= verificationCount; i++) {
            const verification = await verificationContract.getVerification(i);
            if (verification.propertyId.toString() === propertyId) {
                verifications.push({
                    id: i,
                    propertyId: verification.propertyId.toString(),
                    buyer: verification.buyer,
                    seller: verification.seller,
                    buyerName: verification.buyerName,
                    buyerEmail: verification.buyerEmail,
                    buyerPhone: verification.buyerPhone,
                    buyerAddress: verification.buyerAddress,
                    verificationDocument: verification.verificationDocument,
                    timestamp: verification.timestamp.toString(),
                    verified: verification.verified
                });
            }
        }

        res.json({ success: true, verifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, let the server keep running
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Don't exit, let the server keep running
});
