import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager } from './modules/storage.js';

describe('StorageManager', () => {
    let storage;

    beforeEach(() => {
        storage = new StorageManager();
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('Initialization', () => {
        it('should initialize with default scores', () => {
            const scores = storage.loadBestScores();
            expect(scores.easy).toBeDefined();
            expect(scores.medium).toBeDefined();
            expect(scores.hard).toBeDefined();
        });
    });

    describe('loadBestScores', () => {
        it('should return default scores when localStorage is empty', () => {
            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(null);
            expect(scores.easy.score).toBe(0);
        });

        it('should load saved scores from localStorage', () => {
            const testScores = {
                easy: { time: 45, score: 100, date: '2025-01-01' },
                medium: { time: 60, score: 200, date: '2025-01-02' },
                hard: { time: 90, score: 300, date: '2025-01-03' },
                version: '1.0'
            };
            localStorage.setItem('memoryGameScores', JSON.stringify(testScores));

            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(45);
            expect(scores.medium.score).toBe(200);
        });

        it('should handle corrupted localStorage data gracefully', () => {
            localStorage.setItem('memoryGameScores', 'invalid json');
            const scores = storage.loadBestScores();
            expect(scores).toBeDefined();
            expect(scores.easy).toBeDefined();
        });
    });

    describe('saveScore', () => {
        it('should save a new score if no previous score exists', () => {
            const saved = storage.saveScore('easy', 50, 100);
            expect(saved).toBe(true);

            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(50);
            expect(scores.easy.score).toBe(100);
        });

        it('should save if time is better (lower)', () => {
            storage.saveScore('easy', 60, 100);
            const saved = storage.saveScore('easy', 50, 100);
            expect(saved).toBe(true);

            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(50);
        });

        it('should save if score is better (higher)', () => {
            storage.saveScore('easy', 60, 100);
            const saved = storage.saveScore('easy', 60, 150);
            expect(saved).toBe(true);

            const scores = storage.loadBestScores();
            expect(scores.easy.score).toBe(150);
        });

        it('should not save if score is not better', () => {
            storage.saveScore('easy', 50, 100);
            const saved = storage.saveScore('easy', 60, 50);
            expect(saved).toBe(false);

            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(50);
            expect(scores.easy.score).toBe(100);
        });

        it('should update date when saving', () => {
            storage.saveScore('easy', 50, 100);
            const scores = storage.loadBestScores();
            expect(scores.easy.date).toBeDefined();
            expect(scores.easy.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('getBestTime', () => {
        it('should return null when no time is saved', () => {
            const time = storage.getBestTime('easy');
            expect(time).toBe(null);
        });

        it('should return saved best time', () => {
            storage.saveScore('easy', 45, 100);
            const time = storage.getBestTime('easy');
            expect(time).toBe(45);
        });
    });

    describe('getBestScore', () => {
        it('should return 0 when no score is saved', () => {
            const score = storage.getBestScore('easy');
            expect(score).toBe(0);
        });

        it('should return saved best score', () => {
            storage.saveScore('easy', 45, 200);
            const score = storage.getBestScore('easy');
            expect(score).toBe(200);
        });
    });

    describe('clearScores', () => {
        it('should clear all saved scores', () => {
            storage.saveScore('easy', 50, 100);
            storage.clearScores();

            const scores = storage.loadBestScores();
            expect(scores.easy.time).toBe(null);
            expect(scores.easy.score).toBe(0);
        });
    });

    describe('isStorageAvailable', () => {
        it('should return true when localStorage is available', () => {
            const available = storage.isStorageAvailable();
            expect(available).toBe(true);
        });
    });

    describe('validateScores', () => {
        it('should validate correct score structure', () => {
            const scores = {
                easy: { time: 45, score: 100, date: '2025-01-01' },
                medium: { time: 60, score: 200, date: '2025-01-02' },
                hard: { time: 90, score: 300, date: '2025-01-03' }
            };
            const isValid = storage.validateScores(scores);
            expect(isValid).toBe(true);
        });

        it('should reject invalid score structure', () => {
            const scores = {
                easy: { time: -1, score: 100 },
                medium: { time: 60, score: 200 },
                hard: { time: 90, score: 300 }
            };
            const isValid = storage.validateScores(scores);
            expect(isValid).toBe(false);
        });

        it('should reject missing difficulty', () => {
            const scores = {
                easy: { time: 45, score: 100 },
                medium: { time: 60, score: 200 }
                // missing hard
            };
            const isValid = storage.validateScores(scores);
            expect(isValid).toBe(false);
        });
    });
});
