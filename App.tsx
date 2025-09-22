
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, CardStatus } from './types';
import type { CardInfo, UserData } from './types';
import Card from './components/Card';
import UserDataForm from './components/UserDataForm';
import UserDataExport from './components/UserDataExport';

const GAME_DURATION = 35; // seconds

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.SETUP);
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  // Timer effect
  useEffect(() => {
    if (gameStatus !== GameStatus.PLAYING) {
      return;
    }

    if (timeLeft <= 0) {
      setGameStatus(GameStatus.LOST);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameStatus, timeLeft]);

  // Match checking effect
  useEffect(() => {
    if (flippedCardIds.length !== 2) {
      return;
    }

    const [firstId, secondId] = flippedCardIds;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard && secondCard) {
      if (firstCard.imageId === secondCard.imageId) {
        // Match found
        setCards(prevCards =>
          prevCards.map(card =>
            card.imageId === firstCard.imageId ? { ...card, status: CardStatus.MATCHED } : card
          )
        );
        setFlippedCardIds([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId ? { ...card, status: CardStatus.HIDDEN } : card
            )
          );
          setFlippedCardIds([]);
        }, 1000);
      }
    }
  }, [flippedCardIds, cards]);
  
  // Win condition check
  useEffect(() => {
      if(cards.length > 0 && cards.every(card => card.status === CardStatus.MATCHED)) {
          setGameStatus(GameStatus.WON);
      }
  }, [cards]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length === 5) {
      setImageFiles(Array.from(files));
      setError('');
    } else {
      setError('Por favor, selecciona exactamente 5 imágenes.');
    }
  };

  const startGame = () => {
    if (imageFiles.length !== 5) {
      setError('Por favor, carga 5 imágenes para empezar.');
      return;
    }

    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
    const gameCards: CardInfo[] = [];
    
    imageUrls.forEach((url, index) => {
        gameCards.push({ id: index * 2, imageId: index, imageUrl: url, status: CardStatus.HIDDEN });
        gameCards.push({ id: index * 2 + 1, imageId: index, imageUrl: url, status: CardStatus.HIDDEN });
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setTimeLeft(GAME_DURATION);
    setGameStatus(GameStatus.PLAYING);
  };

  const handleCardClick = (id: number) => {
    if (flippedCardIds.length < 2 && cards.find(c => c.id === id)?.status === CardStatus.HIDDEN) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === id ? { ...card, status: CardStatus.VISIBLE } : card
          )
        );
        setFlippedCardIds(prev => [...prev, id]);
    }
  };

  const handleFormSubmit = (data: UserData) => {
    setUserData(prevData => [...prevData, data]);
  };

  const resetGame = () => {
    setGameStatus(GameStatus.SETUP);
    setCards([]);
    setFlippedCardIds([]);
    setTimeLeft(GAME_DURATION);
    setImageFiles([]);
    setError('');
  };
  
  const renderGameStatus = () => {
      let message = '';
      let messageColor = '';
      if(gameStatus === GameStatus.WON) {
          message = '¡Felicidades, ganaste!';
          messageColor = 'text-green-400';
      } else if (gameStatus === GameStatus.LOST) {
          message = '¡Se acabó el tiempo!';
          messageColor = 'text-yellow-400';
      }

      if (message) {
          return (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
                <div className={`text-5xl font-extrabold mb-6 ${messageColor}`}>{message}</div>
                <UserDataForm onFormSubmit={handleFormSubmit} onPlayAgain={resetGame} />
            </div>
          );
      }
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
          Geosistemas
        </h1>
        <p className="text-xl text-gray-400 mt-2">Juego de Memoria</p>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center">
        {gameStatus === GameStatus.SETUP && (
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Prepara el Juego</h2>
            <p className="text-gray-400 mb-6">Sube 5 imágenes para crear las cartas del juego.</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 mb-4"
            />
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mb-4">
                {imageFiles.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`preview-${index}`} className="w-full h-16 object-cover rounded"/>
                ))}
              </div>
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={startGame}
              disabled={imageFiles.length !== 5}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
            >
              Comenzar Juego
            </button>
             <UserDataExport data={userData} />
          </div>
        )}

        {gameStatus === GameStatus.PLAYING && (
          <div className="w-full relative">
             <div className="mb-4 text-center">
                <p className="text-3xl font-mono" style={{color: timeLeft <= 10 ? '#ef4444' : '#f3f4f6'}}>
                    Tiempo: <span className="font-bold">{timeLeft}s</span>
                </p>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full max-w-3xl mx-auto aspect-[5/2]">
              {cards.map(card => (
                <Card key={card.id} card={card} onCardClick={handleCardClick} />
              ))}
            </div>
          </div>
        )}

        {renderGameStatus()}
      </main>
    </div>
  );
};

export default App;
