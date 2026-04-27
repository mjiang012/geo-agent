import { useState, useCallback, useRef } from 'react';
import { LevelConfig, CustomTetromino } from '../types/levelEditor';
import { GameState, Tetromino, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';
import { checkCollision, tryWallKick } from '../utils/collision';
import { calculateScore, calculateLevel } from '../utils/scoring';
import { getNextRotation } from '../utils/tetrominos';

// 根据关卡配置创建游戏状态
export function useLevelGame(
  levelConfig: LevelConfig,
  onMove: () => void,
  onRotate: () => void,
  onDrop: () => void,
  onClear: (lines: number) => void,
  onGameOver: () => void,
  onStart: () => void
) {
  // 创建空游戏板
  const createEmptyBoard = (width: number, height: number): number[][] => {
    return Array(height).fill(null).map(() => Array(width).fill(0));
  };

  // 获取随机方块类型（支持自定义方块）
  const getRandomPiece = useCallback((): { shape: number[][]; color: string } => {
    if (levelConfig.useCustomTetrominos && levelConfig.customTetrominos.length > 0) {
      // 根据权重选择自定义方块
      const totalWeight = levelConfig.customTetrominos.reduce((sum, t) => sum + t.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const tetromino of levelConfig.customTetrominos) {
        random -= tetromino.weight;
        if (random <= 0) {
          return {
            shape: tetromino.shapes[0],
            color: tetromino.color,
          };
        }
      }
    }
    
    // 默认使用标准方块
    const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const defaultPiece = createTetromino(randomType);
    return {
      shape: defaultPiece.shape,
      color: defaultPiece.color,
    };
  }, [levelConfig]);

  // 初始游戏状态
  const createInitialState = useCallback((): GameState => {
    const { boardWidth, boardHeight, startLevel } = levelConfig.levelParams;
    return {
      board: createEmptyBoard(boardWidth, boardHeight),
      currentPiece: null,
      nextPiece: 'I', // 简化处理
      score: 0,
      lines: 0,
      level: startLevel,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      dropInterval: levelConfig.speedCurve.baseInterval,
    };
  }, [levelConfig]);

  const [state, setState] = useState<GameState>(createInitialState());
  const lastDropTimeRef = useRef<number>(0);

  // 计算下落间隔
  const getDropInterval = useCallback((level: number): number => {
    const { speedCurve } = levelConfig;
    if (speedCurve.type === 'exponential') {
      return Math.max(
        speedCurve.minInterval,
        speedCurve.baseInterval * Math.pow(0.9, level - 1)
      );
    }
    return Math.max(
      speedCurve.minInterval,
      speedCurve.baseInterval - (level - 1) * speedCurve.decrement
    );
  }, [levelConfig]);

  // 生成新方块
  const spawnPiece = useCallback((currentState: GameState): GameState => {
    const piece = getRandomPiece();
    const { boardWidth } = levelConfig.levelParams;
    const newPiece: Tetromino = {
      type: 'I', // 简化处理
      shape: piece.shape,
      color: piece.color,
      x: Math.floor((boardWidth - piece.shape[0].length) / 2),
      y: 0,
    };

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
    };
  }, [getRandomPiece, levelConfig]);

  // 固定方块
  const lockPiece = useCallback((currentState: GameState): GameState => {
    if (!currentState.currentPiece) return currentState;

    const { board, currentPiece } = currentState;
    const newBoard = board.map(row => [...row]);

    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col] !== 0) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          const { boardHeight, boardWidth } = levelConfig.levelParams;
          if (boardY >= 0 && boardY < boardHeight && boardX >= 0 && boardX < boardWidth) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }

    onDrop();

    // 消行
    let linesCleared = 0;
    const clearedBoard: number[][] = [];
    const { boardHeight, boardWidth } = levelConfig.levelParams;

    for (let row = boardHeight - 1; row >= 0; row--) {
      const isFull = newBoard[row].every(cell => cell !== 0);
      if (isFull) {
        linesCleared++;
      } else {
        clearedBoard.unshift([...newBoard[row]]);
      }
    }

    while (clearedBoard.length < boardHeight) {
      clearedBoard.unshift(Array(boardWidth).fill(0));
    }

    // 计分
    const newLines = currentState.lines + linesCleared;
    const newLevel = calculateLevel(newLines);
    const multiplier = levelConfig.levelParams.scoreMultipliers[linesCleared] || 1;
    const lineScore = calculateScore(linesCleared, currentState.level) * multiplier;
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
  }, [onDrop, onClear, levelConfig, getDropInterval]);

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
  }, [spawnPiece, createInitialState, onStart]);

  // 暂停
  const togglePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // 重置
  const resetGame = useCallback(() => {
    setState(createInitialState());
    lastDropTimeRef.current = 0;
  }, [createInitialState]);

  // 移动
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

  // 旋转
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

  // 硬降
  const hardDrop = useCallback(() => {
    setState(prev => {
      if (!prev.isPlaying || prev.isPaused || prev.isGameOver || !prev.currentPiece) {
        return prev;
      }

      let newY = prev.currentPiece.y;
      while (!checkCollision(prev.currentPiece.shape, prev.currentPiece.x, newY + 1, prev.board)) {
        newY++;
      }

      if (newY > prev.currentPiece.y) {
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

// 辅助函数
function createTetromino(type: string): { shape: number[][]; color: string } {
  const colors: Record<string, string> = {
    I: '#00f0f0',
    J: '#0000f0',
    L: '#f0a000',
    O: '#f0f000',
    S: '#00f000',
    T: '#a000f0',
    Z: '#f00000',
  };

  const shapes: Record<string, number[][]> = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  };

  return {
    shape: shapes[type] || shapes.I,
    color: colors[type] || '#fff',
  };
}
