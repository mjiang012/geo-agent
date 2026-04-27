interface ScoreBoardProps {
  score: number;
  lines: number;
  level: number;
}

export function ScoreBoard({ score, lines, level }: ScoreBoardProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-white/10 space-y-4">
      <div className="text-center">
        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">分数</div>
        <div className="text-3xl font-bold text-yellow-400 font-mono">
          {score.toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">行数</div>
          <div className="text-xl font-bold text-green-400 font-mono">
            {lines}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white/60 text-xs uppercase tracking-wider mb-1">等级</div>
          <div className="text-xl font-bold text-blue-400 font-mono">
            {level}
          </div>
        </div>
      </div>
    </div>
  );
}
