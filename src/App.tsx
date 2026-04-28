/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Undo2, Play } from 'lucide-react';
import { SYMBOLS, Symbol } from './constants';

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [dice, setDice] = useState<number[]>([1, 2, 3]);
  const [history, setHistory] = useState<number[][]>([]);
  const [balance, setBalance] = useState(1000);
  const [isShaking, setIsShaking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAddedToHistory, setHasAddedToHistory] = useState(true);
  const [roundCount, setRoundCount] = useState(0);

  const shakeDice = useCallback(() => {
    if (isShaking) return;

    setIsShaking(true);
    setIsOpen(false);
    setHasAddedToHistory(false);

    // Rule: 3 rounds +3, then 3 rounds +2
    const isPlus3 = Math.floor(roundCount / 3) % 2 === 0;
    const offset = isPlus3 ? 3 : 2;
    
    const sum = dice.reduce((a, b) => a + b, 0);
    const fixedValue = ((sum + offset - 1) % 6) + 1;
    
    setTimeout(() => {
      const randomDie1 = Math.floor(Math.random() * 6) + 1;
      const randomDie2 = Math.floor(Math.random() * 6) + 1;
      const newDice = [fixedValue, randomDie1, randomDie2].sort(() => Math.random() - 0.5);
      setDice(newDice);
      setIsShaking(false);
      setRoundCount(prev => prev + 1);
    }, 1500);
  }, [dice, isShaking, roundCount]);

  const toggleOpen = () => {
    if (isShaking) return;
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    
    if (nextOpen && !hasAddedToHistory) {
      setHistory(prev => [dice, ...prev].slice(0, 10));
      setHasAddedToHistory(true);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" 
           style={{ 
             backgroundImage: 'url(https://raw.githubusercontent.com/BinhPhan75/baucua/main/unnamed.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        
        {/* Falling Gold Coins Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * 400 - 200, opacity: 0 }}
              animate={{ 
                y: 1000, 
                opacity: [0, 1, 1, 0],
                rotate: 360 
              }}
              transition={{ 
                duration: 4 + Math.random() * 4, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="absolute left-1/2 text-xl"
            >
              💰
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center w-full max-w-sm"
        >
          {/* Main Logo Area */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow-500/30 blur-[50px] rounded-full animate-pulse" />
            <motion.img 
              src="https://raw.githubusercontent.com/BinhPhan75/baucua/main/unnamed.png"
              alt="Bau Cua"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Floating Dice */}
          <div className="flex gap-4 mb-10">
            {[2, 3, 1].map((val, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{ 
                  delay: i * 0.2, 
                  repeat: Infinity, 
                  duration: 3.5,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex items-center justify-center border-b-[6px] border-gray-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-200" />
                <img 
                  src={SYMBOLS.find(s => s.value === val)?.image} 
                  alt=""
                  className="w-11 h-11 sm:w-14 sm:h-14 object-contain relative z-10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setGameState('playing')}
            className="group relative bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 text-black font-black text-2xl sm:text-3xl px-12 sm:px-20 py-5 sm:py-6 rounded-full shadow-[0_10px_0_rgb(133,77,14)] active:shadow-none active:translate-y-2 transition-all uppercase tracking-[0.15em] border-2 border-yellow-100/50"
          >
            <span className="relative z-10 drop-shadow-md">CHƠI NGAY</span>
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div className="mt-12 flex gap-5">
             <motion.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border-2 border-yellow-600/40 text-yellow-500 cursor-pointer shadow-xl"
             >
               <Undo2 size={24} />
             </motion.div>
             <motion.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border-2 border-yellow-600/40 text-yellow-500 cursor-pointer shadow-xl"
             >
               <Play size={24} />
             </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 relative overflow-hidden select-none"
         style={{ 
           backgroundImage: 'url(https://raw.githubusercontent.com/BinhPhan75/baucua/main/unnamed.png)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-md flex justify-center items-start mb-3 z-10">
        <div className="bg-gradient-to-b from-[#2a1a0a] to-[#000000] border-2 border-[#b8860b] rounded-full px-8 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <span className="text-[#facc15] font-black text-2xl sm:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wider">
            BẦU CUA 2026
          </span>
        </div>
      </div>

      {/* Centered Previous Result (History) */}
      <div className="w-full max-w-md flex flex-col items-center mb-4 z-10">
        <div className="text-white/70 text-[10px] font-bold tracking-[0.3em] mb-2 uppercase drop-shadow-md">Kết quả ván trước</div>
        <div className="flex gap-2">
          {history[0] ? (
            history[0].map((d, j) => (
              <motion.div 
                key={j} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-28 h-28 sm:w-36 sm:h-36 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl p-2"
              >
                <img 
                  src={SYMBOLS.find(s => s.value === d)?.image} 
                  alt="" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))
          ) : (
            <div className="flex gap-2">
              {[1, 1, 1].map((_, i) => (
                <div key={i} className="w-28 h-28 sm:w-36 sm:h-36 bg-black/30 rounded-2xl border border-white/10 flex items-center justify-center text-white/10 font-black text-2xl">?</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative w-full max-w-md flex flex-col items-center justify-center mb-6">
        {/* Plate */}
        <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] bg-white rounded-full shadow-[0_30px_80px_rgba(0,0,0,0.7)] border-[14px] border-gray-100 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white rounded-full" />
          <div className="absolute inset-2 border-2 border-gray-100/50 rounded-full" />
          
          {/* Dice on Plate */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="flex justify-center">
              {dice[0] && (
                <motion.div
                  key={`0-${dice[0]}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex items-center justify-center border-b-[8px] border-gray-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100" />
                  <img 
                    src={SYMBOLS.find(s => s.value === dice[0])?.image} 
                    alt="" 
                    className="w-30 h-30 sm:w-40 sm:h-40 object-contain relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              )}
            </div>
            <div className="flex gap-1.5">
              {dice.slice(1).map((val, idx) => (
                <motion.div
                  key={`${idx+1}-${val}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex items-center justify-center border-b-[8px] border-gray-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100" />
                  <img 
                    src={SYMBOLS.find(s => s.value === val)?.image} 
                    alt="" 
                    className="w-30 h-30 sm:w-40 sm:h-40 object-contain relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bowl (Nắp) */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ y: -700, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
                }}
                exit={{ y: -700, opacity: 0 }}
                transition={{ 
                  y: { type: 'spring', damping: 22, stiffness: 90 },
                  x: { repeat: isShaking ? Infinity : 0, duration: 0.06 }
                }}
                className="absolute -inset-3 z-20 cursor-pointer flex items-center justify-center"
                onClick={toggleOpen}
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                  <img 
                    src="https://raw.githubusercontent.com/BinhPhan75/baucua/main/napbaucua2.png"
                    alt="Nắp Bầu Cua"
                    className="w-full h-full object-cover drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons Row */}
        <div className="w-full flex justify-between items-center mt-5 px-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setGameState('start')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-gray-800 to-black rounded-full border-2 border-yellow-600/40 flex items-center justify-center text-[#facc15] shadow-xl"
          >
            <Undo2 size={24} />
          </motion.button>

          <button
            onClick={isOpen ? shakeDice : toggleOpen}
            disabled={isShaking}
            className={`relative px-12 sm:px-16 py-4 sm:py-5 rounded-full font-black text-2xl sm:text-3xl shadow-[0_8px_0_rgba(0,0,0,0.5)] transition-all transform active:translate-y-1 active:shadow-none border-2 border-yellow-200/20 overflow-hidden ${
              isShaking 
                ? 'bg-gray-700 text-gray-500' 
                : 'bg-gradient-to-b from-[#5c4433] via-[#2a1a0a] to-[#000000] text-[#facc15]'
            }`}
          >
            <span className="relative z-10 tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {isShaking ? '...' : (isOpen ? 'XÓC' : 'MỞ')}
            </span>
            {!isShaking && (
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
            )}
          </button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-gray-800 to-black rounded-full border-2 border-yellow-600/40 flex items-center justify-center text-[#facc15] shadow-xl"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Betting Grid */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] grid grid-cols-3 gap-2 px-2 mt-auto pb-4">
        {SYMBOLS.map((symbol) => {
          const isWinner = isOpen && dice.includes(symbol.value);
          const winCount = dice.filter(v => v === symbol.value).length;
          
          return (
            <div
              key={symbol.id}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border-2 bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15)] overflow-hidden transition-all p-2 ${
                isWinner ? 'border-red-600 ring-4 ring-red-600/20' : 'border-gray-200'
              }`}
            >
              <img 
                src={symbol.image} 
                alt={symbol.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              
              {isWinner && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <div className="relative">
                    <span className="text-[#ff0000] font-black text-4xl sm:text-5xl italic drop-shadow-[0_0_8px_rgba(255,255,255,1)] select-none" 
                          style={{ 
                            fontFamily: 'serif', 
                            WebkitTextStroke: '1.5px white',
                            paintOrder: 'stroke fill'
                          }}>
                      Win
                    </span>
                    {winCount > 1 && (
                      <div className="absolute -top-3 -right-3 bg-red-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-2 border-white shadow-lg">
                        x{winCount}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-auto py-2 flex flex-col items-center w-full">
        <div className="text-[#facc15]/30 text-[10px] font-black mt-1 tracking-[0.2em] drop-shadow-sm">
          MH1: 967.184
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
