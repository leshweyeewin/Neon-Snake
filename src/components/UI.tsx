/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trophy, Pause, Play, Users } from 'lucide-react';

export function UI() {
  const { gameState, playerId, joinGame, isPaused, togglePause } = useGameStore();
  const [name, setName] = useState('');

  const player = playerId && gameState ? gameState.players[playerId] : null;
  const isAlive = player?.state === 'alive';
  const isDead = player?.state === 'dead';

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto relative">
        <div className="flex flex-col gap-2 z-10">
          <h1 className="text-3xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
            NEON.SNAKE
          </h1>
          {isAlive && (
            <div className="text-xl font-mono text-white/80 font-bold">
              Length: {Math.floor(player.score)}
            </div>
          )}
        </div>
        
        {/* Controls Hint */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex gap-2 opacity-80 pointer-events-none hidden sm:flex">
          <div className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">A</span>
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">D</span>
            <span className="text-white/70 uppercase tracking-wider text-[10px]">Turn</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-white bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">SPACE</span>
            <span className="text-white/70 uppercase tracking-wider text-[10px]">Boost</span>
          </div>
        </div>

        <button
          onClick={handleOpenNewTab}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold transition-colors z-10"
        >
          <ExternalLink size={16} />
          <span>New Tab</span>
        </button>

        {isAlive && (
          <button
            onClick={togglePause}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold transition-colors z-10 ml-2 pointer-events-auto"
          >
            {isPaused ? <Play size={16} fill="white" /> : <Pause size={16} fill="white" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        )}
      </div>

      {/* Leaderboard / Players List on RHS */}
      {gameState && (
        <div className="absolute top-24 right-4 bottom-24 w-64 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 pointer-events-auto overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 text-white/80 font-semibold border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h2 className="text-xs uppercase tracking-widest">Players</h2>
            </div>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">
              {Object.keys(gameState.players).length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
            {Object.values(gameState.players)
              .sort((a, b) => b.score - a.score)
              .map((p, i) => (
                <div 
                  key={p.id} 
                  className={`flex justify-between items-center text-sm p-2 rounded-lg transition-colors ${p.id === playerId ? 'bg-white/10 ring-1 ring-inset ring-white/20' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-white/20 w-3">{i + 1}</span>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
                    />
                    <span className={`truncate max-w-[110px] font-medium ${p.id === playerId ? 'text-white' : 'text-white/70'}`}>
                      {p.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-white/60">{Math.floor(p.score)}</span>
                </div>
              ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
              <Trophy size={12} className="text-yellow-500" />
              <span>Arena Rankings</span>
            </div>
          </div>
        </div>
      )}

      {/* Menus */}
      <AnimatePresence>
        {isPaused && isAlive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-md z-30"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                 <motion.div 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute inset-0 bg-white/10 blur-3xl rounded-full"
                 />
                 <h2 className="text-6xl font-black text-white tracking-widest drop-shadow-2xl">PAUSED</h2>
              </div>
              <button
                onClick={togglePause}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-xl flex items-center gap-3"
              >
                <Play fill="black" size={24} />
                RESUME GAME
              </button>
            </div>
          </motion.div>
        )}

        {(!player || isDead) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-zinc-900/90 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full flex flex-col items-center gap-6">
              {isDead && (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-red-500 mb-2">YOU DIED</h2>
                  <p className="text-white/60">Final Length: {Math.floor(player.score)}</p>
                </div>
              )}
              
              {!isDead && (
                <div className="text-center">
                  <h2 className="text-3xl font-black text-white mb-2">JOIN ARENA</h2>
                  <p className="text-white/60 text-sm">Steer with A/D or Left/Right. Space to boost.</p>
                </div>
              )}

              <div className="w-full flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Snake Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={15}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors pointer-events-auto"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') joinGame(name || 'Unnamed');
                  }}
                />
              </div>
              
              <button
                onClick={() => joinGame(name || 'Unnamed')}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors active:scale-95"
              >
                {isDead ? 'RESPAWN' : 'PLAY'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
