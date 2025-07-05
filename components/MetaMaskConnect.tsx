'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, LogOut, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { NETWORKS, shortenAddress } from '@/lib/web3';

export const MetaMaskConnect: React.FC = () => {
  const {
    account,
    isConnected,
    isConnecting,
    balance,
    tokenBalance,
    chainId,
    connect,
    disconnect,
    switchToNetwork,
    refreshBalances
  } = useWeb3();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const handleNetworkSwitch = async (networkKey: string) => {
    try {
      await switchToNetwork(networkKey as keyof typeof NETWORKS);
      toast.success(`Switched to ${NETWORKS[networkKey as keyof typeof NETWORKS].chainName}`);
    } catch (error) {
      toast.error('Failed to switch network');
      console.error('Network switch error:', error);
    }
  };

  const handleRefreshBalances = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalances();
      toast.success('Balances refreshed');
    } catch (error) {
      toast.error('Failed to refresh balances');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCurrentNetwork = () => {
    if (!chainId) return null;
    return Object.entries(NETWORKS).find(([_, network]) => 
      network.chainId === chainId
    );
  };

  const currentNetwork = getCurrentNetwork();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your MetaMask wallet to start betting with BET11 tokens.
            </p>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask
                </>
              )}
            </Button>
            {typeof window.ethereum === 'undefined' && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  MetaMask is not installed. Please install MetaMask to continue.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Account Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Account</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono">
              {shortenAddress(account!)}
            </Badge>
          </div>
        </div>

        {/* Network Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Network</p>
          <Select
            value={currentNetwork ? currentNetwork[0] : ''}
            onValueChange={handleNetworkSwitch}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NETWORKS).map(([key, network]) => (
                <SelectItem key={key} value={key}>
                  {network.chainName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balances */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Balances</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshBalances}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ETH:</span>
              <span className="font-mono">{parseFloat(balance).toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">BET11:</span>
              <span className="font-mono">{parseFloat(tokenBalance).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Network Status */}
        {currentNetwork && (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-800">
              Connected to {currentNetwork[1].chainName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 