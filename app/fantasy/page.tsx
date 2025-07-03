"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Plus, Minus, Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"

export default function FantasyPage() {
  const [selectedPlayers, setSelectedPlayers] = useState<{ [key: string]: any }>({})
  const [budget, setBudget] = useState(100)
  const [usedBudget, setUsedBudget] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/sports", label: "Sports", icon: "🏆" },
    { href: "/polls", label: "Polls", icon: "🗳️" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/admin", label: "Admin", icon: "⚙️" },
  ]

  const cricketPlayers = [
    { id: "virat", name: "Virat Kohli", position: "Batsman", price: 15, points: 245, form: "Excellent" },
    { id: "rohit", name: "Rohit Sharma", position: "Batsman", price: 14, points: 220, form: "Good" },
    { id: "bumrah", name: "Jasprit Bumrah", position: "Bowler", price: 12, points: 180, form: "Excellent" },
    { id: "dhoni", name: "MS Dhoni", position: "Wicket Keeper", price: 13, points: 200, form: "Good" },
    { id: "pandya", name: "Hardik Pandya", position: "All Rounder", price: 11, points: 165, form: "Average" },
    { id: "babar", name: "Babar Azam", position: "Batsman", price: 14, points: 210, form: "Good" },
    { id: "shaheen", name: "Shaheen Afridi", position: "Bowler", price: 10, points: 155, form: "Good" },
    { id: "rizwan", name: "Mohammad Rizwan", position: "Wicket Keeper", price: 9, points: 140, form: "Average" },
  ]

  const footballPlayers = [
    { id: "messi", name: "Lionel Messi", position: "Forward", price: 18, points: 280, form: "Excellent" },
    { id: "haaland", name: "Erling Haaland", position: "Forward", price: 16, points: 260, form: "Excellent" },
    { id: "mbappe", name: "Kylian Mbappe", position: "Forward", price: 17, points: 270, form: "Good" },
    { id: "modric", name: "Luka Modric", position: "Midfielder", price: 12, points: 190, form: "Good" },
    { id: "vvd", name: "Virgil van Dijk", position: "Defender", price: 10, points: 160, form: "Good" },
    { id: "alisson", name: "Alisson", position: "Goalkeeper", price: 8, points: 130, form: "Average" },
  ]

  const addPlayer = (player: any) => {
    if (usedBudget + player.price <= budget && !selectedPlayers[player.id]) {
      setSelectedPlayers((prev) => ({ ...prev, [player.id]: player }))
      setUsedBudget((prev) => prev + player.price)
    }
  }

  const removePlayer = (player: any) => {
    if (selectedPlayers[player.id]) {
      setSelectedPlayers((prev) => {
        const newSelected = { ...prev }
        delete newSelected[player.id]
        return newSelected
      })
      setUsedBudget((prev) => prev - player.price)
    }
  }

  const createTeam = () => {
    const playerCount = Object.keys(selectedPlayers).length
    if (playerCount < 11) {
      alert(`You need at least 11 players. Currently selected: ${playerCount}`)
      return
    }
    alert(`Team created with ${playerCount} players! Entry fee: 0.5 ETH`)
  }

  const PlayerCard = ({ player, sport }: { player: any; sport: string }) => {
    const isSelected = selectedPlayers[player.id]
    const canAfford = usedBudget + player.price <= budget

    return (
      <Card
        className={`bg-gradient-to-br from-white to-slate-50 border-white/60 hover:border-white/80 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group animate-fade-in-up shadow-lg ${isSelected ? "ring-2 ring-green-500" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800 text-sm">{player.name}</CardTitle>
            <Badge
              variant="secondary"
              className={`text-xs ${
                player.form === "Excellent"
                  ? "bg-green-500/20 text-green-600"
                  : player.form === "Good"
                    ? "bg-blue-500/20 text-blue-600"
                    : "bg-yellow-500/20 text-yellow-600"
              }`}
            >
              {player.form}
            </Badge>
          </div>
          <CardDescription className="text-slate-600 text-xs">{player.position}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Price:</span>
            <span className="text-slate-800 font-medium">${player.price}M</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Points:</span>
            <span className="text-yellow-600 font-medium">{player.points}</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < (player.form === "Excellent" ? 5 : player.form === "Good" ? 4 : 3)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
          {isSelected ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="sm"
              onClick={() => removePlayer(player)}
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={() => addPlayer(player)}
              disabled={!canAfford}
            >
              <Plus className="w-4 h-4 mr-1" />
              {canAfford ? "Add" : "Too Expensive"}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
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
                <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Fantasy Sports</p>
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
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fantasy Sports
          </h1>
        </div>

        {/* Budget and Team Info */}
        <Card className="mb-6 bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800">Team Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">${budget - usedBudget}M</div>
                <div className="text-sm text-slate-600">Remaining Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Object.keys(selectedPlayers).length}</div>
                <div className="text-sm text-slate-600">Players Selected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Object.values(selectedPlayers).reduce((sum: number, player: any) => sum + player.points, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Points</div>
              </div>
              <div className="text-center">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={createTeam}
                  disabled={Object.keys(selectedPlayers).length < 11}
                >
                  Create Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="cricket" className="space-y-6">
          <TabsList className="bg-white/60 border border-violet-200/50 shadow-lg">
            <TabsTrigger value="cricket" className="data-[state=active]:bg-violet-100 text-slate-700">
              Cricket 🏏
            </TabsTrigger>
            <TabsTrigger value="football" className="data-[state=active]:bg-violet-100 text-slate-700">
              Football ⚽
            </TabsTrigger>
            <TabsTrigger value="my-teams" className="data-[state=active]:bg-violet-100 text-slate-700">
              My Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cricket" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cricketPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} sport="cricket" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="football" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {footballPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} sport="football" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-teams" className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800">Current Team</CardTitle>
                <CardDescription className="text-slate-600">
                  {Object.keys(selectedPlayers).length} players selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(selectedPlayers).length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    No players selected yet. Go to Cricket or Football tab to build your team.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(selectedPlayers).map((player: any) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg"
                      >
                        <div>
                          <div className="text-slate-800 font-medium">{player.name}</div>
                          <div className="text-sm text-slate-600">{player.position}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-800">${player.price}M</div>
                          <div className="text-yellow-600 text-sm">{player.points} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-gradient-to-br from-white to-slate-50 border-white/60 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "CryptoKing", points: 1250, prize: "5 ETH" },
                    { rank: 2, name: "FantasyPro", points: 1180, prize: "3 ETH" },
                    { rank: 3, name: "SportsBetter", points: 1120, prize: "2 ETH" },
                    {
                      rank: 4,
                      name: "You",
                      points: Object.values(selectedPlayers).reduce(
                        (sum: number, player: any) => sum + player.points,
                        0,
                      ),
                      prize: "-",
                    },
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.name === "You"
                          ? "bg-purple-500/20 border border-purple-500/30"
                          : "bg-gradient-to-r from-slate-50 to-slate-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-500 text-black"
                              : entry.rank === 2
                                ? "bg-gray-400 text-black"
                                : entry.rank === 3
                                  ? "bg-orange-500 text-black"
                                  : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <div>
                          <div className="text-slate-800 font-medium">{entry.name}</div>
                          <div className="text-sm text-slate-600">{entry.points} points</div>
                        </div>
                      </div>
                      <div className="text-green-600 font-medium">{entry.prize}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
