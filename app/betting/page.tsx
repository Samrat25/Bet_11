'use client';

import React from 'react';
import { MetaMaskConnect } from '@/components/MetaMaskConnect';
import { BettingInterface } from '@/components/BettingInterface';
import { useWeb3 } from '@/contexts/Web3Context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Wallet, TrendingUp } from 'lucide-react';

export default function BettingPage() {
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bet11 - Blockchain Sports Betting
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The ultimate decentralized sports betting platform powered by blockchain technology
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Wallet className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">MetaMask Integration</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Seamlessly connect your MetaMask wallet for secure transactions
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Decentralized Betting</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Place bets on your favorite teams with transparent smart contracts
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Claim your winnings instantly with automated smart contract execution
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Connection */}
          <div className="lg:col-span-1">
            <MetaMaskConnect />
          </div>

          {/* Betting Interface */}
          <div className="lg:col-span-2">
            {isConnected ? (
              <BettingInterface />
            ) : (
              <Card className="p-8 text-center">
                <CardHeader>
                  <CardTitle className="text-2xl mb-4">
                    Connect Your Wallet to Start Betting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please connect your MetaMask wallet to access the betting interface and start placing bets on your favorite sports events.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Connect MetaMask</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Select Network</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Start Betting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>How to Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Deploy Smart Contract</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>Copy the Solidity contract from <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">contracts/Bet11Token.sol</code></li>
                    <li>Go to <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Remix IDE</a></li>
                    <li>Create a new file and paste the contract code</li>
                    <li>Compile the contract (Solidity 0.8.19)</li>
                    <li>Deploy to your preferred testnet (Sepolia recommended)</li>
                    <li>Copy the deployed contract address</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Update Configuration</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>Open <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">lib/web3.ts</code></li>
                    <li>Update <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">CONTRACT_ADDRESSES</code> with your deployed address</li>
                    <li>Update the ABI if needed (copy from Remix compilation)</li>
                    <li>Add your Infura API key to RPC URLs</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Make sure you have MetaMask installed and connected</li>
                  <li>• Switch to the correct network (Sepolia testnet recommended for testing)</li>
                  <li>• Ensure you have some test ETH for gas fees</li>
                  <li>• The contract owner can mint BET11 tokens to your address</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 