import React, { useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { createGame, SUPPORTED_TOKENS } from "../../../utils/contractFunction";
import {
  Coins,
  Loader2,
  Plus,
  AlertCircle,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { ethers } from "ethers";
import {
  publicProvider,
  fallbackProvider,
} from "../../../utils/contractFunction";

interface CreateGameState {
  player1Choice: boolean;
  timeoutDuration: string;
  betAmount: string;
  tokenAddress: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  tokenBalance: string;
  tokenSymbol: string;
}

const CreateGame: React.FC = () => {
  const { address, isConnected } = useAppKitAccount();
  const [state, setState] = useState<CreateGameState>({
    player1Choice: false,
    timeoutDuration: "3600",
    betAmount: "",
    tokenAddress: SUPPORTED_TOKENS.STABLEAI,
    loading: false,
    error: null,
    success: null,
    tokenBalance: "0",
    tokenSymbol: "STABLEAI",
  });

  const fetchTokenBalance = useCallback(async () => {
    if (!address || !state.tokenAddress || !isConnected) return;

    const tokenAbi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function symbol() view returns (string)",
    ];

    try {
      const tokenContract = new ethers.Contract(
        state.tokenAddress,
        tokenAbi,
        publicProvider
      );
      const [balance, symbol] = await Promise.all([
        tokenContract.balanceOf(address),
        tokenContract.symbol(),
      ]);

      setState((prev) => ({
        ...prev,
        tokenBalance: ethers.formatUnits(balance, 18),
        tokenSymbol: symbol,
      }));
    } catch (error) {
      try {
        const fallbackTokenContract = new ethers.Contract(
          state.tokenAddress,
          tokenAbi,
          fallbackProvider
        );
        const [balance, symbol] = await Promise.all([
          fallbackTokenContract.balanceOf(address),
          fallbackTokenContract.symbol(),
        ]);

        setState((prev) => ({
          ...prev,
          tokenBalance: ethers.formatUnits(balance, 18),
          tokenSymbol: symbol,
        }));
      } catch (fallbackError) {
        setState((prev) => ({
          ...prev,
          error: "Failed to fetch token details",
        }));
      }
    }
  }, [address, state.tokenAddress, isConnected]);

  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

  const validateInput = (): string | null => {
    if (!isConnected) return "Please connect your wallet";
    if (!state.betAmount || parseFloat(state.betAmount) <= 0)
      return "Bet amount must be positive";
    if (parseFloat(state.tokenBalance) < parseFloat(state.betAmount)) {
      return `Insufficient ${state.tokenSymbol} balance`;
    }
    if (!state.timeoutDuration || parseInt(state.timeoutDuration) < 300)
      return "Timeout must be at least 5 minutes";
    return null;
  };

  const handleCreateGame = async () => {
    const validationError = validateInput();

    if (validationError) {
      setState((prev) => ({ ...prev, error: validationError }));
      setTimeout(() => setState((prev) => ({ ...prev, error: null })), 3000);
      return;
    }

    setState((prev) => ({
      ...prev,
      error: null,
      success: null,
      loading: true,
    }));

    try {
      await createGame(
        state.tokenAddress,
        state.betAmount,
        state.player1Choice,
        state.timeoutDuration
      );

      setState((prev) => ({
        ...prev,
        success: "Game created successfully!",
        loading: false,
        betAmount: "",
      }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, success: null }));
      }, 5000);

      fetchTokenBalance();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to create game",
        loading: false,
      }));
      setTimeout(() => setState((prev) => ({ ...prev, error: null })), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Coins className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Game
            </h2>
          </div>

          <div className="space-y-6">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Balance
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  {parseFloat(state.tokenBalance).toFixed(4)}{" "}
                  {state.tokenSymbol}
                </span>
              </div>
            </div>

            {/* Bet Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bet Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="0.00"
                  value={state.betAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setState((prev) => ({ ...prev, betAmount: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {state.tokenSymbol}
                </span>
              </div>
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Token
              </label>
              <select
                value={state.tokenAddress}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setState((prev) => ({
                    ...prev,
                    tokenAddress: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {Object.entries(SUPPORTED_TOKENS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeout Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Game Timeout
              </label>
              <select
                value={state.timeoutDuration}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setState((prev) => ({
                    ...prev,
                    timeoutDuration: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="300">5 minutes</option>
                <option value="3600">1 hour</option>
                <option value="86400">24 hours</option>
              </select>
            </div>

            {/* Player Choice */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Choice
              </label>
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, player1Choice: false }))
                  }
                  className={`px-6 py-2 rounded-lg transition-all ${
                    !state.player1Choice
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tails
                </button>
                <button
                  onClick={() =>
                    setState((prev) => ({ ...prev, player1Choice: true }))
                  }
                  className={`px-6 py-2 rounded-lg transition-all ${
                    state.player1Choice
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Heads
                </button>
              </div>
            </div>

            {/* Create Game Button */}
            <button
              onClick={handleCreateGame}
              disabled={state.loading || !isConnected}
              className={`w-full h-12 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all ${
                state.loading || !isConnected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {state.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Game...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Game</span>
                </>
              )}
            </button>

            {/* Status Messages */}
            {state.error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{state.error}</p>
              </div>
            )}

            {state.success && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-bounce-in">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <PartyPopper className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Hurray! 🎉
                    </h3>
                    <p className="text-lg text-gray-600">
                      Game created successfully!
                    </p>
                    <div className="flex gap-2 items-center mt-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-green-600">
                        Your game is ready to play
                      </span>
                    </div>

                    {/* Animated dots */}
                    <div className="flex gap-1 mt-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
