import { useState, useEffect } from 'react';
import GameList from './components/Available';
import CreateGame from './components/CreateGame';
import Leaderb from './components/Leaderb';
import Gameinfo from './components/GameStat';
import MyGame from './components/MyGame';
import Modal from './components/Modal';
import useCSSVariables from '../../hooks/useCSSVariables';

const Pvp: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null); // Store the content to show in the modal

  const openModal = (content: JSX.Element) => {
    setModalContent(content); // Set the modal content based on clicked link
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setModalContent(null); // Reset the content
  };


  // Use the custom hook to get the color variables
  const { primary, primaryForeground, secondary, background } = useCSSVariables();
  // Use effect to log and ensure the color variables are being accessed
  useEffect(() => {
 
  }, [primary, primaryForeground, secondary, background]);

  return (
    <>
      {/* Ensure this div has full height */}
      <div className="bg-purple-700 min-h-screen flex flex-col p-2">
        <header className=" flex justify-between items-center mb-4 p-5 ">
         
          <h1 className="pl-8 ml-2 text-2xl font-bold text-purple-100">logo <span className="text-purple-400">pvp</span></h1>
          <div>
            <a href="/" className="bg-purple-500 text-purple-100 px-4 mr-10 py-2 pr-8 rounded ">Back to Home</a>
          </div>
          
        </header>

        <nav className="mb-4 flex justify-center ">
          <div className='mr-10'>
            <button onClick={() => openModal(<CreateGame />)} className="bg-purple-300 text-purple-100 px-4 py-2 rounded hover:bg-blue-600">CreateGame</button>
          </div>
          <div className='ml-10'>
            <button onClick={() => openModal(<MyGame />)} className="bg-purple-300 text-purple-100 px-4 py-2 rounded hover:bg-blue-600">MyGame</button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-grow">
          <GameList />
        </div>

        {/* Footer */}
        <footer className="flex justify-around mt-4">
          <button onClick={() => openModal(<Gameinfo />)} className="bg-purple-300 text-purple-100 px-4 py-2 rounded hover:bg-blue-600">Game Info</button>
          
          <button onClick={() => openModal(<Leaderb />)} className="bg-purple-300 text-purple-100 px-4 py-2 rounded hover:bg-blue-600">Leaderboard</button>
        </footer>
        
        {/* Modal */}
        <Modal showModal={showModal} closeModal={closeModal} content={modalContent} />
      </div>
    </>
  );
};

export default Pvp;
