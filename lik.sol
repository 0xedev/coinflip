// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PvpFlipGame is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    enum GameState {
        CREATED, // Initial state when game is created
        JOINED, // Player 2 has joined and deposited
        RESOLVED, // Game result is determined
        COMPLETED // All rewards have been claimed
    }

    mapping(uint256 => Game) public games;
    uint256 public gameIdCounter;

    address public treasury;
    mapping(address => bool) public supportedTokens;
    mapping(address => string) public tokenNames;
    address[] public supportedTokenAddresses;

    struct Game {
        address player1;
        address player2;
        uint256 betAmount;
        address tokenAddress;
        GameState state;
        bool player1Choice;
        uint256 createdAt;
        uint256 timeoutDuration;
        address winner; // Track the winner
        uint256 winAmount; // Track the winning amount
    }

    // Events
    event GameCreated(
        uint256 indexed gameId,
        address indexed player1,
        uint256 betAmount,
        address indexed tokenAddress,
        bool player1Choice
    );

    event GameJoined(
        uint256 indexed gameId,
        address indexed player1,
        address indexed player2,
        uint256 betAmount,
        address tokenAddress
    );

    event GameResolved(
        uint256 indexed gameId,
        address indexed winner,
        uint256 payout
    );

    event RewardClaimed(
        uint256 indexed gameId,
        address indexed player,
        uint256 amount
    );

    event TokenAdded(address indexed tokenAddress, string tokenName);

    event TokenRemoved(address indexed tokenAddress);

    constructor(address initialOwner) Ownable(initialOwner) {
        treasury = address(this);
    }

    modifier onlyPlayer1(uint256 gameId) {
        require(
            msg.sender == games[gameId].player1,
            "Only Player 1 can call this"
        );
        _;
    }

    modifier gameExists(uint256 gameId) {
        require(games[gameId].player1 != address(0), "Game does not exist");
        _;
    }

    modifier inState(uint256 gameId, GameState state) {
        require(games[gameId].state == state, "Invalid game state");
        _;
    }

    modifier tokenSupported(address tokenAddress) {
        require(supportedTokens[tokenAddress], "Token is not supported");
        _;
    }

    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function addSupportedToken(
        address tokenAddress,
        string calldata tokenName
    ) external onlyOwner {
        require(!supportedTokens[tokenAddress], "Token already supported");
        require(tokenAddress != address(0), "Invalid token address");
        require(isContract(tokenAddress), "Address is not a contract");
        supportedTokens[tokenAddress] = true;
        tokenNames[tokenAddress] = tokenName;
        supportedTokenAddresses.push(tokenAddress);
        emit TokenAdded(tokenAddress, tokenName);
    }

    function removeSupportedToken(address tokenAddress) external onlyOwner {
        require(supportedTokens[tokenAddress], "Token not supported");
        supportedTokens[tokenAddress] = false;
        delete tokenNames[tokenAddress];

        for (uint i = 0; i < supportedTokenAddresses.length; i++) {
            if (supportedTokenAddresses[i] == tokenAddress) {
                supportedTokenAddresses[i] = supportedTokenAddresses[
                    supportedTokenAddresses.length - 1
                ];
                supportedTokenAddresses.pop();
                break;
            }
        }

        emit TokenRemoved(tokenAddress);
    }

    function createGame(
        uint256 betAmount,
        address tokenAddress,
        bool player1Choice,
        uint256 timeoutDuration
    ) external tokenSupported(tokenAddress) {
        require(betAmount > 0, "Bet amount must be greater than zero");

        IERC20 token = IERC20(tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), betAmount),
            "Token transfer failed"
        );

        uint256 gameId = gameIdCounter++;
        Game storage newGame = games[gameId];
        newGame.player1 = msg.sender;
        newGame.betAmount = betAmount;
        newGame.tokenAddress = tokenAddress;
        newGame.state = GameState.CREATED;
        newGame.player1Choice = player1Choice;
        newGame.createdAt = block.timestamp;
        newGame.timeoutDuration = timeoutDuration;

        emit GameCreated(
            gameId,
            msg.sender,
            betAmount,
            tokenAddress,
            player1Choice
        );
    }

    function joinGame(
        uint256 gameId
    ) external gameExists(gameId) inState(gameId, GameState.CREATED) {
        Game storage game = games[gameId];
        require(
            block.timestamp <= game.createdAt + game.timeoutDuration,
            "Game has expired"
        );
        require(
            msg.sender != game.player1,
            "Player 1 cannot join their own game"
        );

        IERC20 token = IERC20(game.tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), game.betAmount),
            "Token transfer failed"
        );

        game.player2 = msg.sender;
        game.state = GameState.JOINED;

        emit GameJoined(
            gameId,
            game.player1,
            msg.sender,
            game.betAmount,
            game.tokenAddress
        );
    }

    function resolveGame(
        uint256 gameId
    )
        external
        gameExists(gameId)
        inState(gameId, GameState.JOINED)
        nonReentrant
    {
        Game storage game = games[gameId];

        // Generate random result using multiple entropy sources
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    blockhash(block.number - 1),
                    gameId
                )
            )
        );

        bool coinFlipResult = (randomNumber % 2) == 1;
        bool didPlayer1Win = (coinFlipResult == game.player1Choice);

        // Calculate winnings
        uint256 totalPot = game.betAmount * 2;
        uint256 treasuryCut = (totalPot * 10) / 100; // 10% to treasury
        uint256 winAmount = totalPot - treasuryCut;

        // Store winner and winning amount
        game.winner = didPlayer1Win ? game.player1 : game.player2;
        game.winAmount = winAmount;

        game.state = GameState.COMPLETED;

        // Transfer treasury cut
        IERC20(game.tokenAddress).safeTransfer(treasury, treasuryCut);

        // Automatically send to winner
        IERC20(game.tokenAddress).safeTransfer(game.winner, winAmount);

        emit GameResolved(gameId, game.winner, winAmount);
        emit RewardClaimed(gameId, game.winner, winAmount); // Emit RewardClaimed event too
    }

    function cancelGame(uint256 gameId) external gameExists(gameId) {
        Game storage game = games[gameId];
        require(msg.sender == game.player1, "Only Player 1 can cancel");
        require(
            game.state == GameState.CREATED,
            "Can only cancel unmatched games"
        );
        require(
            block.timestamp > game.createdAt + game.timeoutDuration,
            "Game has not expired yet"
        );

        // Refund Player 1
        IERC20(game.tokenAddress).safeTransfer(game.player1, game.betAmount);
        game.state = GameState.COMPLETED;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
    }

    function withdrawTreasuryFunds(
        address tokenAddress,
        uint256 amount
    ) external onlyOwner {
        require(supportedTokens[tokenAddress], "Token not supported");
        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(treasury) >= amount,
            "Insufficient treasury balance"
        );
        token.safeTransfer(msg.sender, amount);
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokenAddresses;
    }

    function getFullGameDetails(
        uint256 gameId
    )
        external
        view
        returns (
            address player1,
            address player2,
            uint256 betAmount,
            address tokenAddress,
            GameState state,
            bool player1Choice,
            uint256 createdAt,
            uint256 timeoutDuration,
            address winner,
            uint256 winAmount
        )
    {
        Game storage game = games[gameId];
        return (
            game.player1,
            game.player2,
            game.betAmount,
            game.tokenAddress,
            game.state,
            game.player1Choice,
            game.createdAt,
            game.timeoutDuration,
            game.winner,
            game.winAmount
        );
    }
}
