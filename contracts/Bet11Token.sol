// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Bet11Token is ERC20, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Token details
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant BETTING_FEE = 2; // 2% fee on bets
    
    // Betting structures
    struct Bet {
        uint256 id;
        address bettor;
        uint256 amount;
        string eventId;
        string team;
        bool isWinner;
        bool isClaimed;
        uint256 timestamp;
    }
    
    struct BettingEvent {
        string eventId;
        string teamA;
        string teamB;
        uint256 totalPool;
        uint256 teamAPool;
        uint256 teamBPool;
        bool isActive;
        bool isResolved;
        string winner;
        uint256 endTime;
    }
    
    // State variables
    Counters.Counter private _betIds;
    Counters.Counter private _eventIds;
    
    mapping(uint256 => Bet) public bets;
    mapping(string => BettingEvent) public bettingEvents;
    mapping(address => uint256[]) public userBets;
    mapping(string => uint256[]) public eventBets;
    
    // Events
    event BetPlaced(uint256 betId, address bettor, string eventId, string team, uint256 amount);
    event BetClaimed(uint256 betId, address bettor, uint256 winnings);
    event EventCreated(string eventId, string teamA, string teamB, uint256 endTime);
    event EventResolved(string eventId, string winner);
    event TokensMinted(address to, uint256 amount);
    event TokensBurned(address from, uint256 amount);
    
    constructor() ERC20("Bet11 Token", "BET11") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    // Modifiers
    modifier eventExists(string memory eventId) {
        require(bytes(bettingEvents[eventId].eventId).length > 0, "Event does not exist");
        _;
    }
    
    modifier eventActive(string memory eventId) {
        require(bettingEvents[eventId].isActive, "Event is not active");
        _;
    }
    
    modifier eventNotResolved(string memory eventId) {
        require(!bettingEvents[eventId].isResolved, "Event is already resolved");
        _;
    }
    
    // Core functions
    function createBettingEvent(
        string memory eventId,
        string memory teamA,
        string memory teamB,
        uint256 duration
    ) external onlyOwner {
        require(bytes(bettingEvents[eventId].eventId).length == 0, "Event already exists");
        require(duration > 0, "Duration must be greater than 0");
        
        bettingEvents[eventId] = BettingEvent({
            eventId: eventId,
            teamA: teamA,
            teamB: teamB,
            totalPool: 0,
            teamAPool: 0,
            teamBPool: 0,
            isActive: true,
            isResolved: false,
            winner: "",
            endTime: block.timestamp + duration
        });
        
        emit EventCreated(eventId, teamA, teamB, block.timestamp + duration);
    }
    
    function placeBet(
        string memory eventId,
        string memory team
    ) external eventExists(eventId) eventActive(eventId) eventNotResolved(eventId) nonReentrant {
        BettingEvent storage event_ = bettingEvents[eventId];
        require(block.timestamp < event_.endTime, "Betting period has ended");
        require(
            keccak256(bytes(team)) == keccak256(bytes(event_.teamA)) ||
            keccak256(bytes(team)) == keccak256(bytes(event_.teamB)),
            "Invalid team selection"
        );
        
        uint256 betAmount = balanceOf(msg.sender);
        require(betAmount > 0, "Insufficient tokens to bet");
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), betAmount);
        
        // Create bet
        _betIds.increment();
        uint256 betId = _betIds.current();
        
        bets[betId] = Bet({
            id: betId,
            bettor: msg.sender,
            amount: betAmount,
            eventId: eventId,
            team: team,
            isWinner: false,
            isClaimed: false,
            timestamp: block.timestamp
        });
        
        // Update pools
        event_.totalPool += betAmount;
        if (keccak256(bytes(team)) == keccak256(bytes(event_.teamA))) {
            event_.teamAPool += betAmount;
        } else {
            event_.teamBPool += betAmount;
        }
        
        // Update mappings
        userBets[msg.sender].push(betId);
        eventBets[eventId].push(betId);
        
        emit BetPlaced(betId, msg.sender, eventId, team, betAmount);
    }
    
    function resolveEvent(string memory eventId, string memory winner) 
        external 
        onlyOwner 
        eventExists(eventId) 
        eventNotResolved(eventId) 
    {
        BettingEvent storage event_ = bettingEvents[eventId];
        require(
            keccak256(bytes(winner)) == keccak256(bytes(event_.teamA)) ||
            keccak256(bytes(winner)) == keccak256(bytes(event_.teamB)),
            "Invalid winner"
        );
        
        event_.isResolved = true;
        event_.isActive = false;
        event_.winner = winner;
        
        // Mark winning bets
        uint256[] memory betIds = eventBets[eventId];
        for (uint256 i = 0; i < betIds.length; i++) {
            Bet storage bet = bets[betIds[i]];
            if (keccak256(bytes(bet.team)) == keccak256(bytes(winner))) {
                bet.isWinner = true;
            }
        }
        
        emit EventResolved(eventId, winner);
    }
    
    function claimWinnings(uint256 betId) external nonReentrant {
        Bet storage bet = bets[betId];
        require(bet.bettor == msg.sender, "Not your bet");
        require(bet.isWinner, "Bet is not a winner");
        require(!bet.isClaimed, "Winnings already claimed");
        require(bettingEvents[bet.eventId].isResolved, "Event not resolved");
        
        bet.isClaimed = true;
        
        BettingEvent storage event_ = bettingEvents[bet.eventId];
        uint256 totalWinningPool = 0;
        uint256 userWinningAmount = 0;
        
        // Calculate total winning pool
        uint256[] memory betIds = eventBets[bet.eventId];
        for (uint256 i = 0; i < betIds.length; i++) {
            Bet storage currentBet = bets[betIds[i]];
            if (currentBet.isWinner) {
                totalWinningPool += currentBet.amount;
            }
        }
        
        // Calculate user's share of winnings
        if (totalWinningPool > 0) {
            userWinningAmount = (event_.totalPool * bet.amount) / totalWinningPool;
        }
        
        // Apply fee
        uint256 fee = (userWinningAmount * BETTING_FEE) / 100;
        uint256 netWinnings = userWinningAmount - fee;
        
        // Transfer winnings
        _transfer(address(this), msg.sender, netWinnings);
        
        // Transfer fee to owner
        _transfer(address(this), owner(), fee);
        
        emit BetClaimed(betId, msg.sender, netWinnings);
    }
    
    // Admin functions
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }
    
    function pauseEvent(string memory eventId) external onlyOwner eventExists(eventId) {
        bettingEvents[eventId].isActive = false;
    }
    
    function activateEvent(string memory eventId) external onlyOwner eventExists(eventId) {
        require(!bettingEvents[eventId].isResolved, "Cannot activate resolved event");
        bettingEvents[eventId].isActive = true;
    }
    
    // View functions
    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
    
    function getBettingEvent(string memory eventId) external view returns (BettingEvent memory) {
        return bettingEvents[eventId];
    }
    
    function getUserBets(address user) external view returns (uint256[] memory) {
        return userBets[user];
    }
    
    function getEventBets(string memory eventId) external view returns (uint256[] memory) {
        return eventBets[eventId];
    }
    
    function getContractBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }
    
    function getTotalBets() external view returns (uint256) {
        return _betIds.current();
    }
} 