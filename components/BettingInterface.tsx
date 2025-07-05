'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Clock, Coins, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { formatEther, parseEther } from '@/lib/web3';

interface BettingEvent {
  eventId: string;
  teamA: string;
  teamB: string;
  totalPool: string;
  teamAPool: string;
  teamBPool: string;
  isActive: boolean;
  isResolved: boolean;
  winner: string;
  endTime: string;
}

interface Bet {
  id: string;
  bettor: string;
  amount: string;
  eventId: string;
  team: string;
  isWinner: boolean;
  isClaimed: boolean;
  timestamp: string;
}

export const BettingInterface: React.FC = () => {
  const { signedContract, account, tokenBalance, refreshBalances } = useWeb3();
  
  const [events, setEvents] = useState<BettingEvent[]>([]);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Sample events for demonstration
  const sampleEvents: BettingEvent[] = [
    {
      eventId: 'match_001',
      teamA: 'Manchester United',
      teamB: 'Liverpool',
      totalPool: '1000',
      teamAPool: '600',
      teamBPool: '400',
      isActive: true,
      isResolved: false,
      winner: '',
      endTime: (Date.now() + 86400000).toString() // 24 hours from now
    },
    {
      eventId: 'match_002',
      teamA: 'Barcelona',
      teamB: 'Real Madrid',
      totalPool: '2000',
      teamAPool: '1200',
      teamBPool: '800',
      isActive: true,
      isResolved: false,
      winner: '',
      endTime: (Date.now() + 172800000).toString() // 48 hours from now
    }
  ];

  useEffect(() => {
    setEvents(sampleEvents);
  }, []);

  const handlePlaceBet = async () => {
    if (!signedContract || !selectedEvent || !selectedTeam || !betAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount <= 0 || amount > parseFloat(tokenBalance)) {
      toast.error('Invalid bet amount');
      return;
    }

    setIsPlacingBet(true);
    try {
      const tx = await signedContract.placeBet(selectedEvent, selectedTeam);
      await tx.wait();
      
      toast.success('Bet placed successfully!');
      setBetAmount('');
      setSelectedTeam('');
      await refreshBalances();
      
      // Refresh user bets
      await loadUserBets();
      
    } catch (error) {
      console.error('Bet placement error:', error);
      toast.error('Failed to place bet');
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleClaimWinnings = async (betId: string) => {
    if (!signedContract) return;

    setIsClaiming(true);
    try {
      const tx = await signedContract.claimWinnings(betId);
      await tx.wait();
      
      toast.success('Winnings claimed successfully!');
      await refreshBalances();
      await loadUserBets();
      
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Failed to claim winnings');
    } finally {
      setIsClaiming(false);
    }
  };

  const loadUserBets = async () => {
    if (!signedContract || !account) return;

    try {
      const betIds = await signedContract.getUserBets(account);
      const userBetsData: Bet[] = [];

      for (const betId of betIds) {
        const bet = await signedContract.getBet(betId);
        userBetsData.push({
          id: betId.toString(),
          bettor: bet.bettor,
          amount: formatEther(bet.amount),
          eventId: bet.eventId,
          team: bet.team,
          isWinner: bet.isWinner,
          isClaimed: bet.isClaimed,
          timestamp: new Date(parseInt(bet.timestamp) * 1000).toLocaleString()
        });
      }

      setUserBets(userBetsData);
    } catch (error) {
      console.error('Failed to load user bets:', error);
    }
  };

  useEffect(() => {
    if (signedContract && account) {
      loadUserBets();
    }
  }, [signedContract, account]);

  const getSelectedEvent = () => {
    return events.find(event => event.eventId === selectedEvent);
  };

  const getWinningBets = () => {
    return userBets.filter(bet => bet.isWinner && !bet.isClaimed);
  };

  const getActiveBets = () => {
    return userBets.filter(bet => !bet.isResolved);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">Betting Events</TabsTrigger>
          <TabsTrigger value="place-bet">Place Bet</TabsTrigger>
          <TabsTrigger value="my-bets">My Bets</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <Card key={event.eventId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{event.teamA} vs {event.teamB}</span>
                    <Badge variant={event.isActive ? "default" : "secondary"}>
                      {event.isActive ? "Active" : "Ended"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{event.teamA}</p>
                      <p className="text-2xl font-bold">{formatEther(event.teamAPool)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{event.teamB}</p>
                      <p className="text-2xl font-bold">{formatEther(event.teamBPool)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4" />
                      <span>Total Pool: {formatEther(event.totalPool)} BET11</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Ends: {new Date(parseInt(event.endTime) * 1000).toLocaleString()}</span>
                    </div>
                  </div>

                  {event.isResolved && event.winner && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">Winner: {event.winner}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="place-bet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event">Select Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.filter(event => event.isActive).map((event) => (
                      <SelectItem key={event.eventId} value={event.eventId}>
                        {event.teamA} vs {event.teamB}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEvent && (
                <div className="space-y-2">
                  <Label htmlFor="team">Select Team</Label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSelectedEvent() && (
                        <>
                          <SelectItem value={getSelectedEvent()!.teamA}>
                            {getSelectedEvent()!.teamA}
                          </SelectItem>
                          <SelectItem value={getSelectedEvent()!.teamB}>
                            {getSelectedEvent()!.teamB}
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Bet Amount (BET11)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  max={tokenBalance}
                />
                <p className="text-sm text-muted-foreground">
                  Available: {parseFloat(tokenBalance).toFixed(2)} BET11
                </p>
              </div>

              <Button 
                onClick={handlePlaceBet} 
                disabled={!selectedEvent || !selectedTeam || !betAmount || isPlacingBet}
                className="w-full"
              >
                {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-bets" className="space-y-4">
          <div className="space-y-4">
            {getWinningBets().length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Trophy className="h-5 w-5" />
                    Winning Bets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getWinningBets().map((bet) => (
                    <div key={bet.id} className="flex items-center justify-between p-2 bg-white rounded-md">
                      <div>
                        <p className="font-medium">{bet.eventId}</p>
                        <p className="text-sm text-muted-foreground">
                          Bet on {bet.team} - {bet.amount} BET11
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleClaimWinnings(bet.id)}
                        disabled={isClaiming}
                      >
                        {isClaiming ? 'Claiming...' : 'Claim'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All My Bets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBets.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No bets placed yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userBets.map((bet) => (
                      <div key={bet.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{bet.eventId}</p>
                          <p className="text-sm text-muted-foreground">
                            {bet.team} - {bet.amount} BET11
                          </p>
                          <p className="text-xs text-muted-foreground">{bet.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {bet.isWinner && (
                            <Badge variant="default" className="bg-green-500">
                              Winner
                            </Badge>
                          )}
                          {bet.isClaimed && (
                            <Badge variant="secondary">Claimed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 