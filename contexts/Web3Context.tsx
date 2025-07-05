'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { 
  connectWallet, 
  getProvider, 
  getContract, 
  getSignedContract,
  switchNetwork,
  formatEther,
  parseEther,
  shortenAddress,
  NETWORKS,
  CONTRACT_ADDRESSES,
  CONTRACT_ABI
} from '@/lib/web3';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  signedContract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  tokenBalance: string;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToNetwork: (networkKey: keyof typeof NETWORKS) => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
  contractAddress?: string;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ 
  children, 
  contractAddress = CONTRACT_ADDRESSES.sepolia // Default to Sepolia testnet
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signedContract, setSignedContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [chainId, setChainId] = useState<string | null>(null);

  const isConnected = !!account && !!provider;

  const connect = async () => {
    if (isConnected) return;
    
    setIsConnecting(true);
    try {
      const connectedAccount = await connectWallet();
      const web3Provider = getProvider();
      
      setAccount(connectedAccount);
      setProvider(web3Provider);
      
      // Get network info
      const network = await web3Provider.getNetwork();
      setChainId(network.chainId.toString());
      
      // Setup contracts
      if (contractAddress) {
        const contractInstance = getContract(contractAddress);
        const signedContractInstance = await getSignedContract(contractAddress);
        
        setContract(contractInstance);
        setSignedContract(signedContractInstance);
      }
      
      // Get balances
      await refreshBalances();
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setSignedContract(null);
    setBalance('0');
    setTokenBalance('0');
    setChainId(null);
  };

  const switchToNetwork = async (networkKey: keyof typeof NETWORKS) => {
    if (!provider) return;
    
    try {
      const network = NETWORKS[networkKey];
      await switchNetwork(network.chainId);
      
      // Update chain ID
      const currentNetwork = await provider.getNetwork();
      setChainId(currentNetwork.chainId.toString());
      
      // Update contract if address exists for this network
      const networkContractAddress = CONTRACT_ADDRESSES[networkKey];
      if (networkContractAddress) {
        const contractInstance = getContract(networkContractAddress);
        const signedContractInstance = await getSignedContract(networkContractAddress);
        
        setContract(contractInstance);
        setSignedContract(signedContractInstance);
      }
      
      // Refresh balances
      await refreshBalances();
      
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  };

  const refreshBalances = async () => {
    if (!account || !provider || !contract) return;
    
    try {
      // Get ETH balance
      const ethBalance = await provider.getBalance(account);
      setBalance(formatEther(ethBalance));
      
      // Get token balance
      const tokenBalanceWei = await contract.balanceOf(account);
      setTokenBalance(formatEther(tokenBalanceWei));
      
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAccount(accounts[0]);
        refreshBalances();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider, contract]);

  // Auto-connect if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum === 'undefined') return;
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connect();
        }
      } catch (error) {
        console.error('Failed to auto-connect:', error);
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    contract,
    signedContract,
    isConnected,
    isConnecting,
    balance,
    tokenBalance,
    chainId,
    connect,
    disconnect,
    switchToNetwork,
    refreshBalances,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}; 