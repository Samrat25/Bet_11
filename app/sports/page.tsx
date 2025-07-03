"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, Users, Zap, TrendingUp, Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SportsPage() {
  const [selectedBets, setSelectedBets] = useState<{ [key: string]: { team: string; odds: number; amount: string } }>(
    {},
  )
  const [autoSettling, setAutoSettling] = useState<{ [key: string]: boolean }>({})
  const [liveScores, setLiveScores] = useState<{ [key: string]: { team1Score: number; team2Score: number } }>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-update live scores
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScores((prev) => ({
        ...prev,
        "cricket-1": {
          team1Score: Math.floor(Math.random() * 50) + 200,
          team2Score: Math.floor(Math.random() * 30) + 150,
        },
        "football-1": {
          team1Score: Math.floor(Math.random() * 3),
          team2Score: Math.floor(Math.random() * 3),
        },
        "basketball-1": {
          team1Score: Math.floor(Math.random() * 20) + 90,
          team2Score: Math.floor(Math.random() * 20) + 85,
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Auto-settle completed matches
  useEffect(() => {
    const settleInterval = setInterval(() => {
      Object.keys(selectedBets).forEach((matchId) => {
        if (Math.random() > 0.95 && !autoSettling[matchId]) {
          setAutoSettling((prev) => ({ ...prev, [matchId]: true }))

          setTimeout(() => {
            const bet = selectedBets[matchId]
            const won = Math.random() > 0.4
            const winAmount = won ? (Number.parseFloat(bet.amount) * bet.odds).toFixed(2) : "0"

            alert(`🎉 Bet Auto-Settled!\n${won ? `You won ${winAmount} ETH!` : "Better luck next time!"}`)

            setSelectedBets((prev) => {
              const newBets = { ...prev }
              delete newBets[matchId]
              return newBets
            })
            setAutoSettling((prev) => ({ ...prev, [matchId]: false }))
          }, 2000)
        }
      })
    }, 5000)

    return () => clearInterval(settleInterval)
  }, [selectedBets, autoSettling])

  const placeBet = (matchId: string, team: string, odds: number, amount: string) => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setSelectedBets((prev) => ({
      ...prev,
      [matchId]: { team, odds, amount },
    }))

    const button = document.activeElement as HTMLButtonElement
    if (button) {
      button.classList.add("animate-pulse")
      setTimeout(() => button.classList.remove("animate-pulse"), 1000)
    }
  }

  const matches = {
    cricket: [
      {
        id: "cricket-1",
        team1: "India",
        team2: "Australia",
        team1Odds: 1.8,
        team2Odds: 2.1,
        status: "Live",
        time: "2nd Innings - 45 overs",
        pool: "12.5 ETH",
        isLive: true,
      },
      {
        id: "cricket-2",
        team1: "England",
        team2: "Pakistan",
        team1Odds: 2.3,
        team2Odds: 1.6,
        status: "Starting Soon",
        time: "Starts in 2h 15m",
        pool: "8.2 ETH",
        isLive: false,
      },
    ],
    football: [
      {
        id: "football-1",
        team1: "Manchester City",
        team2: "Liverpool",
        team1Odds: 2.1,
        team2Odds: 1.9,
        status: "Live",
        time: "65' - 2nd Half",
        pool: "25.8 ETH",
        isLive: true,
      },
      {
        id: "football-2",
        team1: "Barcelona",
        team2: "Real Madrid",
        team1Odds: 1.7,
        team2Odds: 2.4,
        status: "Tomorrow",
        time: "Sunday 8:00 PM",
        pool: "45.2 ETH",
        isLive: false,
      },
    ],
    basketball: [
      {
        id: "basketball-1",
        team1: "Lakers",
        team2: "Warriors",
        team1Odds: 1.9,
        team2Odds: 2.0,
        status: "Live",
        time: "Q3 - 8:45",
        pool: "18.7 ETH",
        isLive: true,
      },
    ],
  }

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/polls", label: "Polls", icon: "🗳️" },
    { href: "/fantasy", label: "Fantasy", icon: "⚽" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ]

  const MatchCard = ({ match, sport }: { match: any; sport: string }) => {
    const [betAmount, setBetAmount] = useState("")
    const isSettling = autoSettling[match.id]
    const scores = liveScores[match.id]

    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-white/60 hover:border-white/80 transition-all duration-500 transform hover:scale-[1.02] animate-fade-in-up shadow-lg hover:shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
                {match.isLive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <CardTitle className="text-slate-800 text-lg">
                {match.team1} vs {match.team2}
              </CardTitle>
            </div>
            <Badge
              variant={match.status === "Live" ? "destructive" : "secondary"}
              className={`${
                match.status === "Live" ? "bg-red-500/20 text-red-600 animate-pulse" : "bg-blue-500/20 text-blue-600"
              } transition-all duration-300`}
            >
              {match.status === "Live" && <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-ping"></div>}
              {match.status}
            </Badge>
          </div>

          {/* Live Scores */}
          {match.isLive && scores && (
            <div className="flex items-center justify-center space-x-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg animate-fade-in">
              <div className="text-center">
                <div className="text-slate-800 font-bold text-xl animate-count-up">{scores.team1Score}</div>
                <div className="text-slate-600 text-sm">{match.team1}</div>
              </div>
              <div className="text-slate-500 text-2xl animate-pulse">-</div>
              <div className="text-center">
                <div className="text-slate-800 font-bold text-xl animate-count-up">{scores.team2Score}</div>
                <div className="text-slate-600 text-sm">{match.team2}</div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Pool: {match.pool}</span>
            </div>
            {match.isLive && (
              <div className="flex items-center space-x-1 text-green-600">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Auto-settling</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSettling && (
            <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <span className="text-yellow-700">Auto-settling your bet...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { team: match.team1, odds: match.team1Odds },
              { team: match.team2, odds: match.team2Odds },
            ].map((option, index) => (
              <div key={option.team} className="space-y-2">
                <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all duration-300 transform hover:scale-105">
                  <div className="text-slate-800 font-medium">{option.team}</div>
                  <div className="text-green-600 text-lg font-bold flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{option.odds}x</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  onClick={() => placeBet(match.id, option.team, option.odds, betAmount)}
                  disabled={!betAmount || isSettling}
                >
                  {isSettling ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Zap className="w-4 h-4 mr-1" />
                  )}
                  Bet on {option.team}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Bet amount (ETH)"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-white border-slate-200 text-slate-800 focus:border-green-400 transition-colors"
              step="0.01"
              min="0"
            />
          </div>

          {selectedBets[match.id] && !isSettling && (
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 animate-slide-in-up">
              <div className="text-green-700 text-sm flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>
                  ✓ Bet placed: {selectedBets[match.id].amount} ETH on {selectedBets[match.id].team}
                </span>
              </div>
              <div className="text-slate-600 text-xs mt-1">
                Potential win:{" "}
                {(Number.parseFloat(selectedBets[match.id].amount) * selectedBets[match.id].odds).toFixed(2)} ETH
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Will auto-settle when match ends</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-violet-200/50 bg-white/80 backdrop-blur-xl shadow-lg shadow-violet-100/50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in">
              <Link href="/">
                <div className="relative p-2 md:p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-violet-200 absolute -top-1 -right-1 animate-ping" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Bet11
                </h1>
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Sports Betting</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 hover:scale-105 transform font-medium"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden xl:block">{item.label}</span>
                </Link>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-violet-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-violet-200/50 animate-fade-in-up">
              <nav className="flex flex-col space-y-2 mt-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Sports Betting
          </h1>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Auto-Settlement Active</span>
          </div>
        </div>

        <Tabs defaultValue="cricket" className="space-y-6">
          <TabsList className="bg-white/60 border border-violet-200/50 shadow-lg">
            {[
              { value: "cricket", label: "Cricket 🏏", count: matches.cricket.length },
              { value: "football", label: "Football ⚽", count: matches.football.length },
              { value: "basketball", label: "Basketball 🏀", count: matches.basketball.length },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-violet-100 text-slate-700 hover:bg-violet-50 transition-all duration-300 relative"
              >
                {tab.label}
                <Badge className="ml-2 bg-green-500/20 text-green-600 text-xs animate-pulse">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(matches).map(([sport, matchList]) => (
            <TabsContent key={sport} value={sport} className="space-y-6">
              <div className="grid gap-4 md:gap-6">
                {matchList.map((match, index) => (
                  <div key={match.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <MatchCard match={match} sport={sport} />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Active Bets Summary */}
        {Object.keys(selectedBets).length > 0 && (
          <Card className="mt-8 bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                <span>Your Active Bets</span>
                <Badge className="bg-yellow-500/20 text-yellow-700">Auto-Settlement Enabled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(selectedBets).map(([matchId, bet], index) => (
                  <div
                    key={matchId}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-slate-800">
                      <div className="font-medium flex items-center space-x-2">
                        <span>{bet.team}</span>
                        {autoSettling[matchId] && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        {bet.amount} ETH at {bet.odds}x odds
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-medium">
                        Potential: {(Number.parseFloat(bet.amount) * bet.odds).toFixed(2)} ETH
                      </div>
                      <div className="text-xs text-green-500 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Auto-settling</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
