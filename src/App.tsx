// import { createAppKit } from "@reown/appkit/react";
// import { WagmiProvider } from "wagmi";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { projectId, metadata, networks, wagmiAdapter } from "./config/config";
// import Navbar from "./components/Navbar";
// import GetGameState from "./components/GetGameState";
// import "./App.css";
// import CreateGame from "./components/CreateGame";
// import Available from "./components/Available";
// // import MyGamesSection from "./components/MyGames";

// const queryClient = new QueryClient();

// const generalConfig = {
//   projectId,
//   metadata,
//   networks,
// };

// // Create modal
// createAppKit({
//   adapters: [wagmiAdapter],
//   ...generalConfig,
// });

// export function App() {
//   return (
//     <div className=" min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
//       <Navbar />
//       <CreateGame />
//       {/* <MyGamesSection /> */}
//       <Available />
//       <div className="container mx-auto px-4 py-8">
//         <WagmiProvider config={wagmiAdapter.wagmiConfig}>
//           <QueryClientProvider client={queryClient}>
//             <GetGameState />
//           </QueryClientProvider>
//         </WagmiProvider>
//       </div>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { projectId, metadata, networks, wagmiAdapter } from "./config/config";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage"; // Importing HomePage
import CreateGame from "./components/CreateGame";
import Available from "./components/Available";
import GetGameState from "./components/GetGameState";
// import MyGamesSection from "./components/MyGames";

import "./App.css";

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  metadata,
  networks,
};

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
});

const PvPSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <CreateGame />
      {/* <MyGamesSection /> */}
      <Available />
      <div className="container mx-auto px-4 py-8">
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <GetGameState />
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pvp" element={<PvPSection />} />
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
