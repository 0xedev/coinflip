import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Home } from "lucide-react"; // Import the Home icon
import {
  GET_TOP_PLAYERS_BY_PAYOUT,
  GET_TOP_PLAYERS_BY_BET,
  GET_TOP_PLAYERS_BY_WINS,
} from "../client/queries";

interface PlayerData {
  id: string;
  betAmount?: string;
  winAmount?: number;
  payoutAmount?: number;
}

interface TokenMap {
  [key: string]: string;
}

type Category = "Bet" | "Win" | "Payout";

const Leaderboard = () => {
  const SUPPORTED_TOKENS: TokenMap = {
    STABLEAI: "0x07F41412697D14981e770b6E335051b1231A2bA8",
    DIG: "0x208561379990f106E6cD59dDc14dFB1F290016aF",
    WEB9: "0x09CA293757C6ce06df17B96fbcD9c5f767f4b2E1",
    BNKR: "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b",
    FED: "0x19975a01B71D4674325bd315E278710bc36D8e5f",
    RaTcHeT: "0x1d35741c51fb615ca70e28d3321f6f01e8d8a12d",
    GIRTH: "0xa97d71a5fdf906034d9d121ed389665427917ee4",
  };

  const [tokenAddress, setTokenAddress] = useState<string>(
    SUPPORTED_TOKENS.STABLEAI
  );
  const [category, setCategory] = useState<Category>("Bet");

  const weiToEther = (wei: string): string => {
    const weiValue = BigInt(wei);
    const etherValue = Number(weiValue) / 1e18;
    return etherValue.toFixed(0);
  };

  const { loading, error, data } = useQuery(
    category === "Bet"
      ? GET_TOP_PLAYERS_BY_BET
      : category === "Win"
      ? GET_TOP_PLAYERS_BY_WINS
      : GET_TOP_PLAYERS_BY_PAYOUT,
    { variables: { tokenAddress } }
  );

  const formatAddress = (address: string): string =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const mergedData: PlayerData[] = data
    ? category === "Bet"
      ? data.playerBets
      : category === "Win"
      ? data.playerWins
      : data.playerPayouts
    : [];

  const getRankEmoji = (index: number): string | number => {
    switch (index) {
      case 0:
        return "🏆";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return index + 1;
    }
  };

  const handleHomeClick = () => {
    // Add your home navigation logic here
    window.location.href = "/";
  };

  if (error)
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="text-red-500">Error: {error.message}</div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleHomeClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go to home"
            >
              <Home className="w-6 h-6 text-purple-500" />
            </button>
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          <select
            className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          >
            {Object.entries(SUPPORTED_TOKENS).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="flex rounded-lg overflow-hidden border">
            {(["Bet", "Win", "Payout"] as Category[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setCategory(tab)}
                className={`flex-1 px-4 py-2 text-center transition-colors ${
                  category === tab
                    ? "bg-purple-500 text-black" // Changed text color to black
                    : "bg-white text-gray-600 hover:bg-purple-50"
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="text-gray-500">Loading leaderboard...</div>
            </div>
          ) : mergedData.length > 0 ? (
            mergedData.map((item: PlayerData, index: number) => {
              const playerAddress = item.id.split("-")[0];
              const value =
                category === "Bet"
                  ? weiToEther(item.betAmount || "0")
                  : category === "Win"
                  ? item.winAmount
                  : item.payoutAmount;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    index < 3
                      ? "bg-gradient-to-r from-purple-50 to-pink-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center text-xl">
                      {getRankEmoji(index)}
                    </div>
                    <div className="font-medium">
                      {formatAddress(playerAddress)}
                    </div>
                  </div>
                  <div className="font-bold">{value}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No players found for this selection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
