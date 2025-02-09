import React, { useState } from 'react';
import { useQuery } from "@apollo/client";
import { GET_TOP_PLAYERS_BY_PAYOUT, GET_TOP_PLAYERS_BY_BET, GET_TOP_PLAYERS_BY_WINS } from "../client/queries";

// Define Player Data Interface
interface PlayerData {
  player: string;
  betAmount?: number;
  winAmount?: number;
  payoutAmount?: number;
}

const Leaderb = () => {
  const SUPPORTED_TOKENS = {
    STABLEAI: "0x07F41412697D14981e770b6E335051b1231A2bA8",
    DIG: "0x208561379990f106E6cD59dDc14dFB1F290016aF",
    WEB9: "0x09CA293757C6ce06df17B96fbcD9c5f767f4b2E1",
    BNKR: "0x22aF33FE49fD1Fa80c7149773dDe5890D3c76F3b",
    FED: "0x19975a01B71D4674325bd315E278710bc36D8e5f",
    RaTcHeT: "0x1d35741c51fb615ca70e28d3321f6f01e8d8a12d",
    GIRTH: "0xa97d71a5fdf906034d9d121ed389665427917ee4",
  };

  // Utility function to convert Wei to Ether
const weiToEther = (wei: string) => {
  const weiValue = BigInt(wei);
  const etherValue = Number(weiValue) / 1e18; // Convert Wei to Ether (1 Ether = 10^18 Wei)
  return etherValue.toFixed(0); // Return with 4 decimal places
};

  const [tokenAddress, setTokenAddress] = useState(SUPPORTED_TOKENS.STABLEAI);
  const [category, setCategory] = useState("Bet"); // Default to "Bet"

  // Query selection based on category
  const { loading, error, data } = useQuery(
    category === "Bet" ? GET_TOP_PLAYERS_BY_BET :
    category === "Win" ? GET_TOP_PLAYERS_BY_WINS :
    GET_TOP_PLAYERS_BY_PAYOUT,
    { variables: { tokenAddress } }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Determine the merged data based on selected category
  const mergedData = category === "Bet" ? data.playerBets :
                      category === "Win" ? data.playerWins :
                      data.playerPayouts;

  // Utility function to format the player address
const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};


  return (
    <div className="bg-background p-4 rounded-lg shadow-lg"> 
    <h1 className='text-2xl font-semibold'>Leaderboard</h1>
      <div className="flex justify-between mb-4">
       
        <select
          className="border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Bet">Bet</option>
          <option value="Win">Win</option>
          <option value="Payout">Payout</option>
        </select>

        {/* Dropdown for selecting token address */}
        <select
          className="border rounded p-2"
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

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10">
              <th className="px-6 py-4   text-black">Player</th>
              <th className="px-6 py-4    text-black">{category}</th>
            </tr>
          </thead>
          <tbody>
  {/* Check if there is no data */}
  {mergedData && mergedData.length > 0 ? (
    mergedData.map((item: any, index: number) => {
      const playerAddress = item.id.split('-')[0]; // Extract player address from the ID
      return (
        <tr key={index} className="border-b border-border">
          <td className="px-6 py-4  ">{formatAddress(playerAddress)}</td> {/* Display formatted player address */}
          <td className="px-6 py-4  ">
            {category === "Bet" ? 
              weiToEther(item.betAmount) :  // Convert betAmount to Ether
              category === "Win" ? item.winAmount :
              category === "Payout" ? item.payoutAmount : null}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={2} className="py-2 text-center">No players found for this selection.</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Leaderb;
