import { useEffect, useCallback, useRef, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { PreviewPanel } from './components/PreviewPanel';
import { ScoreBoard } from './components/ScoreBoard';
import { ControlPanel } from './components/ControlPanel';
import { GameOverModal } from './components/GameOverModal';
import { ControlsHelp } from './components/ControlsHelp';
import { LevelEditorPage } from './pages/LevelEditorPage';
import { useGameState } from './hooks/useGameState';
import { useLevelGame } from './hooks/useLevelGame';
import { useAudio } from './hooks/useAudio';
import { LevelConfig, DEFAULT_LEVEL_CONFIG } from './types/levelEditor';
import { Wrench } from 'lucide-react';

type GameMode = 'menu' | 'classic' | 'level-editor' | 'custom-level';

function App() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [customLevel, setCustomLevel] = useState<LevelConfig | null>(null);

  const {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playClearSound,
    playGameOverSound,
    playStartSound,
  } = useAudio();

  // 经典模式游戏状态
  const classicGame = useGameState(
    playMoveSound,
    playRotateSound,
    playDropSound,
    playClearSound,
    playGameOverSound,
    playStartSound
  );

  // 自定义关卡游戏状态
  const customGame = useLevelGame(
    customLevel || DEFAULT_LEVEL_CONFIG,
    playMoveSound,
    playRotateSound,
    playDropSound,
    playClearSound,
    playGameOverSound,
    playStartSound
  );

  // 根据模式选择游戏状态
  const isCustomMode = mode === 'custom-level' && customLevel;
  const gameState = isCustomMode ? customGame.state : classicGame.state;
  const gameActions = isCustomMode ? customGame : classicGame;

  const animationFrameRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<Record<string, number>>({});

  // 游戏循环
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      gameActions.autoDrop(timestamp);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameActions]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止重复触发（节流）
      const now = Date.now();
      const lastTime = lastKeyTimeRef.current[e.key] || 0;
      if (now - lastTime < 50) return;
      lastKeyTimeRef.current[e.key] = now;

      if (mode === 'menu' || mode === 'level-editor') return;

      if (gameState.isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          gameActions.resetGame();
          setTimeout(gameActions.startGame, 100);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          gameActions.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          gameActions.movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          gameActions.movePiece(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          gameActions.rotatePiece(true);
          break;
        case ' ':
          e.preventDefault();
          if (gameState.isPlaying && !gameState.isPaused) {
            gameActions.hardDrop();
          } else if (!gameState.isPlaying) {
            gameActions.startGame();
          }
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          if (gameState.isPlaying) {
            gameActions.togglePause();
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          gameActions.resetGame();
          break;
        case 'Enter':
          e.preventDefault();
          if (!gameState.isPlaying) {
            gameActions.startGame();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setMode('menu');
          gameActions.resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, gameState, gameActions]);

  const handleRestart = useCallback(() => {
    gameActions.resetGame();
    setTimeout(gameActions.startGame, 100);
  }, [gameActions]);

  const handlePlayLevel = (level: LevelConfig) => {
    setCustomLevel(level);
    setMode('custom-level');
    setTimeout(() => {
      customGame.startGame();
    }, 100);
  };

  // 主菜单
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-5xl font-bold text-white mb-2">俄罗斯方块</h1>
          <p className="text-gray-400 mb-8">经典益智游戏</p>

          <div className="space-y-4">
            <button
              onClick={() => {
                setMode('classic');
                setTimeout(() => classicGame.startGame(), 100);
              }}
              className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-600/30"
            >
              经典模式
            </button>

            <button
              onClick={() => setMode('level-editor')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Wrench className="w-5 h-5" />
              关卡编辑器
            </button>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>使用方向键移动和旋转</p>
            <p>空格键快速下落 • P键暂停</p>
          </div>
        </div>
      </div>
    );
  }

  // 关卡编辑器
  if (mode === 'level-editor') {
    return (
      <LevelEditorPage
        onBack={() => setMode('menu')}
        onPlayLevel={handlePlayLevel}
      />
    );
  }

  // 游戏界面（经典模式或自定义关卡）
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full">
        {/* 游戏主区域 */}
        <div className="flex-1 flex justify-center">
          <GameBoard
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            isGameOver={gameState.isGameOver}
          />
        </div>

        {/* 侧边面板 */}
        <div className="w-full lg:w-64 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isCustomMode ? customLevel?.name : '经典模式'}
            </h2>
            <button
              onClick={() => {
                setMode('menu');
                gameActions.resetGame();
              }}
              className="text-sm text-gray-400 hover:text-white"
            >
              菜单
            </button>
          </div>

          <PreviewPanel nextPiece={gameState.nextPiece} />
          <ScoreBoard
            score={gameState.score}
            lines={gameState.lines}
            level={gameState.level}
          />
          <ControlPanel
            isPlaying={gameState.isPlaying}
            isPaused={gameState.isPaused}
            isGameOver={gameState.isGameOver}
            onStart={gameActions.startGame}
            onPause={gameActions.togglePause}
            onReset={gameActions.resetGame}
          />
          <ControlsHelp />
        </div>
      </div>

      {/* 游戏结束弹窗 */}
      {gameState.isGameOver && (
        <GameOverModal
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          onRestart={handleRestart}
        />
      )}

      {/* 暂停提示 */}
      {gameState.isPaused && !gameState.isGameOver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-4xl font-bold text-white animate-pulse">已暂停</div>
        </div>
      )}
    </div>
  );
}

export default App;
