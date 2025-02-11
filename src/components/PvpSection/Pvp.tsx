import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, PlusCircle, Trophy, Info, Gamepad, User } from "lucide-react";
import GameList from "./components/Available";
import CreateGame from "./components/CreateGame";
import Leaderb from "./components/Leaderb";
import Gameinfo from "./components/GameStat";
import MyGame from "./components/MyGame";
import Modal from "./components/Modal";

const Pvp = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const openModal = (content: JSX.Element) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-black text-purple-50">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Gamepad className="w-8 h-8 text-purple-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  FlipIt PVP
                </h1>
              </div>
              
            <appkit-connect-button
            size="sm"
            />
            
              <Link to="/">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-purple-200 hover:bg-purple-800/50 transition-all duration-300">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => openModal(<CreateGame />)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Game</span>
            </button>
            <button
              onClick={() => openModal(<MyGame />)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span>My Games</span>
            </button>
          </div>

          {/* Game List */}
          <div className="bg-purple-900/50 border border-purple-800/50 rounded-xl shadow-xl backdrop-blur-sm mb-8 p-6">
            <GameList />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openModal(<Gameinfo />)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-purple-600 text-purple-200 hover:bg-purple-800/50 transition-all duration-300"
            >
              <Info className="w-4 h-4" />
              <span>Game Info</span>
            </button>
            <button
              onClick={() => openModal(<Leaderb />)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-purple-600 text-purple-200 hover:bg-purple-800/50 transition-all duration-300"
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        showModal={showModal}
        closeModal={closeModal}
        content={modalContent}
      />
    </div>
  );
};

export default Pvp;
