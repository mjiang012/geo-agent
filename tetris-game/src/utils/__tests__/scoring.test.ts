import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  calculateLevel,
  getDropInterval,
  calculateSoftDropScore,
  calculateHardDropScore,
} from '../scoring';

describe('Scoring', () => {
  describe('calculateScore', () => {
    it('should return 0 for 0 lines cleared', () => {
      expect(calculateScore(0, 1)).toBe(0);
    });

    it('should return correct score for single line', () => {
      expect(calculateScore(1, 1)).toBe(100);
      expect(calculateScore(1, 2)).toBe(200);
      expect(calculateScore(1, 5)).toBe(500);
    });

    it('should return correct score for double line', () => {
      expect(calculateScore(2, 1)).toBe(300);
      expect(calculateScore(2, 2)).toBe(600);
      expect(calculateScore(2, 3)).toBe(900);
    });

    it('should return correct score for triple line', () => {
      expect(calculateScore(3, 1)).toBe(500);
      expect(calculateScore(3, 2)).toBe(1000);
    });

    it('should return correct score for tetris (4 lines)', () => {
      expect(calculateScore(4, 1)).toBe(800);
      expect(calculateScore(4, 2)).toBe(1600);
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0-9 lines', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(5)).toBe(1);
      expect(calculateLevel(9)).toBe(1);
    });

    it('should return level 2 for 10-19 lines', () => {
      expect(calculateLevel(10)).toBe(2);
      expect(calculateLevel(15)).toBe(2);
      expect(calculateLevel(19)).toBe(2);
    });

    it('should return level 3 for 20-29 lines', () => {
      expect(calculateLevel(20)).toBe(3);
      expect(calculateLevel(29)).toBe(3);
    });

    it('should return correct level for higher line counts', () => {
      expect(calculateLevel(100)).toBe(11);
      expect(calculateLevel(150)).toBe(16);
    });
  });

  describe('getDropInterval', () => {
    it('should return 1000ms for level 1', () => {
      expect(getDropInterval(1)).toBe(1000);
    });

    it('should return 900ms for level 2', () => {
      expect(getDropInterval(2)).toBe(900);
    });

    it('should return 500ms for level 6', () => {
      expect(getDropInterval(6)).toBe(500);
    });

    it('should return 100ms for level 10 and above', () => {
      expect(getDropInterval(10)).toBe(100);
      expect(getDropInterval(15)).toBe(100);
      expect(getDropInterval(20)).toBe(100);
    });

    it('should decrease by 100ms per level', () => {
      for (let level = 1; level <= 10; level++) {
        const expected = Math.max(100, 1000 - (level - 1) * 100);
        expect(getDropInterval(level)).toBe(expected);
      }
    });
  });

  describe('calculateSoftDropScore', () => {
    it('should return 1 point per cell', () => {
      expect(calculateSoftDropScore(1)).toBe(1);
      expect(calculateSoftDropScore(5)).toBe(5);
      expect(calculateSoftDropScore(10)).toBe(10);
    });

    it('should return 0 for 0 cells', () => {
      expect(calculateSoftDropScore(0)).toBe(0);
    });
  });

  describe('calculateHardDropScore', () => {
    it('should return 2 points per cell', () => {
      expect(calculateHardDropScore(1)).toBe(2);
      expect(calculateHardDropScore(5)).toBe(10);
      expect(calculateHardDropScore(10)).toBe(20);
    });

    it('should return 0 for 0 cells', () => {
      expect(calculateHardDropScore(0)).toBe(0);
    });
  });
});
