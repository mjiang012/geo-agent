import { RotateCcw, Trophy } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  lines: number;
  level: number;
  onRestart: () => void;
}

export function GameOverModal({ score, lines, level, onRestart }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-red-400" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2">游戏结束</h2>
          <p className="text-white/60 mb-8">表现不错！这是你的最终得分：</p>
          
          <div className="bg-black/30 rounded-xl p-6 mb-8">
            <div className="text-5xl font-bold text-yellow-400 font-mono mb-4">
              {score.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-white/60">
                消除行数: <span className="text-green-400 font-semibold">{lines}</span>
              </div>
              <div className="text-white/60">
                到达等级: <span className="text-blue-400 font-semibold">{level}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-600/30"
          >
            <RotateCcw className="w-5 h-5" />
            <span>再玩一次</span>
          </button>
        </div>
      </div>
    </div>
  );
}
