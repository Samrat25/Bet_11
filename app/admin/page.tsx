"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, DollarSign, CheckCircle, Zap, TrendingUp, Bot } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [events, setEvents] = useState([
    {
      id: "event-1",
      type: "Sports Bet",
      title: "India vs Australia Cricket",
      participants: 45,
      totalPool: "12.5 ETH",
      status: "auto-settling",
      winner: null,
      endDate: "2024-01-15",
      progress: 0,
    },
    {
      id: "event-2",
      type: "Poll",
      title: "2024 Election Prediction",
      participants: 128,
      totalPool: "25.6 ETH",
      status: "auto-resolving",
      winner: null,
      endDate: "2024-01-14",
      progress: 0,
    },
  ])

  const [completedEvents, setCompletedEvents] = useState([
    {
      id: "event-4",
      type: "Sports Bet",
      title: "Lakers vs Warriors",
      participants: 89,
      totalPool: "18.7 ETH",
      status: "completed",
      winner: "Lakers",
      endDate: "2024-01-12",
      rewardsDistributed: true,
    },
  ])

  const [systemStats, setSystemStats] = useState({
    totalEvents: 156,
    activeUsers: 1234,
    totalVolume: "89.7 ETH",
    autoSettlements: 0,
  })

  // Auto-settlement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.status === "auto-settling" || event.status === "auto-resolving") {
            const newProgress = Math.min(event.progress + Math.random() * 15, 100)

            if (newProgress >= 100) {
              // Move to completed
              const winner =
                event.type === "Sports Bet"
                  ? ["India", "Australia"][Math.floor(Math.random() * 2)]
                  : ["Biden", "Trump", "Other"][Math.floor(Math.random() * 3)]

              setTimeout(() => {
                setCompletedEvents((prev) => [
                  ...prev,
                  {
                    ...event,
                    status: "completed",
                    winner,
                    rewardsDistributed: true,
                  },
                ])

                setEvents((prev) => prev.filter((e) => e.id !== event.id))

                setSystemStats((prev) => ({
                  ...prev,
                  autoSettlements: prev.autoSettlements + 1,
                }))
              }, 1000)

              return { ...event, progress: 100, status: "finalizing" }
            }

            return { ...event, progress: newProgress }
          }
          return event
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update system stats
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setSystemStats((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        totalVolume: (Number.parseFloat(prev.totalVolume) + Math.random() * 0.1).toFixed(1) + " ETH",
      }))
    }, 3000)

    return () => clearInterval(statsInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            AI Admin Panel
          </h1>
          <div className="flex items-center space-x-2 text-green-400">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Fully Automated System</span>
          </div>
        </div>

        {/* AI System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Events",
              value: systemStats.totalEvents,
              icon: TrendingUp,
              color: "yellow",
              change: "+12 today",
            },
            {
              label: "Active Users",
              value: systemStats.activeUsers,
              icon: Users,
              color: "green",
              change: "+45 today",
            },
            {
              label: "Total Volume",
              value: systemStats.totalVolume,
              icon: DollarSign,
              color: "blue",
              change: "+8.2 ETH today",
            },
            {
              label: "Auto-Settlements",
              value: systemStats.autoSettlements,
              icon: Bot,
              color: "purple",
              change: "100% automated",
            },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-black/20 border-white/10 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 animate-pulse`} />
                </div>
                <div className={`text-3xl font-bold text-${stat.color}-400 mb-2 animate-count-up`}>{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
                <div className={`text-xs text-${stat.color}-300 mt-1`}>{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="auto-settlement" className="space-y-6">
          <TabsList className="bg-black/20 border-white/10">
            <TabsTrigger value="auto-settlement" className="data-[state=active]:bg-white/10 text-white">
              🤖 Auto-Settlement
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white/10 text-white">
              ✅ Completed Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 text-white">
              📊 AI Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto-settlement" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">AI Auto-Settlement in Progress</h2>
              <Badge className="bg-green-500/20 text-green-400 animate-pulse">{events.length} Processing</Badge>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <Card
                  key={event.id}
                  className="bg-black/20 border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <Bot className="w-5 h-5 text-green-400 animate-pulse" />
                          <span>{event.title}</span>
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          {event.type} • {event.participants} participants • Pool: {event.totalPool}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${
                          event.status === "finalizing"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        } animate-pulse`}
                      >
                        {event.status === "finalizing" ? "Finalizing..." : "AI Processing"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">AI Settlement Progress</span>
                        <span className="text-green-400 font-medium">{Math.round(event.progress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out relative"
                          style={{ width: `${event.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="text-blue-400 font-medium">Data Analysis</div>
                        <div className="text-white/70">{event.progress > 30 ? "✓ Complete" : "Processing..."}</div>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="text-purple-400 font-medium">Winner Detection</div>
                        <div className="text-white/70">{event.progress > 70 ? "✓ Complete" : "Processing..."}</div>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="text-green-400 font-medium">Reward Distribution</div>
                        <div className="text-white/70">{event.progress > 90 ? "✓ Complete" : "Pending..."}</div>
                      </div>
                    </div>

                    {event.status === "finalizing" && (
                      <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30 animate-pulse">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                          <span className="text-yellow-400">Finalizing settlement and distributing rewards...</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {events.length === 0 && (
                <Card className="bg-black/20 border-white/10 animate-fade-in">
                  <CardContent className="p-8 text-center">
                    <Bot className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold text-white mb-2">All Events Auto-Settled!</h3>
                    <p className="text-white/70">The AI system has successfully processed all pending events.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">AI Completed Events</h2>
              <Badge className="bg-blue-500/20 text-blue-400">{completedEvents.length} Auto-Settled</Badge>
            </div>

            <div className="space-y-4">
              {completedEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="bg-black/20 border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span>{event.title}</span>
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          {event.type} • Winner: {event.winner} • Pool: {event.totalPool}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Auto-Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/70 flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Bot className="w-4 h-4 text-green-400" />
                          <span>AI Settlement: Complete</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                          <span>Rewards: Distributed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span>{event.participants} participants paid</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="hover:bg-white/10 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-white/10 animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>AI Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Settlement Accuracy</span>
                      <span className="text-green-400 font-bold">99.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Average Settlement Time</span>
                      <span className="text-blue-400 font-bold">2.3 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">User Satisfaction</span>
                      <span className="text-purple-400 font-bold">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Disputes Resolved</span>
                      <span className="text-yellow-400 font-bold">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 animate-fade-in-up animation-delay-200">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                    <span>AI System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { service: "Event Monitor", status: "Online", color: "green" },
                      { service: "Auto-Settlement Engine", status: "Active", color: "green" },
                      { service: "Reward Distribution", status: "Running", color: "green" },
                      { service: "Fraud Detection", status: "Monitoring", color: "blue" },
                      { service: "Smart Contract Interface", status: "Connected", color: "purple" },
                    ].map((service, index) => (
                      <div key={service.service} className="flex justify-between items-center">
                        <span className="text-white/70">{service.service}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-${service.color}-400 rounded-full animate-pulse`}></div>
                          <span className={`text-${service.color}-400 font-medium text-sm`}>{service.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity Feed */}
            <Card className="bg-black/20 border-white/10 animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <span>Real-time AI Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { time: "2 seconds ago", action: "Auto-settled cricket match bet", type: "settlement" },
                    { time: "15 seconds ago", action: "Distributed rewards to 45 users", type: "reward" },
                    { time: "32 seconds ago", action: "Detected poll result automatically", type: "detection" },
                    { time: "1 minute ago", action: "Processed fantasy league scoring", type: "processing" },
                    { time: "2 minutes ago", action: "Validated smart contract transaction", type: "validation" },
                    { time: "3 minutes ago", action: "Updated live odds automatically", type: "update" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors animate-slide-in-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            activity.type === "settlement"
                              ? "bg-green-400"
                              : activity.type === "reward"
                                ? "bg-blue-400"
                                : activity.type === "detection"
                                  ? "bg-purple-400"
                                  : activity.type === "processing"
                                    ? "bg-yellow-400"
                                    : activity.type === "validation"
                                      ? "bg-red-400"
                                      : "bg-gray-400"
                          }`}
                        ></div>
                        <span className="text-white">{activity.action}</span>
                      </div>
                      <span className="text-white/50 text-sm">{activity.time}</span>
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
