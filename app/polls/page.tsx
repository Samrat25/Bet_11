"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, DollarSign, Zap, TrendingUp, CheckCircle, Menu, X, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"

export default function PollsPage() {
  const [votes, setVotes] = useState<{ [key: string]: string }>({})
  const [autoResults, setAutoResults] = useState<{ [key: string]: boolean }>({})
  const [livePercentages, setLivePercentages] = useState<{ [key: string]: any }>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-update poll percentages
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePercentages((prev) => ({
        ...prev,
        "poll-1": {
          biden: Math.floor(Math.random() * 10) + 40,
          trump: Math.floor(Math.random() * 10) + 35,
          other: Math.floor(Math.random() * 10) + 15,
        },
        "poll-2": {
          spain: Math.floor(Math.random() * 10) + 35,
          morocco: Math.floor(Math.random() * 10) + 30,
          argentina: Math.floor(Math.random() * 10) + 25,
        },
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Auto-resolve polls
  useEffect(() => {
    const resolveInterval = setInterval(() => {
      Object.keys(votes).forEach((pollId) => {
        if (Math.random() > 0.98 && !autoResults[pollId]) {
          setAutoResults((prev) => ({ ...prev, [pollId]: true }))

          setTimeout(() => {
            const won = Math.random() > 0.3
            alert(
              `🎉 Poll Auto-Resolved!\n${won ? "You won! Rewards distributed automatically." : "Better prediction next time!"}`,
            )
            setAutoResults((prev) => ({ ...prev, [pollId]: false }))
          }, 3000)
        }
      })
    }, 5000)

    return () => clearInterval(resolveInterval)
  }, [votes, autoResults])

  const voteOnPoll = (pollId: string, optionId: string, entryFee: string) => {
    setVotes((prev) => ({ ...prev, [pollId]: optionId }))

    const button = document.activeElement as HTMLButtonElement
    if (button) {
      button.classList.add("animate-pulse")
      setTimeout(() => button.classList.remove("animate-pulse"), 1000)
    }
  }

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/sports", label: "Sports", icon: "🏆" },
    { href: "/fantasy", label: "Fantasy", icon: "⚽" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ]

  const polls = {
    currentAffairs: [
      {
        id: "poll-1",
        question: "Who will win the 2024 US Presidential Election?",
        options: [
          { id: "biden", text: "Joe Biden", votes: 45, percentage: 45 },
          { id: "trump", text: "Donald Trump", votes: 35, percentage: 35 },
          { id: "other", text: "Other Candidate", votes: 20, percentage: 20 },
        ],
        totalVotes: 1250,
        endTime: "Auto-resolves Nov 5, 2024",
        entryFee: "0.1 ETH",
        prizePool: "125 ETH",
        isLive: true,
      },
      {
        id: "poll-2",
        question: "Which country will host the 2030 FIFA World Cup?",
        options: [
          { id: "spain", text: "Spain/Portugal", votes: 40, percentage: 40 },
          { id: "morocco", text: "Morocco", votes: 35, percentage: 35 },
          { id: "argentina", text: "Argentina/Uruguay", votes: 25, percentage: 25 },
        ],
        totalVotes: 890,
        endTime: "Auto-resolves Dec 31, 2024",
        entryFee: "0.05 ETH",
        prizePool: "44.5 ETH",
        isLive: true,
      },
    ],
    community: [
      {
        id: "community-1",
        question: "Best Programming Language for Web3 Development?",
        options: [
          { id: "solidity", text: "Solidity", votes: 55, percentage: 55 },
          { id: "rust", text: "Rust", votes: 30, percentage: 30 },
          { id: "javascript", text: "JavaScript", votes: 15, percentage: 15 },
        ],
        totalVotes: 567,
        endTime: "Auto-resolves Jan 15, 2025",
        entryFee: "0.02 ETH",
        prizePool: "11.34 ETH",
        isLive: true,
      },
    ],
  }

  const PollCard = ({ poll }: { poll: any }) => {
    const isResolving = autoResults[poll.id]
    const liveData = livePercentages[poll.id]

    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-white/60 hover:border-white/80 transition-all duration-500 transform hover:scale-[1.02] animate-fade-in-up shadow-lg hover:shadow-xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-slate-800 text-lg flex items-center space-x-2">
                <span>{poll.question}</span>
                {poll.isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="animate-count-up">{poll.totalVotes} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{poll.endTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Prize: {poll.prizePool}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Auto-resolving</span>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-600 animate-pulse">Entry: {poll.entryFee}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isResolving && (
            <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30 animate-pulse">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <span className="text-yellow-700">Auto-resolving poll results...</span>
              </div>
            </div>
          )}

          {poll.options.map((option: any, index: number) => {
            const currentPercentage = liveData?.[option.id] || option.percentage

            return (
              <div key={option.id} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-800">{option.text}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-600 animate-count-up">{currentPercentage}%</span>
                    {currentPercentage > option.percentage && (
                      <TrendingUp className="w-4 h-4 text-green-600 animate-bounce" />
                    )}
                  </div>
                </div>
                <Progress value={currentPercentage} className="h-3 transition-all duration-1000 ease-out" />
                <Button
                  className={`w-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    votes[poll.id] === option.id
                      ? "bg-green-600 hover:bg-green-700 shadow-green-500/25"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                  }`}
                  onClick={() => voteOnPoll(poll.id, option.id, poll.entryFee)}
                  disabled={votes[poll.id] === option.id || isResolving}
                >
                  {isResolving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : votes[poll.id] === option.id ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {votes[poll.id] === option.id ? "✓ Voted" : `Vote for ${option.text}`}
                </Button>
              </div>
            )
          })}

          {votes[poll.id] && !isResolving && (
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30 animate-slide-in-up">
              <div className="text-green-700 text-sm flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Vote recorded! Entry fee: {poll.entryFee}</span>
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Will auto-resolve when poll ends</span>
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
        <div className="absolute top-40 right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
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
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Polls & Predictions</p>
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
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Polls & Predictions
          </h1>
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Auto-Resolution Active</span>
          </div>
        </div>

        <Tabs defaultValue="current-affairs" className="space-y-6">
          <TabsList className="bg-white/60 border border-violet-200/50 shadow-lg">
            {[
              { value: "current-affairs", label: "Current Affairs 🗳️", count: polls.currentAffairs.length },
              { value: "community", label: "Community 💬", count: polls.community.length },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-violet-100 text-slate-700 hover:bg-violet-50 transition-all duration-300"
              >
                {tab.label}
                <Badge className="ml-2 bg-blue-500/20 text-blue-600 text-xs animate-pulse">{tab.count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="current-affairs" className="space-y-6">
            {polls.currentAffairs.map((poll, index) => (
              <div key={poll.id} style={{ animationDelay: `${index * 200}ms` }}>
                <PollCard poll={poll} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            {polls.community.map((poll, index) => (
              <div key={poll.id} style={{ animationDelay: `${index * 200}ms` }}>
                <PollCard poll={poll} />
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Active Votes Summary */}
        {Object.keys(votes).length > 0 && (
          <Card className="mt-8 bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl animate-slide-in-up">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
                <span>Your Active Predictions</span>
                <Badge className="bg-blue-500/20 text-blue-600">Auto-Resolution Enabled</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(votes).map(([pollId, vote], index) => (
                  <div
                    key={pollId}
                    className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-slate-800">
                      <div className="font-medium flex items-center space-x-2">
                        <span>Voted: {vote}</span>
                        {autoResults[pollId] && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">Poll ID: {pollId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-medium">Awaiting Results</div>
                      <div className="text-xs text-blue-500 flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Auto-resolving</span>
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
