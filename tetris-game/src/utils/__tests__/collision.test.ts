import { describe, it, expect } from 'vitest';
import { checkCollision, tryWallKick } from '../collision';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../types/game';

describe('Collision', () => {
  // 创建空游戏板
  const createEmptyBoard = (): number[][] => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  };

  describe('checkCollision', () => {
    it('should return false for valid position on empty board', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, 0, 0, board)).toBe(false);
    });

    it('should return true for left boundary collision', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, -1, 0, board)).toBe(true);
    });

    it('should return true for right boundary collision', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, BOARD_WIDTH - 1, 0, board)).toBe(true);
    });

    it('should return true for bottom boundary collision', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, 0, BOARD_HEIGHT - 1, board)).toBe(true);
    });

    it('should return false for negative y position (above board)', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, 0, -2, board)).toBe(false);
    });

    it('should return true for collision with existing piece', () => {
      const board = createEmptyBoard();
      board[5][5] = 1; // Place a piece
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, 4, 4, board)).toBe(true);
    });

    it('should return false when piece is adjacent but not overlapping', () => {
      const board = createEmptyBoard();
      board[5][5] = 1;
      const shape = [[1, 1], [1, 1]];
      expect(checkCollision(shape, 6, 4, board)).toBe(false);
    });

    it('should handle I piece correctly', () => {
      const board = createEmptyBoard();
      const iShape = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]];
      expect(checkCollision(iShape, 3, 0, board)).toBe(false);
      expect(checkCollision(iShape, 7, 0, board)).toBe(true); // Too far right
    });
  });

  describe('tryWallKick', () => {
    it('should return {0,0} for valid position', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      const result = tryWallKick(shape, 0, 0, board);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should return left kick when piece is against right wall', () => {
      const board = createEmptyBoard();
      const shape = [[1, 1], [1, 1]];
      // Position that would be against right wall
      const result = tryWallKick(shape, BOARD_WIDTH - 2, 0, board);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should return null when no valid kick found', () => {
      const board = createEmptyBoard();
      // Fill the board to make it impossible to place
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          board[row][col] = 1;
        }
      }
      const shape = [[1, 1], [1, 1]];
      const result = tryWallKick(shape, 0, 0, board);
      expect(result).toBeNull();
    });

    it('should try multiple kick positions', () => {
      const board = createEmptyBoard();
      // Place obstacles to force wall kick
      board[0][0] = 1;
      board[0][1] = 1;
      const shape = [[1, 1], [1, 1]];
      // Try to place at position 0,0 which is blocked
      // Should try kicks: (0,0), (-1,0), (1,0), (0,-1), (-2,0), (2,0)
      const result = tryWallKick(shape, 0, 0, board);
      // Should find a valid kick
      expect(result).not.toBeNull();
    });
  });
});
