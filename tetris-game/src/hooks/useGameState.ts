import { useState, useCallback, useRef } from 'react';
import {
  GameState,
  Tetromino,
  TetrominoType,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INITIAL_DROP_INTERVAL,
} from '../types/game';
import {
  createTetromino,
  getRandomTetrominoType,
  getNextRotation,
} from '../utils/tetrominos';
import { checkCollision, tryWallKick } from '../utils/collision';
import { calculateScore, calculateLevel, getDropInterval } from '../utils/scoring';

// 创建空游戏板
const createEmptyBoard = (): number[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
};

// 初始游戏状态
const createInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: null,
  nextPiece: getRandomTetrominoType(),
  score: 0,
  lines: 0,
  level: 1,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  dropInterval: INITIAL_DROP_INTERVAL,
});

export function useGameState(
  onMove: () => void,
  onRotate: () => void,
  onDrop: () => void,
  onClear: (lines: number) => void,
  onGameOver: () => void,
  onStart: () => void
) {
  const [state, setState] = useState<GameState>(createInitialState());
  const lastDropTimeRef = useRef<number>(0);

  // 生成新方块
  const spawnPiece = useCallback((currentState: GameState): GameState => {
    const newPiece = createTetromino(currentState.nextPiece);
    const nextPiece = getRandomTetrominoType();

    // 检查新方块是否可以放置
    if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, currentState.board)) {
      return {
        ...currentState,
        isGameOver: true,
        isPlaying: false,
      };
    }

    return {
      ...currentState,
      currentPiece: newPiece,
      nextPiece,
    };
  }, []);

  // 固定方块到游戏板
  const lockPiece = useCallback((currentState: GameState): GameState => {
    if (!currentState.currentPiece) return currentState;

    const { board, currentPiece } = currentState;
    const newBoard = board.map(row => [...row]);

    // 将当前方块固定到游戏板
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col] !== 0) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.shape[row][col];
          }
        }
      }
    }

    onDrop();

    // 检查并消除完整行
    let linesCleared = 0;
    const clearedBoard: number[][] = [];

    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      const isFull = newBoard[row].every(cell => cell !== 0);
      if (isFull) {
        linesCleared++;
      } else {
        clearedBoard.unshift([...newBoard[row]]);
      }
    }

    // 在顶部添加新的空行
    while (clearedBoard.length < BOARD_HEIGHT) {
      clearedBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    // 更新分数和等级
    const newLines = currentState.lines + linesCleared;
    const newLevel = calculateLevel(newLines);
    const lineScore = calculateScore(linesCleared, currentState.level);
    const newScore = currentState.score + lineScore;

    if (linesCleared > 0) {
      onClear(linesCleared);
    }

    return {
      ...currentState,
      board: clearedBoard,
      currentPiece: null,
      score: newScore,
      lines: newLines,
      level: newLevel,
      dropInterval: getDropInterval(newLevel),
    };
  }, [onDrop, onClear]);

  // 开始游戏
  const startGame = useCallback(() => {
    setState(prev => {
      const newState = spawnPiece({
        ...createInitialState(),
        isPlaying: true,
      });
      onStart();
      return newState;
    });
    lastDropTimeRef.current = performance.now();
  }, [spawnPiece, onStart]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // 重置游戏
  const resetGame = useCallback(() => {
    setState(createInitialState());
    lastDropTimeRef.current = 0;
  }, []);

  // 移动方块
  const movePiece = useCallback((dx: number, dy: number) => {
    setState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.isGameOver || !prev.currentPiece) {
        return prev;
      }

      const newX = prev.currentPiece.x + dx;
      const newY = prev.currentPiece.y + dy;

      if (!checkCollision(prev.currentPiece.shape, newX, newY, prev.board)) {
        onMove();
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            x: newX,
            y: newY,
          },
        };
      }

      // 如果是向下移动且发生碰撞，固定方块
      if (dy > 0) {
        const lockedState = lockPiece(prev);
        if (lockedState.isGameOver) {
          onGameOver();
          return lockedState;
        }
        return spawnPiece(lockedState);
      }

      return prev;
    });
  }, [lockPiece, spawnPiece, onMove, onGameOver]);

  // 旋转方块
  const rotatePiece = useCallback((clockwise: boolean = true) => {
    setState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.isGameOver || !prev.currentPiece) {
        return prev;
      }

      const newShape = getNextRotation(prev.currentPiece.type, prev.currentPiece.shape, clockwise);
      const kick = tryWallKick(newShape, prev.currentPiece.x, prev.currentPiece.y, prev.board);

      if (kick) {
        onRotate();
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            shape: newShape,
            x: prev.currentPiece.x + kick.x,
            y: prev.currentPiece.y + kick.y,
          },
        };
      }

      return prev;
    });
  }, [onRotate]);

  // 硬降（直接落到底部）
  const hardDrop = useCallback(() => {
    setState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.isGameOver || !prev.currentPiece) {
        return prev;
      }

      let dropDistance = 0;
      let newY = prev.currentPiece.y;

      // 计算可以下落的最大距离
      while (!checkCollision(prev.currentPiece.shape, prev.currentPiece.x, newY + 1, prev.board)) {
        newY++;
        dropDistance++;
      }

      if (dropDistance > 0) {
        onDrop();
      }

      const droppedState = {
        ...prev,
        currentPiece: {
          ...prev.currentPiece,
          y: newY,
        },
      };

      const lockedState = lockPiece(droppedState);
      if (lockedState.isGameOver) {
        onGameOver();
        return lockedState;
      }
      return spawnPiece(lockedState);
    });
  }, [lockPiece, spawnPiece, onDrop, onGameOver]);

  // 自动下落
  const autoDrop = useCallback((timestamp: number) => {
    if (!state.isPlaying || state.isPaused || state.isGameOver) {
      return;
    }

    if (timestamp - lastDropTimeRef.current > state.dropInterval) {
      movePiece(0, 1);
      lastDropTimeRef.current = timestamp;
    }
  }, [state.isPlaying, state.isPaused, state.isGameOver, state.dropInterval, movePiece]);

  return {
    state,
    startGame,
    togglePause,
    resetGame,
    movePiece,
    rotatePiece,
    hardDrop,
    autoDrop,
  };
}
