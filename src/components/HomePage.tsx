import { Link } from "react-router-dom";
import { Swords, Bot, Coins } from "lucide-react";
import { useDisconnect, useAppKit, useAppKitNetwork  } from '@reown/appkit/react'

const HomePage = () => {
  const { open } = useAppKit();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-[float_5s_ease-in-out_infinite]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.2,
          }}
        />
      ))}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Coins className="w-8 h-8 text-purple-300" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              FlipIt
            </h1>
          </div>
          <div className="red">
<button onClick={() => open()}>Open</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-16 animate-[fadeIn_1s_ease-out]">
          <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300">
            Welcome to the Future of Flipping
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Experience the thrill of the flip in a whole new dimension
          </p>
        </div>

        {/* Spinning Coin */}
        <div className="mb-16">
          <div className="w-40 h-40 animate-[spin_2s_linear_infinite] rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center">
            <div className="text-yellow-700 font-bold text-6xl">₿</div>
          </div>
        </div>

        {/* Game Mode Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Link to="/vs-com">
            <button className="group relative px-8 py-4 w-64 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="flex items-center justify-center gap-3">
                <Bot className="w-6 h-6" />
                <span>VS Computer</span>
              </div>
            </button>
          </Link>

          <Link to="/pvp">
            <button className="group relative px-8 py-4 w-64 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="flex items-center justify-center gap-3">
                <Swords className="w-6 h-6" />
                <span>PVP Battle</span>
              </div>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
