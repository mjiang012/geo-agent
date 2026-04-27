import { describe, it, expect } from 'vitest';
import {
  TETROMINO_SHAPES,
  getRandomTetrominoType,
  createTetromino,
  rotateClockwise,
  rotateCounterClockwise,
  getRotationIndex,
  getNextRotation,
} from '../tetrominos';
import { TetrominoType } from '../../types/game';

describe('Tetrominos', () => {
  describe('TETROMINO_SHAPES', () => {
    it('should have all 7 tetromino types', () => {
      const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      types.forEach(type => {
        expect(TETROMINO_SHAPES[type]).toBeDefined();
        expect(TETROMINO_SHAPES[type].length).toBe(4); // 4 rotation states
      });
    });

    it('I piece should have correct initial shape', () => {
      const iPiece = TETROMINO_SHAPES.I[0];
      expect(iPiece).toEqual([
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('O piece should have same shape in all rotations', () => {
      const oPiece = TETROMINO_SHAPES.O;
      expect(oPiece[0]).toEqual(oPiece[1]);
      expect(oPiece[1]).toEqual(oPiece[2]);
      expect(oPiece[2]).toEqual(oPiece[3]);
    });
  });

  describe('getRandomTetrominoType', () => {
    it('should return a valid tetromino type', () => {
      const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
      const result = getRandomTetrominoType();
      expect(types).toContain(result);
    });

    it('should return different types over multiple calls', () => {
      const results = new Set<TetrominoType>();
      for (let i = 0; i < 50; i++) {
        results.add(getRandomTetrominoType());
      }
      // Should get at least 4 different types in 50 calls
      expect(results.size).toBeGreaterThan(3);
    });
  });

  describe('createTetromino', () => {
    it('should create a tetromino with correct properties', () => {
      const piece = createTetromino('T', 3, 0);
      expect(piece.type).toBe('T');
      expect(piece.x).toBe(3);
      expect(piece.y).toBe(0);
      expect(piece.color).toBe('#a000f0');
      expect(piece.shape).toBeDefined();
    });

    it('should use default position when not provided', () => {
      const piece = createTetromino('I');
      expect(piece.x).toBe(3);
      expect(piece.y).toBe(0);
    });
  });

  describe('rotateClockwise', () => {
    it('should rotate a 3x3 matrix correctly', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const rotated = rotateClockwise(matrix);
      expect(rotated).toEqual([
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);
    });

    it('should rotate a 4x4 matrix correctly', () => {
      const matrix = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      const rotated = rotateClockwise(matrix);
      expect(rotated).toEqual([
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ]);
    });
  });

  describe('rotateCounterClockwise', () => {
    it('should rotate a 3x3 matrix correctly', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const rotated = rotateCounterClockwise(matrix);
      expect(rotated).toEqual([
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7],
      ]);
    });
  });

  describe('getRotationIndex', () => {
    it('should return correct rotation index', () => {
      const tPiece = TETROMINO_SHAPES.T;
      expect(getRotationIndex('T', tPiece[0])).toBe(0);
      expect(getRotationIndex('T', tPiece[1])).toBe(1);
      expect(getRotationIndex('T', tPiece[2])).toBe(2);
      expect(getRotationIndex('T', tPiece[3])).toBe(3);
    });

    it('should return 0 for unknown shape', () => {
      const unknownShape = [[0, 0], [0, 0]];
      expect(getRotationIndex('T', unknownShape)).toBe(0);
    });
  });

  describe('getNextRotation', () => {
    it('should return next clockwise rotation', () => {
      const tPiece = TETROMINO_SHAPES.T;
      const next = getNextRotation('T', tPiece[0], true);
      expect(next).toEqual(tPiece[1]);
    });

    it('should return next counter-clockwise rotation', () => {
      const tPiece = TETROMINO_SHAPES.T;
      const next = getNextRotation('T', tPiece[1], false);
      expect(next).toEqual(tPiece[0]);
    });

    it('should wrap around from last to first rotation', () => {
      const tPiece = TETROMINO_SHAPES.T;
      const next = getNextRotation('T', tPiece[3], true);
      expect(next).toEqual(tPiece[0]);
    });

    it('should wrap around from first to last rotation', () => {
      const tPiece = TETROMINO_SHAPES.T;
      const next = getNextRotation('T', tPiece[0], false);
      expect(next).toEqual(tPiece[3]);
    });
  });
});
