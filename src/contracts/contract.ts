// src/contracts/FlipGameContract.ts
export const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
    ],
    name: "addSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "cancelGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "player1Choice",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "timeoutDuration",
        type: "uint256",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "player1Choice",
        type: "bool",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "GameJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
    ],
    name: "GameResolved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "removeSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "resolveGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newTreasury",
        type: "address",
      },
    ],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
    ],
    name: "TokenAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "TokenRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTreasuryFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gameIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "enum PvpFlipGame.GameState",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "player1Choice",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeoutDuration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "winAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
    ],
    name: "getFullGameDetails",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "enum PvpFlipGame.GameState",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "player1Choice",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeoutDuration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "winAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupportedTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "supportedTokenAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "supportedTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenNames",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// src/contracts/FlipGameContract.ts
export const ADDRESS = "0xEA61dadeBD3077d764A510c6b05a5329Da6A003F";

// Supported tokens -
// 0x07F41412697D14981e770b6E335051b1231A2bA8
// replace with actual token addresses
export const SUPPORTED_TOKENS = {
  STABLEAI: "0x07F41412697D14981e770b6E335051b1231A2bA8",
  DIG: "0x208561379990f106E6cD59dDc14dFB1F290016aF",
  WEB9: "0x09CA293757C6ce06df17B96fbcD9c5f767f4b2E1",
  BNKR: "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b",
  FED: "0x19975a01B71D4674325bd315E278710bc36D8e5f",
  RaTcHeT: "0x1d35741c51fb615ca70e28d3321f6f01e8d8a12d",
  GIRTH: "0xa97d71a5fdf906034d9d121ed389665427917ee4",
};
