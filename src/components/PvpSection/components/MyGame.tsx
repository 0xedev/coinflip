import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAppKitAccount } from "@reown/appkit/react";
import { Trophy, Users, Clock, ArrowUpRight, Gift } from "lucide-react";

// GraphQL queries remain the same
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

// TypeScript interfaces
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

  const  {address}  = useAppKitAccount ();
  const [selectedTab, setSelectedTab] = useState<
    "created" | "joined" | "resolved"
  >("created");

  const { data: createdData, loading: loadingCreated } = useQuery<{
    gameCreateds: GameCreated[];
  }>(GET_GAMES_CREATED, {
    variables: { playerAddress: address },
    skip: !address,
  });

  const { data: joinedData, loading: loadingJoined } = useQuery<{
    gameJoineds: GameJoined[];
  }>(GET_GAMES_JOINED, {
    variables: { playerAddress: address },
    skip: !address,
  });

  const { data: resolvedData, loading: loadingResolved } = useQuery<{
    gameResolveds: GameResolved[];
  }>(GET_GAMES_RESOLVED, {
    variables: { playerAddress: address },
    skip: !address,
  });

  const weiToEther = (wei: string): string => {
    const weiValue = BigInt(wei);
    const etherValue = Number(weiValue) / 1e18;
    return etherValue.toFixed(0);
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTokenName = (tokenAddress: string): string => {
    const tokenName = Object.keys(SUPPORTED_TOKENS).find(
      (key) =>
        SUPPORTED_TOKENS[key as keyof typeof SUPPORTED_TOKENS].toLowerCase() ===
        tokenAddress.toLowerCase()
    );
    return tokenName || "Unknown Token";
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "created",
      label: "Created",
      icon: Clock,
      count: createdData?.gameCreateds.length ?? 0,
    },
    {
      id: "joined",
      label: "Joined",
      icon: Users,
      count: joinedData?.gameJoineds.length ?? 0,
    },
    {
      id: "resolved",
      label: "Resolved",
      icon: Trophy,
      count: resolvedData?.gameResolveds.length ?? 0,
    },
    {
      id: "claimed",
      label: "Claimed",
      icon: Gift,
      count: joinedData?.gameJoineds.length ?? 0,
    },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-black text-xl font-bold">
              {address ? address[3] : "?"}
            </div>
            
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl text-black font-bold">{formatAddress(address)}</h2>
            <div className="flex items-center mt-1 text-gray-600">
              <span className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                Active Player 🎮
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex px-4">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as typeof selectedTab)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors relative ${
                selectedTab === id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bet Amount
                </th>
                {selectedTab === "created" && (
                  <>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Choice
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                  </>
                )}
                {selectedTab === "resolved" && (
                  <>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payout
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim
                </th>
</>
                )}
                {selectedTab === "joined" && (
                  <>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim
                </th>
</>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selectedTab === "created" &&
                (loadingCreated ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading created games...
                    </td>
                  </tr>
                ) : (
                  createdData?.gameCreateds.map((game) => (
                    <tr key={game.gameId} className=" text-black hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{game.gameId}</td>
                      <td className="px-6 py-4">
                        {weiToEther(game.betAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            game.player1Choice
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {game.player1Choice ? "Head" : "Tail"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getTokenName(game.tokenAddress)}
                      </td>
                    </tr>
                  ))
                ))}

              {selectedTab === "joined" &&
                (loadingJoined ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading joined games...
                    </td>
                  </tr>
                ) : (
                  joinedData?.gameJoineds.map((game) => (
                    <tr key={game.gameId} className="text-black  hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{game.gameId}</td>
                      <td className="px-6 py-4">
                        {weiToEther(game.betAmount)}
                      </td>
                    </tr>
                  ))
                ))}

              {selectedTab === "resolved" &&
                (loadingResolved ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading resolved games...
                    </td>
                  </tr>
                ) : (
                  resolvedData?.gameResolveds.map((game) => (
                    <tr key={game.gameId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{game.gameId}</td>
                      <td className="px-6 py-4">
                        {weiToEther(game.betAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">
                          {game.payout}
                        </span>
                      </td>
                    </tr>
                  ))
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyGame;
