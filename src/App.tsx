/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Undo2, Play } from 'lucide-react';
import { SYMBOLS, Symbol } from './constants';

function Die3D({ value, className = '' }: { value: number; className?: string }) {
  const topSymbol = SYMBOLS.find(s => s.value === value);
  
  // Custom unique mappings for side faces based on standard layout values
  // So they represent other different items (1: Nai, 2: Bau, 3: Ga, 4: Ca, 5: Cua, 6: Tom)
  // Let's make sure the side faces aren't the same as the top face.
  const leftValue = (value % 6) + 1;
  const rightValue = ((value + 1) % 6) + 1;
  
  const leftSymbol = SYMBOLS.find(s => s.value === leftValue);
  const rightSymbol = SYMBOLS.find(s => s.value === rightValue);

  return (
    <div className={`relative cube-3d-container flex items-center justify-center [perspective:1000px] select-none ${className}`}>
      <div 
        className="relative [transform-style:preserve-3d] [transform:rotateX(-60deg)_rotateY(45deg)_rotateZ(0deg)]"
        style={{
          width: 'var(--cube-size, 76px)',
          height: 'var(--cube-size, 76px)',
        }}
      >
        {/* Top Face (the rolled outcome face - highly dominant, facing forward clearly) */}
        <div 
          className="absolute bg-gradient-to-br from-white via-white to-amber-50/15 border-[2px] border-amber-600/35 rounded-none flex items-center justify-center overflow-hidden"
          style={{ 
            width: 'calc(100% + 1.2px)',
            height: 'calc(100% + 1.2px)',
            left: '-0.6px',
            top: '-0.6px',
            transform: 'rotateX(90deg) translateZ(calc(var(--cube-half, 38px)))',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02), 0 3px 8px rgba(0,0,0,0.08)'
          }}
        >
          <img 
            src={topSymbol?.image} 
            alt="" 
            className="w-[95%] h-[95%] object-contain animate-fade-in"
            style={{ transform: 'rotate(45deg)' }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Front-Left Face */}
        <div 
          className="absolute bg-gradient-to-br from-gray-50 via-gray-100 to-amber-100/10 border-[2px] border-amber-600/25 rounded-none flex items-center justify-center overflow-hidden"
          style={{ 
            width: 'calc(100% + 1.2px)',
            height: 'calc(100% + 1.2px)',
            left: '-0.6px',
            top: '-0.6px',
            transform: 'rotateY(-90deg) translateZ(calc(var(--cube-half, 38px)))',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Subtle shading overlay for realistic 3D shadow */}
          <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
          <img 
            src={leftSymbol?.image} 
            alt="" 
            className="w-[90%] h-[90%] object-contain opacity-90"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Front-Right Face */}
        <div 
          className="absolute bg-gradient-to-br from-gray-100 via-gray-200 to-amber-100/15 border-[2px] border-amber-700/25 rounded-none flex items-center justify-center overflow-hidden"
          style={{ 
            width: 'calc(100% + 1.2px)',
            height: 'calc(100% + 1.2px)',
            left: '-0.6px',
            top: '-0.6px',
            transform: 'translateZ(calc(var(--cube-half, 38px)))',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.04)'
          }}
        >
          {/* Slightly darker shading overlay to denote light source direction */}
          <div className="absolute inset-0 bg-black/[0.12] pointer-events-none" />
          <img 
            src={rightSymbol?.image} 
            alt="" 
            className="w-[90%] h-[90%] object-contain opacity-85"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}

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
      <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" 
           style={{ 
             backgroundImage: 'url(https://raw.githubusercontent.com/BinhPhan75/baucua/main/unnamed.png)',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        
        {/* Falling Gold Coins Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
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
          <div className="relative w-48 h-48 sm:w-72 sm:h-72 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-yellow-500/30 blur-[40px] rounded-full animate-pulse" />
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
          <div className="flex gap-3 mb-8">
            {[2, 3, 1].map((val, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{ 
                  delay: i * 0.2, 
                  repeat: Infinity, 
                  duration: 3.5,
                  ease: "easeInOut"
                }}
              >
                <Die3D value={val} className="cube-small" />
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setGameState('playing')}
            className="group relative bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 text-black font-black text-xl sm:text-3xl px-10 sm:px-20 py-4 sm:py-6 rounded-full shadow-[0_8px_0_rgb(133,77,14)] active:shadow-none active:translate-y-2 transition-all uppercase tracking-[0.1em] border-2 border-yellow-100/50"
          >
            <span className="relative z-10 drop-shadow-md">CHƠI NGAY</span>
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div className="mt-8 flex gap-4">
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
    <div className="h-screen flex flex-col items-center p-2 sm:p-4 relative overflow-hidden select-none"
         style={{ 
           backgroundImage: 'url(https://raw.githubusercontent.com/BinhPhan75/baucua/main/unnamed.png)',
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Centered Previous Result (History) */}
      <div className="w-full max-w-sm flex flex-col items-center mb-2 z-10 shrink-0">
        <div className="flex gap-2">
          {history[0] ? (
            history[0].map((d, j) => (
              <motion.div 
                key={j} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 sm:w-44 sm:h-44 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl p-1.5"
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
                <div key={i} className="w-24 h-24 sm:w-44 sm:h-44 bg-black/30 rounded-2xl border border-white/10 flex items-center justify-center text-white/10 font-black text-2xl">?</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center min-h-0 pt-1 pb-1">
        {/* Plate Container - size-responsive using the custom CSS classes */}
        <div className="relative plate-container flex items-center justify-center shrink-0">
          {/* Plate */}
          <div className="absolute inset-0 bg-white rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[10px] border-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white rounded-full" />
            <div className="absolute inset-1.5 border-2 border-gray-100/50 rounded-full" />
            
            {/* Dice on Plate - Spaced triangle layout without overlapping, fully custom responsive inside the .dice-stage class */}
            <div className="relative dice-stage flex items-center justify-center z-10 mx-auto">
              {/* Top-Left Die */}
              {dice[0] && (
                <motion.div
                  key={`0-${dice[0]}`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={isShaking ? {
                    scale: 1,
                    x: [0, -18, 14, -12, 10, -6, 4, 0],
                    y: [0, 8, -14, 10, -8, 6, -4, 0],
                    rotate: [0, -15, 12, -8, 6, 0]
                  } : { scale: 1, rotate: 0 }}
                  transition={isShaking ? { duration: 1.0, repeat: Infinity } : { type: 'spring', damping: 15 }}
                  className="absolute top-0 left-0"
                >
                  <Die3D value={dice[0]} />
                </motion.div>
              )}

              {/* Top-Right Die */}
              {dice[1] && (
                <motion.div
                  key={`1-${dice[1]}`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={isShaking ? {
                    scale: 1,
                    x: [0, 14, -18, 10, -12, 4, -6, 0],
                    y: [0, -10, 14, -8, 10, -4, 6, 0],
                    rotate: [0, 15, -12, 8, -6, 0]
                  } : { scale: 1, rotate: 0 }}
                  transition={isShaking ? { duration: 1.0, delay: 0.05, repeat: Infinity } : { type: 'spring', damping: 15 }}
                  className="absolute top-0 right-0"
                >
                  <Die3D value={dice[1]} />
                </motion.div>
              )}

              {/* Bottom-Center Die */}
              {dice[2] && (
                <motion.div
                  key={`2-${dice[2]}`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={isShaking ? {
                    scale: 1,
                    x: [0, -10, 14, -14, 10, -4, 4, 0],
                    y: [0, 14, -8, 12, -12, 4, -4, 0],
                    rotate: [0, -10, 10, -14, 12, 0]
                  } : { scale: 1, rotate: 0 }}
                  transition={isShaking ? { duration: 1.0, delay: 0.1, repeat: Infinity } : { type: 'spring', damping: 15 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                >
                  <Die3D value={dice[2]} />
                </motion.div>
              )}
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
                className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
                onClick={toggleOpen}
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src="https://raw.githubusercontent.com/BinhPhan75/baucua/main/napbaucua2.png"
                    alt="Nắp Bầu Cua"
                    className="w-full h-full object-cover scale-[1.38] rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action Buttons Row - now placed directly above the Betting Grid with minimal margins so it touches the board */}
      <div className="w-full max-w-[290px] sm:max-w-[340px] flex justify-between items-center mb-1.5 px-1 shrink-0 z-10 mt-auto">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setGameState('start')}
          className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-b from-gray-800 to-black rounded-full border-2 border-yellow-600/40 flex items-center justify-center text-[#facc15] shadow-xl"
        >
          <Undo2 size={20} />
        </motion.button>


        <button
          onClick={isOpen ? shakeDice : toggleOpen}
          disabled={isShaking}
          className={`relative px-10 sm:px-16 py-3 sm:py-5 rounded-full font-black text-xl sm:text-3xl shadow-[0_6px_0_rgba(0,0,0,0.5)] transition-all transform active:translate-y-1 active:shadow-none border-2 border-yellow-200/20 overflow-hidden ${
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
          className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-b from-gray-800 to-black rounded-full border-2 border-yellow-600/40 flex items-center justify-center text-[#facc15] shadow-xl"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </div>

      {/* Betting Grid */}
      <div className="w-full max-w-[290px] sm:max-w-[340px] grid grid-cols-3 gap-2 px-1 pb-4 shrink-0">
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .plate-container {
          width: 290px;
          height: 290px;
        }
        .dice-stage {
          width: 205px;
          height: 175px;
        }
        .cube-3d-container {
          --cube-size: 80px;
          --cube-half: 40px;
        }
        .cube-small {
          --cube-size: 40px !important;
          --cube-half: 20px !important;
        }
        @media (min-width: 375px) {
          .plate-container {
            width: 335px;
            height: 335px;
          }
          .dice-stage {
            width: 245px;
            height: 205px;
          }
          .cube-3d-container {
            --cube-size: 96px;
            --cube-half: 48px;
          }
        }
        @media (min-width: 640px) {
          .plate-container {
            width: 480px;
            height: 480px;
          }
          .dice-stage {
            width: 330px;
            height: 275px;
          }
          .cube-3d-container {
            --cube-size: 130px;
            --cube-half: 65px;
          }
          .cube-small {
            --cube-size: 64px !important;
            --cube-half: 32px !important;
          }
        }
      `}} />
    </div>
  );
}
