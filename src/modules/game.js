// Game Core Logic Module
import { shuffleArray } from '../utils/shuffle.js';

export class Game {
    constructor() {
        this.state = {
            deck: [],
            flipped: [],
            matched: new Set(),
            moves: 0,
            score: 0,
            streakCount: 0,
            startTime: null,
            elapsedTime: 0,
            difficulty: 'medium',
            isPaused: false,
            isWon: false,
            isLocked: false
        };

        this.timerInterval = null;
        this.iconSets = {
            easy: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝'],
            medium: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🥭'],
            hard: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🥭', '🍒', '🍈', '🥥', '🍋']
        };
    }

    init(difficulty = 'medium') {
        this.state.difficulty = difficulty;
        this.state.deck = this.createDeck();
        this.state.flipped = [];
        this.state.matched = new Set();
        this.state.moves = 0;
        this.state.score = 0;
        this.state.streakCount = 0;
        this.state.startTime = null;
        this.state.elapsedTime = 0;
        this.state.isPaused = false;
        this.state.isWon = false;
        this.state.isLocked = false;

        this.stopTimer();
    }

    createDeck() {
        const icons = this.iconSets[this.state.difficulty];
        const deck = [];

        // Create pairs
        icons.forEach((icon, index) => {
            deck.push({ id: index * 2, icon, matched: false });
            deck.push({ id: index * 2 + 1, icon, matched: false });
        });

        // Shuffle the deck
        return shuffleArray(deck);
    }

    flipCard(cardId) {
        if (this.state.isLocked || this.state.isPaused || this.state.isWon) {
            return false;
        }

        const card = this.state.deck.find((c) => c.id === cardId);
        if (!card || card.matched || this.state.flipped.includes(cardId)) {
            return false;
        }

        // Start timer on first flip
        if (this.state.startTime === null) {
            this.startTimer();
        }

        this.state.flipped.push(cardId);

        // If two cards are flipped, check for match
        if (this.state.flipped.length === 2) {
            this.state.moves++;
            this.state.isLocked = true;

            setTimeout(() => {
                this.checkMatch();
                this.state.isLocked = false;
            }, 800);
        }

        return true;
    }

    checkMatch() {
        const [card1Id, card2Id] = this.state.flipped;
        const card1 = this.state.deck.find((c) => c.id === card1Id);
        const card2 = this.state.deck.find((c) => c.id === card2Id);

        if (card1.icon === card2.icon) {
            // Match found
            card1.matched = true;
            card2.matched = true;
            this.state.matched.add(card1Id);
            this.state.matched.add(card2Id);

            // Update score
            this.state.score += 10;
            this.state.streakCount++;

            // Streak bonus
            if (this.state.streakCount >= 3) {
                this.state.score += 5;
                this.state.streakCount = 0;
            }

            // Check win condition
            if (this.state.matched.size === this.state.deck.length) {
                this.state.isWon = true;
                this.stopTimer();
            }
        } else {
            // No match
            this.state.score = Math.max(0, this.state.score - 2);
            this.state.streakCount = 0;
        }

        this.state.flipped = [];
    }

    startTimer() {
        this.state.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (!this.state.isPaused) {
                this.state.elapsedTime = Math.floor((Date.now() - this.state.startTime) / 1000);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    togglePause() {
        this.state.isPaused = !this.state.isPaused;

        if (this.state.isPaused) {
            this.stopTimer();
        } else if (this.state.startTime !== null) {
            // Resume timer
            this.state.startTime = Date.now() - this.state.elapsedTime * 1000;
            this.startTimer();
        }
    }

    restart() {
        this.stopTimer();
        this.init(this.state.difficulty);
    }

    getState() {
        return { ...this.state };
    }

    getCardById(cardId) {
        return this.state.deck.find((c) => c.id === cardId);
    }

    getDifficultyConfig() {
        const configs = {
            easy: { rows: 3, cols: 4, totalCards: 12 },
            medium: { rows: 4, cols: 4, totalCards: 16 },
            hard: { rows: 4, cols: 6, totalCards: 24 }
        };
        return configs[this.state.difficulty];
    }
}
