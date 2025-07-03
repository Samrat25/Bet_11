"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Trophy, Users, TrendingUp, Settings, User, Sparkles, Star, Zap, Menu, X } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          setBalance("2.5")
        }
      })
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        setIsConnecting(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        setAccount(accounts[0])
        setIsConnected(true)
        setBalance("2.5")
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-violet-600"></div>
      </div>
    )
  }

  const navItems = [
    { href: "/sports", label: "Sports", icon: "🏆" },
    { href: "/polls", label: "Polls", icon: "🗳️" },
    { href: "/fantasy", label: "Fantasy", icon: "⚽" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full opacity-60 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-40 right-32 w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full opacity-50 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/3 w-4 h-4 md:w-5 md:h-5 bg-blue-400 rounded-full opacity-40 animate-bounce animation-delay-3000"></div>
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-violet-200/50 bg-white/80 backdrop-blur-xl shadow-lg shadow-violet-100/50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative p-2 md:p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-violet-200 absolute -top-1 -right-1 animate-ping" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Bet11
                </h1>
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Blockchain Sports Betting</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 hover:scale-105 transform font-medium"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden xl:block">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Wallet Connection & Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Wallet Info */}
              {isConnected ? (
                <div className="flex items-center space-x-2 md:space-x-3 animate-slide-in-right">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold shadow-lg animate-pulse">
                    💰 {balance} ETH
                  </Badge>
                  <Badge className="hidden sm:flex bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-mono shadow-lg">
                    {account.slice(0, 4)}...{account.slice(-4)}
                  </Badge>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-3 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                      <span className="hidden sm:inline">Connecting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      <span className="hidden sm:inline">Connect Wallet</span>
                      <span className="sm:hidden">Connect</span>
                    </>
                  )}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2 hover:bg-violet-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-violet-200/50 animate-fade-in-up">
              <nav className="flex flex-col space-y-2 mt-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {!isConnected ? (
          <div className="text-center py-12 md:py-20 animate-fade-in-up">
            <div className="relative mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <Wallet className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-r from-violet-400 to-purple-500 opacity-30 animate-ping"></div>
              <Star className="absolute top-2 right-1/3 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-2 left-1/3 w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-pulse animation-delay-500" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-slate-800 via-violet-700 to-purple-700 bg-clip-text text-transparent px-4">
              Welcome to Bet11
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300 px-4">
              Experience the future of sports betting with our blockchain-powered platform. Connect your MetaMask wallet
              to unlock unlimited betting opportunities.
            </p>

            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              size="lg"
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-violet-500/25 animate-fade-in-up animation-delay-500"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white mr-3"></div>
                  <span className="hidden sm:inline">Connecting MetaMask...</span>
                  <span className="sm:hidden">Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                  <span className="hidden sm:inline">Connect MetaMask Wallet</span>
                  <span className="sm:hidden">Connect Wallet</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            <div className="text-center animate-fade-in-up px-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Welcome Back! 🎉
              </h2>
              <p className="text-lg md:text-xl text-slate-600">Choose your betting adventure and start winning</p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[
                {
                  href: "/sports",
                  icon: Trophy,
                  title: "Sports Betting",
                  description: "Bet on cricket, football, basketball and more",
                  badge: "12",
                  badgeLabel: "Live Events",
                  gradient: "from-orange-400 to-red-500",
                  bgGradient: "from-orange-50 to-red-50",
                  iconBg: "from-orange-500 to-red-600",
                  delay: 0,
                },
                {
                  href: "/polls",
                  icon: TrendingUp,
                  title: "Polls & Predictions",
                  description: "Current affairs and community polls",
                  badge: "8",
                  badgeLabel: "Active Polls",
                  gradient: "from-blue-400 to-cyan-500",
                  bgGradient: "from-blue-50 to-cyan-50",
                  iconBg: "from-blue-500 to-cyan-600",
                  delay: 100,
                },
                {
                  href: "/fantasy",
                  icon: Users,
                  title: "Fantasy Sports",
                  description: "Build your dream team and compete",
                  badge: "5",
                  badgeLabel: "Leagues",
                  gradient: "from-purple-400 to-pink-500",
                  bgGradient: "from-purple-50 to-pink-50",
                  iconBg: "from-purple-500 to-pink-600",
                  delay: 200,
                },
                {
                  href: "/profile",
                  icon: User,
                  title: "Profile",
                  description: "Manage deposits, withdrawals and stats",
                  badge: balance,
                  badgeLabel: "ETH Balance",
                  gradient: "from-emerald-400 to-green-500",
                  bgGradient: "from-emerald-50 to-green-50",
                  iconBg: "from-emerald-500 to-green-600",
                  delay: 300,
                },
                {
                  href: "/admin",
                  icon: Settings,
                  title: "Admin Panel",
                  description: "Automated event management",
                  badge: "0",
                  badgeLabel: "Pending",
                  gradient: "from-indigo-400 to-blue-500",
                  bgGradient: "from-indigo-50 to-blue-50",
                  iconBg: "from-indigo-500 to-blue-600",
                  delay: 400,
                },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <Card
                    className={`bg-gradient-to-br ${item.bgGradient} border-white/60 hover:border-white/80 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:shadow-2xl group animate-fade-in-up shadow-lg hover:shadow-xl h-full`}
                    style={{ animationDelay: `${item.delay}ms` }}
                  >
                    <CardHeader className="pb-3 md:pb-4">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div
                          className={`p-3 md:p-4 rounded-2xl bg-gradient-to-br ${item.iconBg} shadow-lg group-hover:shadow-xl transition-shadow flex-shrink-0`}
                        >
                          <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle
                            className={`text-slate-800 group-hover:bg-gradient-to-r group-hover:${item.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all text-lg md:text-xl font-bold`}
                          >
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 group-hover:text-slate-700 transition-colors mt-1 text-sm md:text-base">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium text-sm md:text-base">{item.badgeLabel}</span>
                        <Badge
                          className={`bg-gradient-to-r ${item.gradient} text-white px-3 md:px-4 py-1 md:py-2 font-semibold shadow-lg group-hover:shadow-xl transition-shadow animate-pulse text-sm`}
                        >
                          {item.badge}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Enhanced Live Activity Feed */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl animate-fade-in-up animation-delay-600">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center space-x-3 text-xl md:text-2xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
                  </div>
                  <span>Live Activity Feed</span>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 md:px-3 py-1 text-xs md:text-sm animate-pulse">
                    LIVE
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      text: "🏏 India vs Australia - Live betting active",
                      gradient: "from-green-500 to-emerald-500",
                      amount: "+0.5 ETH",
                      time: "2 min ago",
                    },
                    {
                      text: "🗳️ Election poll results auto-calculated",
                      gradient: "from-blue-500 to-cyan-500",
                      amount: "Winner declared",
                      time: "5 min ago",
                    },
                    {
                      text: "⚽ Fantasy league rewards distributed",
                      gradient: "from-purple-500 to-pink-500",
                      amount: "+2.1 ETH",
                      time: "8 min ago",
                    },
                    {
                      text: "🎯 Community poll ended automatically",
                      gradient: "from-orange-500 to-red-500",
                      amount: "Rewards sent",
                      time: "12 min ago",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 animate-slide-in-left shadow-sm"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div
                          className={`w-3 h-3 bg-gradient-to-r ${activity.gradient} rounded-full animate-pulse shadow-lg flex-shrink-0`}
                        ></div>
                        <div className="min-w-0 flex-1">
                          <span className="text-slate-800 font-medium text-sm md:text-base block truncate">
                            {activity.text}
                          </span>
                          <div className="text-xs md:text-sm text-slate-500">{activity.time}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span
                          className={`bg-gradient-to-r ${activity.gradient} bg-clip-text text-transparent font-bold text-sm md:text-base`}
                        >
                          {activity.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up animation-delay-800">
              {[
                { label: "Total Bets", value: "1,234", icon: "🎯", gradient: "from-blue-500 to-cyan-500" },
                { label: "Active Users", value: "5,678", icon: "👥", gradient: "from-green-500 to-emerald-500" },
                { label: "Total Volume", value: "89.7 ETH", icon: "💰", gradient: "from-purple-500 to-pink-500" },
                { label: "Win Rate", value: "68%", icon: "🏆", gradient: "from-orange-500 to-red-500" },
              ].map((stat, index) => (
                <Card
                  key={stat.label}
                  className="bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                    <div
                      className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-slate-600 text-xs md:text-sm font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
