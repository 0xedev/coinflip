import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Header */}
      <header className="absolute top-4 left-4 flex items-center space-x-2">
        {/* <img src="#" alt="FlipIt Logo" className="w-6 h-6" /> */}
        <h1 className="text-xl font-bold text-gray-800">Coinflip</h1>
        <a href="/" className="bg-purple-500 text-purple-100 px-4 mr-10 py-2 pr-8 rounded ">Back to Home</a>
      </header>

      {/* Main Content */}
      <main className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome to FlipIt
        </h2>
        <p className="text-gray-600 mb-6">
          Make decisions or just have fun <br /> with a quick flip!
        </p>

        {/* Animated Coin */}
        <div className="coin mx-auto mb-6">
          <div className="coin-face coin-front"></div>
          <div className="coin-face coin-back"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Link to="/vs-com">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
              Vs Com
            </button>
          </Link>
          <Link to="/pvp">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md">
              PVP
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
