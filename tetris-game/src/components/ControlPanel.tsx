import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlPanel({
  isPlaying,
  isPaused,
  isGameOver,
  onStart,
  onPause,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="flex gap-2">
      {!isPlaying || isGameOver ? (
        <button
          onClick={onStart}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-600/30"
        >
          <Play className="w-5 h-5" />
          <span>开始</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
            isPaused
              ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-600/30'
              : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
          } text-white`}
        >
          <Pause className="w-5 h-5" />
          <span>{isPaused ? '继续' : '暂停'}</span>
        </button>
      )}

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30"
      >
        <RotateCcw className="w-5 h-5" />
        <span>重置</span>
      </button>
    </div>
  );
}
