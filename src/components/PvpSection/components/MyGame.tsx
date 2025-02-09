import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAppKitAccount } from '@reown/appkit/react';

const GET_GAMES_CREATED = gql`
  query GetGamesCreated($playerAddress: Bytes!) {
    gameCreateds(where: { player1: $playerAddress }) {
      gameId
      betAmount
      player1Choice
      tokenAddress
    }
  }
`;

const GET_GAMES_JOINED = gql`
  query GetGamesJoined($playerAddress: Bytes!) {
    gameJoineds(where: { player2: $playerAddress }) {
      gameId
      betAmount
    }
  }
`;

const GET_GAMES_RESOLVED = gql`
  query GetGamesResolved($playerAddress: Bytes!) {
    gameResolveds(where: { winner: $playerAddress }) {
      gameId
      betAmount
      payout
    }
  }
`;

// Define TypeScript types for game data
interface GameCreated {
  gameId: string;
  betAmount: string;
  player1Choice: string;
  tokenAddress: string;
}

interface GameJoined {
  gameId: string;
  betAmount: string;
}

interface GameResolved {
  gameId: string;
  betAmount: string;
  payout: string;
}

const MyGame = () => {

  const SUPPORTED_TOKENS = {
    STABLEAI: "0x07F41412697D14981e770b6E335051b1231A2bA8",
    DIG: "0x208561379990f106E6cD59dDc14dFB1F290016aF",
    WEB9: "0x09CA293757C6ce06df17B96fbcD9c5f767f4b2E1",
    BNKR: "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b",
    FED: "0x19975a01B71D4674325bd315E278710bc36D8e5f",
    RaTcHeT: "0x1d35741c51fb615ca70e28d3321f6f01e8d8a12d",
    GIRTH: "0xa97d71a5fdf906034d9d121ed389665427917ee4",
  };

  const { address } = useAppKitAccount();


  const [selectedTab, setSelectedTab] = useState<"created" | "joined" | "resolved">("created");



  // Wait until address is available before making queries
  if (!address) {
    return (
      <div>Loading...</div> // Show a loading message until the address is available
    );
  }
  const { data: createdData, loading: loadingCreated } = useQuery<{ gameCreateds: GameCreated[] }>(
    GET_GAMES_CREATED,
    { variables: { playerAddress: address} }
  );

  const { data: joinedData, loading: loadingJoined } = useQuery<{ gameJoineds: GameJoined[] }>(
    GET_GAMES_JOINED,
    { variables: { playerAddress: address } }
  );

  const { data: resolvedData, loading: loadingResolved } = useQuery<{ gameResolveds: GameResolved[] }>(
    GET_GAMES_RESOLVED,
    { variables: {playerAddress: address} }
  );

  // Utility function to convert Wei to Ether
  const weiToEther = (wei: string) => {
    const weiValue = BigInt(wei);
    const etherValue = Number(weiValue) / 1e18; // Convert Wei to Ether (1 Ether = 10^18 Wei)
    return etherValue.toFixed(0); // Return with 4 decimal places
  };

  // Utility function to format the player address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTokenName = (tokenAddress: string) => {
    // Use keyof typeof to restrict the key to be one of the valid tokens
    const tokenName = Object.keys(SUPPORTED_TOKENS).find(
      (key) => SUPPORTED_TOKENS[key as keyof typeof SUPPORTED_TOKENS] === tokenAddress
    );
    return tokenName || "Unknown Token";
  };
  

  // Log data to console for debugging
  useEffect(() => {
    console.log('Created Games Data:', createdData);
    console.log('Joined Games Data:', joinedData);
    console.log('Resolved Games Data:', resolvedData);
  }, [createdData, joinedData, resolvedData]);

  return (
    <div className="bg-background dark:bg-background dark:text-primary-foreground p-4 rounded-lg shadow-md w-full">
      <div className="flex items-center mb-4">
        <img className="w-12 h-12 rounded-full mr-3" src="https://placehold.co/48x48" alt="User Avatar" />
        <div>
          <h2 className="text-lg font-semibold">{formatAddress(address ?? "Unknown address")}</h2>
          <span className="text-muted-foreground">Player balance💰 0</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-between mb-2">
        <button
          className={`px-4 py-2 font-medium ${selectedTab === "created" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setSelectedTab("created")}
        >
          Created
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedTab === "joined" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setSelectedTab("joined")}
        >
          Joined
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedTab === "resolved" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
          onClick={() => setSelectedTab("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 text-muted-foreground">GameId</th>
            <th className="py-2 text-muted-foreground">BetAmount</th>
            {selectedTab === "created" && <th className="py-2 text-muted-foreground">Player1Choice</th>}
            {selectedTab === "created" && <th className="py-2 text-muted-foreground">TokenName</th>}
            {selectedTab === "resolved" && <th className="py-2 text-muted-foreground">Payout</th>}
          </tr>
        </thead>
        <tbody>
          {/* Render Created Games */}
          {selectedTab === "created" &&
            (loadingCreated ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Loading Created Games...
                </td>
              </tr>
            ) : (
              createdData?.gameCreateds.map((game) => (
                <tr key={game.gameId} className="border-b border-border">
                  <td className="py-2">{game.gameId}</td>
                  <td className="py-2">{weiToEther(game.betAmount)}</td>
                  <td className="py-2">{game.player1Choice ? "Head" : "Tail"}</td>
                  <td className="py-2">{getTokenName(game.tokenAddress)}</td>
                </tr>
              ))
            ))}

          {/* Render Joined Games */}
          {selectedTab === "joined" &&
            (loadingJoined ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Loading Joined Games...
                </td>
              </tr>
            ) : (
              joinedData?.gameJoineds.map((game) => (
                <tr key={game.gameId} className="border-b border-border">
                  <td className="py-2">{game.gameId}</td>
                  <td className="py-2">{weiToEther(game.betAmount)}</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                </tr>
              ))
            ))}

          {/* Render Resolved Games */}
          {selectedTab === "resolved" &&
            (loadingResolved ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Loading Resolved Games...
                </td>
              </tr>
            ) : (
              resolvedData?.gameResolveds.map((game) => (
                <tr key={game.gameId} className="border-b border-border">
                  <td className="py-2">{game.gameId}</td>
                  <td className="py-2">{weiToEther(game.betAmount)}</td>
                  <td className="py-2">{game.payout}</td>
                </tr>
              ))
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyGame;
