# Blockchain-Based Property Marketplace

A decentralized property marketplace built on Ethereum blockchain, enabling secure and transparent real estate transactions.

## 🌟 Features

- **Decentralized Property Listings**: List and manage properties on the blockchain
- **Secure Transactions**: Smart contract-based property transfers
- **User Verification**: KYC and document verification system
- **Transparent Ownership**: Immutable property ownership records
- **Direct Crypto Payments**: Buy properties using cryptocurrency (ETH)
- **Modern UI**: Responsive and user-friendly interface

## 🏗️ Project Structure

```
property-market-place-using-Blockchain/
├── blockchain/              # Smart contracts and blockchain configuration
│   ├── contracts/          # Solidity smart contracts
│   ├── scripts/            # Deployment and utility scripts
│   └── hardhat.config.js   # Hardhat configuration
├── backend/                # Node.js backend server
│   └── index.js           # Main backend application
└── frontend/              # React frontend application
    ├── src/               # Source code
    └── public/            # Static assets
```

## 🚀 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Hardhat
- Ganache (for local development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/property-market-place-using-Blockchain.git
   cd property-market-place-using-Blockchain
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install blockchain dependencies
   cd blockchain
   npm install

   # Install backend dependencies
   cd ../backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in each directory
   - Update the values in `.env` files with your configuration

## 🔧 Configuration

### Blockchain Configuration
Create a `.env` file in the `blockchain` directory:
```
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

### Backend Configuration
Create a `.env` file in the `backend` directory:
```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Frontend Configuration
Create a `.env` file in the `frontend` directory:
```
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=your_contract_address
```

## 🏃‍♂️ Running the Project

1. **Start Local Blockchain**
   ```bash
   cd blockchain
   npx hardhat node
   ```

2. **Deploy Smart Contracts**
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

4. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

## 📝 Smart Contracts

### PropertyContract.sol
- Manages property listings and ownership
- Handles property sales and transfers
- Maintains property details and status

### PropertyVerification.sol
- Manages user verification process
- Handles KYC and document verification
- Controls admin access and verification status

## 🔒 Security Features

- Reentrancy protection
- Access control using OpenZeppelin's Ownable
- Secure payment handling
- Admin-controlled verification system

## 💰 Using the Marketplace

1. **Connect Wallet**
   - Install MetaMask
   - Connect to the local network
   - Ensure you have sufficient ETH

2. **List a Property**
   - Navigate to "List Property"
   - Fill in property details
   - Submit the listing

3. **Buy a Property**
   - Browse available properties
   - Select a property to buy
   - Complete the verification process
   - Send payment in ETH

4. **Verify Identity**
   - Complete KYC process
   - Upload required documents
   - Wait for admin verification
