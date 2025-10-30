import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from '../src/modules/game.js';

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    describe('Initialization', () => {
        it('should initialize with default state', () => {
            const state = game.getState();
            expect(state.deck).toEqual([]);
            expect(state.flipped).toEqual([]);
            expect(state.matched.size).toBe(0);
            expect(state.moves).toBe(0);
            expect(state.score).toBe(0);
            expect(state.isPaused).toBe(false);
            expect(state.isWon).toBe(false);
        });

        it('should initialize with medium difficulty by default', () => {
            game.init();
            const state = game.getState();
            expect(state.difficulty).toBe('medium');
            expect(state.deck.length).toBe(16); // 8 pairs * 2
        });

        it('should create deck for easy difficulty', () => {
            game.init('easy');
            const state = game.getState();
            expect(state.difficulty).toBe('easy');
            expect(state.deck.length).toBe(12); // 6 pairs * 2
        });

        it('should create deck for hard difficulty', () => {
            game.init('hard');
            const state = game.getState();
            expect(state.difficulty).toBe('hard');
            expect(state.deck.length).toBe(24); // 12 pairs * 2
        });

        it('should create pairs correctly', () => {
            game.init('easy');
            const state = game.getState();
            const icons = state.deck.map((card) => card.icon);

            // Count occurrences of each icon
            const iconCounts = {};
            icons.forEach((icon) => {
                iconCounts[icon] = (iconCounts[icon] || 0) + 1;
            });

            // Each icon should appear exactly twice
            Object.values(iconCounts).forEach((count) => {
                expect(count).toBe(2);
            });
        });
    });

    describe('Card Flipping', () => {
        beforeEach(() => {
            game.init('easy');
        });

        it('should flip a card successfully', () => {
            const state = game.getState();
            const cardId = state.deck[0].id;
            const result = game.flipCard(cardId);

            expect(result).toBe(true);
            const newState = game.getState();
            expect(newState.flipped).toContain(cardId);
        });

        it('should not flip a card that is already flipped', () => {
            const state = game.getState();
            const cardId = state.deck[0].id;
            game.flipCard(cardId);
            const result = game.flipCard(cardId);

            expect(result).toBe(false);
        });

        it('should not flip a card that is already matched', () => {
            const state = game.getState();
            const cardId = state.deck[0].id;
            const card = state.deck.find((c) => c.id === cardId);
            card.matched = true;

            const result = game.flipCard(cardId);
            expect(result).toBe(false);
        });

        it('should lock input when two cards are flipped', () => {
            const state = game.getState();
            const card1Id = state.deck[0].id;
            const card2Id = state.deck[1].id;

            game.flipCard(card1Id);
            game.flipCard(card2Id);

            const newState = game.getState();
            expect(newState.isLocked).toBe(true);
        });

        it('should not flip cards when game is locked', () => {
            const state = game.getState();
            game.state.isLocked = true;

            const result = game.flipCard(state.deck[0].id);
            expect(result).toBe(false);
        });

        it('should not flip cards when game is paused', () => {
            const state = game.getState();
            game.state.isPaused = true;

            const result = game.flipCard(state.deck[0].id);
            expect(result).toBe(false);
        });

        it('should not flip cards when game is won', () => {
            const state = game.getState();
            game.state.isWon = true;

            const result = game.flipCard(state.deck[0].id);
            expect(result).toBe(false);
        });

        it('should start timer on first card flip', () => {
            const state = game.getState();
            expect(state.startTime).toBe(null);

            game.flipCard(state.deck[0].id);
            const newState = game.getState();
            expect(newState.startTime).not.toBe(null);
        });
    });

    describe('Match Logic', () => {
        beforeEach(() => {
            game.init('easy');
        });

        it('should match identical cards', () => {
            const state = game.getState();
            const card1 = state.deck.find((c) => c.icon === '🍎');
            const card2 = state.deck.find((c) => c.icon === '🍎' && c.id !== card1.id);

            game.flipCard(card1.id);
            game.flipCard(card2.id);

            // Wait for match check (async setTimeout)
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newState = game.getState();
                    expect(newState.matched.has(card1.id)).toBe(true);
                    expect(newState.matched.has(card2.id)).toBe(true);
                    expect(newState.score).toBeGreaterThan(0);
                    resolve();
                }, 850);
            });
        });

        it('should increment score by 10 for a match', () => {
            const state = game.getState();
            const card1 = state.deck.find((c) => c.icon === '🍎');
            const card2 = state.deck.find((c) => c.icon === '🍎' && c.id !== card1.id);
            const initialScore = state.score;

            game.flipCard(card1.id);
            game.flipCard(card2.id);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const newState = game.getState();
                    expect(newState.score).toBe(initialScore + 10);
                    resolve();
                }, 850);
            });
        });

        it('should decrement score by 2 for a mismatch', () => {
            game.init('easy');
            const state = game.getState();

            // Find two different icons
            const icons = [...new Set(state.deck.map((c) => c.icon))];
            const card1 = state.deck.find((c) => c.icon === icons[0]);
            const card2 = state.deck.find((c) => c.icon === icons[1]);

            game.flipCard(card1.id);
            game.flipCard(card2.id);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const newState = game.getState();
                    expect(newState.score).toBe(Math.max(0, -2));
                    resolve();
                }, 850);
            });
        });

        it('should increment moves on pair comparison', () => {
            const state = game.getState();
            const card1Id = state.deck[0].id;
            const card2Id = state.deck[1].id;

            game.flipCard(card1Id);
            game.flipCard(card2Id);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const newState = game.getState();
                    expect(newState.moves).toBe(1);
                    resolve();
                }, 850);
            });
        });
    });

    describe('Pause/Resume', () => {
        beforeEach(() => {
            game.init('easy');
        });

        it('should toggle pause state', () => {
            game.togglePause();
            expect(game.getState().isPaused).toBe(true);

            game.togglePause();
            expect(game.getState().isPaused).toBe(false);
        });

        it('should stop timer when paused', () => {
            game.flipCard(game.getState().deck[0].id);
            game.togglePause();

            const interval = game.timerInterval;
            expect(interval).toBe(null);
        });
    });

    describe('Restart', () => {
        it('should reset game state', () => {
            game.init('easy');
            game.flipCard(game.getState().deck[0].id);
            game.restart();

            const state = game.getState();
            expect(state.flipped).toEqual([]);
            expect(state.moves).toBe(0);
            expect(state.score).toBe(0);
            expect(state.isWon).toBe(false);
        });
    });

    describe('Difficulty Configuration', () => {
        it('should return correct config for easy', () => {
            game.init('easy');
            const config = game.getDifficultyConfig();
            expect(config.rows).toBe(3);
            expect(config.cols).toBe(4);
            expect(config.totalCards).toBe(12);
        });

        it('should return correct config for medium', () => {
            game.init('medium');
            const config = game.getDifficultyConfig();
            expect(config.rows).toBe(4);
            expect(config.cols).toBe(4);
            expect(config.totalCards).toBe(16);
        });

        it('should return correct config for hard', () => {
            game.init('hard');
            const config = game.getDifficultyConfig();
            expect(config.rows).toBe(4);
            expect(config.cols).toBe(6);
            expect(config.totalCards).toBe(24);
        });
    });
});
