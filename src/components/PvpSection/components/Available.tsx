import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_GAMES } from "../client/queries";
import { CircleDollarSign, XCircle, GamepadIcon } from "lucide-react";
import { joinGame, resolveGame, claimReward } from "../../../utils/contractFunction";
import client from "../client/apollo-client";

interface Available {
  id: string;
  gameId: string;
  player1: string;
  betAmount: string; // Assuming the bet amount is in Wei
  player1Choice: boolean;
  tokenName: string;
  tokenSymbol: string;
}

// Utility function to convert Wei to Ether
const weiToEther = (wei: string) => {
  const weiValue = BigInt(wei);
  const etherValue = Number(weiValue) / 1e18; // Convert Wei to Ether (1 Ether = 10^18 Wei)
  return etherValue.toFixed(0); // Return with 4 decimal places
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-8">
    <div className="coin">
      <div className="coin-face coin-front">
        <CircleDollarSign className="w-full h-full text-white/90 p-6" />
      </div>
      <div className="coin-face coin-back">
        <CircleDollarSign className="w-full h-full text-white/90 p-6" />
      </div>
    </div>
    <span className="text-xl font-semibold loading-text">
      Loading available games...
    </span>
  </div>
);

function GameList() {
  const { loading, error, data } = useQuery<{ gameCreateds: Available[] }>(GET_AVAILABLE_GAMES, {
    client,
  });

  const [loadingGameId, setLoadingGameId] = useState<number | null>(null);
  const [errorMessage, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5;

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error.message}</div>;

  const games = data?.gameCreateds || [];

  // Sort games by gameId in descending order
  const sortedGames = [...games].sort((a, b) => Number(b.gameId) - Number(a.gameId));

  // Pagination Logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame);

  // Handle joining a game
  const handleJoinGame = async (gameId: string) => {
    setLoadingGameId(Number(gameId)); 
    setError(null); 
    try {
      console.log(`Joining game ${gameId}...`);
      await joinGame(gameId);
      console.log(`Successfully joined game ${gameId}`);
    } catch (err: any) {
      console.error("Error joining game:", err);
      setError(err instanceof Error ? `Failed to join game: ${err.message}` : "An unknown error occurred while trying to join the game.");
    } finally {
      setLoadingGameId(null); 
    }
  };

  // Handle resolving a game
  const handleResolveGame = async (gameId: string) => {
    try {
      console.log(`Resolving game ${gameId}...`);
      await resolveGame(gameId);
      console.log(`Successfully resolved game ${gameId}`);
    } catch (err: any) {
      console.error("Error resolving game:", err);
      setError(err instanceof Error ? `Failed to resolve game: ${err.message}` : "Failed to resolve game: An unknown error occurred.");
    }
  };

  // Handle claiming a reward
  const handleClaimReward = async (gameId: string) => {
    try {
      console.log(`Claiming reward for game ${gameId}...`);
      await claimReward(gameId);
      console.log(`Successfully claimed reward for game ${gameId}`);
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      setError(err instanceof Error ? `Failed to claim reward: ${err.message}` : "Failed to claim reward: An unknown error occurred.");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="pl-6 pr-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Display Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
            <p className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {errorMessage}
            </p>
          </div>
        )}

        {/* Table and other UI */}
        {games?.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-8 text-center">
            <GamepadIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Available Games
            </h3>
            <p className="text-white/70">
              There are currently no active games to join. Check back later or
              create a game.
            </p>
          </div>
        ) : (
<div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Game ID</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Required Bet</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Token Name</th>
          <th className="px-6 py-4 text-left text-sm font-semibold text-white">P1 Choice</th>
          <th className="px-6 py-4 text-center text-sm font-semibold text-white">Join</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {currentGames?.map((game) => (
          <tr key={game.id} className="bg-white/10">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{game.gameId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{weiToEther(game.betAmount)} {game.tokenSymbol}</td> 
            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{game.tokenName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{game.player1Choice ? "Head" : "Tail"}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-white">
              <button
                onClick={() => handleJoinGame(game.gameId)}
                className="text-white hover:text-white/90 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
              >
                {loadingGameId === Number(game.gameId) ? "Joining..." : "Join"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg"
              >
                Previous
              </button>
              <span className="text-white">{`Page ${currentPage}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={indexOfLastGame >= games.length}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameList;
