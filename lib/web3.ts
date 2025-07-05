import { ethers } from 'ethers';

// Contract ABI - This will be generated after you compile the contract in Remix
export const CONTRACT_ABI = [
  // ERC20 functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Betting functions
  "function createBettingEvent(string eventId, string teamA, string teamB, uint256 duration)",
  "function placeBet(string eventId, string team)",
  "function resolveEvent(string eventId, string winner)",
  "function claimWinnings(uint256 betId)",
  "function getBet(uint256 betId) view returns (tuple(uint256 id, address bettor, uint256 amount, string eventId, string team, bool isWinner, bool isClaimed, uint256 timestamp))",
  "function getBettingEvent(string eventId) view returns (tuple(string eventId, string teamA, string teamB, uint256 totalPool, uint256 teamAPool, uint256 teamBPool, bool isActive, bool isResolved, string winner, uint256 endTime))",
  "function getUserBets(address user) view returns (uint256[])",
  "function getEventBets(string eventId) view returns (uint256[])",
  "function getContractBalance() view returns (uint256)",
  "function getTotalBets() view returns (uint256)",
  
  // Admin functions
  "function mint(address to, uint256 amount)",
  "function burn(address from, uint256 amount)",
  "function pauseEvent(string eventId)",
  "function activateEvent(string eventId)",
  
  // Events
  "event BetPlaced(uint256 betId, address bettor, string eventId, string team, uint256 amount)",
  "event BetClaimed(uint256 betId, address bettor, uint256 winnings)",
  "event EventCreated(string eventId, string teamA, string teamB, uint256 endTime)",
  "event EventResolved(string eventId, string winner)",
  "event TokensMinted(address to, uint256 amount)",
  "event TokensBurned(address from, uint256 amount)"
];

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_KEY'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  polygon: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  mumbai: {
    chainId: '0x13881',
    chainName: 'Mumbai Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  }
};

// Contract addresses (you'll need to update these after deployment)
export const CONTRACT_ADDRESSES = {
  ethereum: '', // Add your deployed contract address
  sepolia: '', // Add your deployed contract address
  polygon: '', // Add your deployed contract address
  mumbai: '' // Add your deployed contract address
};

// Web3 utility functions
export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    return accounts[0];
  } catch (error) {
    throw new Error('Failed to connect wallet');
  }
};

export const getProvider = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getContract = (contractAddress: string) => {
  const provider = getProvider();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

export const getSignedContract = async (contractAddress: string) => {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
};

export const switchNetwork = async (chainId: string) => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, add it
      const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
      if (network) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [network]
        });
      }
    } else {
      throw error;
    }
  }
};

export const formatEther = (wei: string | number) => {
  return ethers.formatEther(wei);
};

export const parseEther = (ether: string) => {
  return ethers.parseEther(ether);
};

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Type definitions
declare global {
  interface Window {
    ethereum?: any;
  }
} 