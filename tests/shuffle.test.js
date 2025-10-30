import { describe, it, expect, beforeEach } from 'vitest';
import { shuffleArray, testShuffleDistribution } from '../src/utils/shuffle.js';

describe('Shuffle Utility', () => {
    describe('shuffleArray', () => {
        it('should return an array of the same length', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            expect(shuffled.length).toBe(original.length);
        });

        it('should contain all original elements', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            original.forEach((item) => {
                expect(shuffled).toContain(item);
            });
        });

        it('should not mutate the original array', () => {
            const original = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            shuffleArray(original);
            expect(original).toEqual(originalCopy);
        });

        it('should produce different permutations', () => {
            const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const results = new Set();

            // Run shuffle multiple times
            for (let i = 0; i < 100; i++) {
                const shuffled = shuffleArray(original);
                results.add(JSON.stringify(shuffled));
            }

            // Should have multiple different permutations
            expect(results.size).toBeGreaterThan(1);
        });

        it('should handle empty arrays', () => {
            const shuffled = shuffleArray([]);
            expect(shuffled).toEqual([]);
        });

        it('should handle single element arrays', () => {
            const shuffled = shuffleArray([1]);
            expect(shuffled).toEqual([1]);
        });
    });

    describe('testShuffleDistribution', () => {
        it('should analyze shuffle distribution', () => {
            const array = [1, 2, 3];
            const distribution = testShuffleDistribution(array, 100);
            expect(distribution).toBeDefined();
            expect(distribution.length).toBe(array.length);
        });
    });
});
