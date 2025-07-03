"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, History, Settings } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [balance] = useState("2.5")

  const handleDeposit = () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) return
    alert(`Deposit initiated: ${depositAmount} ETH`)
    setDepositAmount("")
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) return
    if (Number.parseFloat(withdrawAmount) > Number.parseFloat(balance)) {
      alert("Insufficient balance!")
      return
    }
    alert(`Withdrawal initiated: ${withdrawAmount} ETH`)
    setWithdrawAmount("")
  }

  const transactions = [
    { id: 1, type: "deposit", amount: "1.0", date: "2024-01-15", status: "completed", description: "MetaMask Deposit" },
    { id: 2, type: "bet", amount: "-0.2", date: "2024-01-14", status: "completed", description: "Cricket Match Bet" },
    { id: 3, type: "win", amount: "+0.5", date: "2024-01-14", status: "completed", description: "Cricket Bet Win" },
    {
      id: 4,
      type: "poll",
      amount: "-0.1",
      date: "2024-01-13",
      status: "completed",
      description: "Election Poll Entry",
    },
    {
      id: 5,
      type: "fantasy",
      amount: "-0.5",
      date: "2024-01-12",
      status: "completed",
      description: "Fantasy Team Entry",
    },
    {
      id: 6,
      type: "withdraw",
      amount: "-1.2",
      date: "2024-01-10",
      status: "pending",
      description: "Withdrawal to Wallet",
    },
  ]

  const stats = {
    totalBets: 45,
    wonBets: 28,
    winRate: 62,
    totalWinnings: "12.8",
    totalLosses: "8.3",
    netProfit: "4.5",
    fantasyTeams: 8,
    pollsParticipated: 15,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-white/10 text-white">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/10 text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/10 text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Balance Card */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Account Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{balance} ETH</div>
                  <div className="text-white/70">≈ $4,250 USD</div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stats.totalBets}</div>
                  <div className="text-sm text-white/70">Total Bets</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.winRate}%</div>
                  <div className="text-sm text-white/70">Win Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.netProfit} ETH</div>
                  <div className="text-sm text-white/70">Net Profit</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.fantasyTeams}</div>
                  <div className="text-sm text-white/70">Fantasy Teams</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Performance Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Bets Won</span>
                      <span className="text-green-400 font-medium">{stats.wonBets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Bets Lost</span>
                      <span className="text-red-400 font-medium">{stats.totalBets - stats.wonBets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Winnings</span>
                      <span className="text-green-400 font-medium">{stats.totalWinnings} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Losses</span>
                      <span className="text-red-400 font-medium">{stats.totalLosses} ETH</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Fantasy Teams Created</span>
                      <span className="text-purple-400 font-medium">{stats.fantasyTeams}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Polls Participated</span>
                      <span className="text-blue-400 font-medium">{stats.pollsParticipated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Account Level</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Gold</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Member Since</span>
                      <span className="text-white font-medium">Jan 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deposit */}
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Deposit</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">Add funds to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm">Amount (ETH)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="text-sm text-white/70">Minimum deposit: 0.01 ETH</div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleDeposit}
                    disabled={!depositAmount}
                  >
                    Deposit ETH
                  </Button>
                </CardContent>
              </Card>

              {/* Withdraw */}
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <span>Withdraw</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">Withdraw funds to your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm">Amount (ETH)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      step="0.01"
                      min="0"
                      max={balance}
                    />
                  </div>
                  <div className="text-sm text-white/70">Available balance: {balance} ETH</div>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount}
                  >
                    Withdraw ETH
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Balance */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Current Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-green-400 mb-2">{balance} ETH</div>
                  <div className="text-white/70 text-lg">≈ $4,250 USD</div>
                  <div className="mt-4 text-sm text-white/60">Last updated: Just now</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            tx.type === "deposit"
                              ? "bg-green-400"
                              : tx.type === "win"
                                ? "bg-yellow-400"
                                : tx.type === "withdraw"
                                  ? "bg-blue-400"
                                  : "bg-red-400"
                          }`}
                        ></div>
                        <div>
                          <div className="text-white font-medium">{tx.description}</div>
                          <div className="text-sm text-white/70">{tx.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            tx.amount.startsWith("+")
                              ? "text-green-400"
                              : tx.amount.startsWith("-")
                                ? "text-red-400"
                                : "text-white"
                          }`}
                        >
                          {tx.amount} ETH
                        </div>
                        <Badge
                          variant={tx.status === "completed" ? "secondary" : "destructive"}
                          className={`text-xs ${
                            tx.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium">Display Name</label>
                    <Input defaultValue="CryptoPlayer" className="mt-1 bg-white/5 border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Email</label>
                    <Input defaultValue="player@example.com" className="mt-1 bg-white/5 border-white/20 text-white" />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Connected Wallet</label>
                    <div className="mt-1 p-3 bg-white/5 rounded-lg border border-white/20">
                      <div className="text-white">0x1234...5678</div>
                      <div className="text-sm text-white/70">MetaMask</div>
                    </div>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">Bet Results</div>
                    <div className="text-sm text-white/70">Get notified when your bets are settled</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">New Events</div>
                    <div className="text-sm text-white/70">Notifications for new betting opportunities</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white">Fantasy Updates</div>
                    <div className="text-sm text-white/70">Updates on your fantasy team performance</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
