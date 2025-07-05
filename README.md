# Bet11 - Blockchain Sports Betting Platform

A decentralized sports betting platform built with Next.js, Solidity smart contracts, and MetaMask integration.

## 🚀 Features

- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Smart Contract Betting**: Transparent and decentralized betting using Solidity contracts
- **Multi-Network Support**: Support for Ethereum, Sepolia, Polygon, and Mumbai networks
- **Real-time Updates**: Live balance updates and transaction status
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- **Token-based Betting**: BET11 tokens for all betting activities

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MetaMask browser extension
- Some test ETH for gas fees (Sepolia testnet recommended)
- Basic knowledge of blockchain and smart contracts

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Bet11
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000/betting](http://localhost:3000/betting)

## 🔧 Smart Contract Deployment

### Step 1: Deploy to Remix IDE

1. **Go to Remix IDE**
   - Visit [https://remix.ethereum.org](https://remix.ethereum.org)

2. **Create new file**
   - Create a new file named `Bet11Token.sol`
   - Copy the contract code from `contracts/Bet11Token.sol`

3. **Compile the contract**
   - Go to the Solidity Compiler tab
   - Set compiler version to 0.8.19
   - Click "Compile Bet11Token.sol"

4. **Deploy the contract**
   - Go to the Deploy & Run Transactions tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure you're connected to Sepolia testnet
   - Click "Deploy"
   - Confirm the transaction in MetaMask

5. **Copy the contract address**
   - After deployment, copy the contract address
   - You'll need this for the next step

### Step 2: Update Configuration

1. **Update contract addresses**
   Open `lib/web3.ts` and update the `CONTRACT_ADDRESSES`:

   ```typescript
   export const CONTRACT_ADDRESSES = {
     ethereum: '', // Add your mainnet address
     sepolia: 'YOUR_DEPLOYED_CONTRACT_ADDRESS', // Add your Sepolia address
     polygon: '', // Add your Polygon address
     mumbai: '' // Add your Mumbai address
   };
   ```

2. **Update ABI (if needed)**
   - Copy the ABI from Remix compilation tab
   - Replace the `CONTRACT_ABI` in `lib/web3.ts` if it differs

3. **Add Infura API key (optional)**
   - Get a free API key from [Infura](https://infura.io)
   - Update the RPC URLs in `lib/web3.ts`:

   ```typescript
   rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
   ```

## 🎯 Usage

### For Users

1. **Connect Wallet**
   - Click "Connect MetaMask" button
   - Approve the connection in MetaMask

2. **Switch Network**
   - Select Sepolia testnet (recommended for testing)
   - MetaMask will prompt to add the network if not already added

3. **Get BET11 Tokens**
   - The contract owner needs to mint tokens to your address
   - Use the `mint` function in Remix or your admin interface

4. **Place Bets**
   - Select an event from the available matches
   - Choose your team
   - Enter bet amount
   - Confirm the transaction

5. **Claim Winnings**
   - After events are resolved, winning bets can be claimed
   - Click "Claim" button for winning bets

### For Contract Owner

1. **Create Betting Events**
   ```solidity
   createBettingEvent("match_001", "Team A", "Team B", 86400) // 24 hours duration
   ```

2. **Mint Tokens**
   ```solidity
   mint(userAddress, amount) // Mint BET11 tokens to users
   ```

3. **Resolve Events**
   ```solidity
   resolveEvent("match_001", "Team A") // Set the winner
   ```

## 📁 Project Structure

```
Bet11/
├── app/                    # Next.js app directory
│   ├── betting/           # Betting interface page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── MetaMaskConnect.tsx    # Wallet connection
│   └── BettingInterface.tsx   # Betting interface
├── contexts/              # React contexts
│   └── Web3Context.tsx    # Web3 state management
├── lib/                   # Utility libraries
│   └── web3.ts           # Web3 configuration and utilities
├── contracts/             # Smart contracts
│   └── Bet11Token.sol    # Main betting contract
└── public/               # Static assets
```

## 🔒 Security Features

- **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
- **Access Control**: Owner-only functions for admin operations
- **Input Validation**: Comprehensive checks for all user inputs
- **Safe Math**: Built-in overflow protection in Solidity 0.8+
- **Event Logging**: All important actions are logged as events

## 🌐 Supported Networks

- **Ethereum Mainnet**: Production deployment
- **Sepolia Testnet**: Recommended for testing
- **Polygon Mainnet**: Low gas fees
- **Mumbai Testnet**: Polygon testnet

## 🚨 Important Notes

1. **Test First**: Always test on testnets before mainnet deployment
2. **Gas Fees**: Ensure you have sufficient ETH for gas fees
3. **Network Switching**: Users need to manually switch networks in MetaMask
4. **Token Distribution**: Contract owner controls initial token distribution
5. **Event Resolution**: Only contract owner can resolve events and set winners

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Ensure MetaMask is installed and unlocked
   - Check if the site is allowed to connect
   - Try refreshing the page

2. **Transaction fails**
   - Check if you have sufficient ETH for gas fees
   - Verify you're on the correct network
   - Ensure you have enough BET11 tokens

3. **Contract not found**
   - Verify the contract address is correct
   - Check if the contract is deployed on the current network
   - Update the ABI if needed

4. **Network not supported**
   - Add the network manually in MetaMask
   - Check if the network configuration is correct

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the smart contract documentation

---

**Disclaimer**: This is a demonstration project. Always conduct thorough testing and security audits before deploying to production networks.