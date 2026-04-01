import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, UserCheck, Settings2 } from 'lucide-react';
import { Member } from '../types';
import { cn } from '../lib/utils';

interface LuckyDrawProps {
  members: Member[];
}

export default function LuckyDraw({ members }: LuckyDrawProps) {
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [pool, setPool] = useState<Member[]>([]);
  const [winners, setWinners] = useState<Member[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWinner, setCurrentWinner] = useState<Member | null>(null);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setPool(members);
  }, [members]);

  const startDraw = () => {
    if (pool.length === 0) return;
    
    setIsDrawing(true);
    setCurrentWinner(null);
    
    let speed = 50;
    let count = 0;
    const maxCount = 30 + Math.floor(Math.random() * 20);

    const animate = () => {
      setCurrentIndex(prev => (prev + 1) % pool.length);
      count++;

      if (count < maxCount) {
        speed *= 1.05;
        timerRef.current = window.setTimeout(animate, speed);
      } else {
        const winnerIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[winnerIndex];
        
        setCurrentWinner(winner);
        setWinners(prev => [winner, ...prev]);
        
        if (!allowDuplicate) {
          setPool(prev => prev.filter((_, i) => i !== winnerIndex));
        }

        setIsDrawing(false);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
        });
      }
    };

    animate();
  };

  const reset = () => {
    setPool(members);
    setWinners([]);
    setCurrentWinner(null);
  };

  if (members.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
        <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">請先在名單管理中加入成員</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Draw Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <AnimatePresence mode="wait">
              {!isDrawing && !currentWinner && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-4"
                >
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={40} className="text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">準備好抽獎了嗎？</h2>
                  <p className="text-gray-500">目前獎池剩餘 {pool.length} 人</p>
                </motion.div>
              )}

              {isDrawing && (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-6xl font-black text-blue-600 tracking-tighter mb-4">
                    {pool[currentIndex]?.name}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}

              {currentWinner && !isDrawing && (
                <motion.div
                  key="winner"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Trophy size={40} className="text-yellow-600" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-600 uppercase tracking-widest mb-2">恭喜中獎</p>
                    <h2 className="text-6xl font-black text-gray-900 tracking-tight">
                      {currentWinner.name}
                    </h2>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 w-full max-w-xs space-y-4">
              <button
                onClick={startDraw}
                disabled={isDrawing || pool.length === 0}
                className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isDrawing ? '抽獎中...' : '開始抽獎'}
              </button>
              
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={reset}
                  className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={14} />
                  重置獎池
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">重複中獎</span>
                  <button
                    onClick={() => setAllowDuplicate(!allowDuplicate)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      allowDuplicate ? "bg-blue-500" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      allowDuplicate ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Winners List */}
        <div className="w-full md:w-72 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 text-gray-800 font-bold mb-6">
              <UserCheck size={20} className="text-green-500" />
              <h3>中獎名單</h3>
              <span className="ml-auto text-xs font-normal text-gray-400">{winners.length} 人</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {winners.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-sm">
                  <p>尚無中獎者</p>
                </div>
              ) : (
                winners.map((winner, idx) => (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={`${winner.id}-${winners.length - idx}`}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group"
                  >
                    <span className="font-medium text-gray-700">{winner.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">#{winners.length - idx}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
