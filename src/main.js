// Main entry point for the Memory Card Game
import { Game } from './modules/game.js';
import { DOMRenderer } from './modules/dom.js';
import { AccessibilityManager } from './modules/a11y.js';
import { StorageManager } from './modules/storage.js';

/**
 * @typedef {import('./modules/game.js').Difficulty} Difficulty
 * @typedef {import('./modules/game.js').GameState} GameState
 */

class MemoryGameApp {
    constructor() {
        this.game = new Game();
        this.renderer = new DOMRenderer();
        this.a11y = new AccessibilityManager();
        this.storage = new StorageManager();
        
        this.init();
    }

    init() {
        // Initialize game with default difficulty
        this.game.init('medium');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial board
        this.renderer.renderBoard(this.game.getState());
        
        // Initialize accessibility features
        this.a11y.init();
        
        // Load best scores
        this.storage.loadBestScores();
    }

    setupEventListeners() {
        // Difficulty selector
        const difficultySelect = /** @type {HTMLSelectElement} */ (document.getElementById('difficulty'));
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.game.init(/** @type {Difficulty} */ (/** @type {HTMLSelectElement} */ (e.target).value));
                this.renderer.renderBoard(this.game.getState());
            });
        }

        // Restart button
        const restartBtn = document.getElementById('restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.game.restart();
                this.renderer.renderBoard(this.game.getState());
            });
        }

        // Pause button
        const pauseBtn = document.getElementById('pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.game.togglePause();
                this.renderer.updatePauseButton(this.game.getState().isPaused);
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('playAgain');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.closeWinModal();
                this.game.restart();
                this.renderer.renderBoard(this.game.getState());
            });
        }

        // Card clicks (event delegation)
        const board = document.getElementById('board');
        if (board) {
            board.addEventListener('click', (e) => {
                const card = /** @type {HTMLElement} */ (e.target).closest('.card');
                if (card && !this.game.getState().isLocked) {
                    const cardId = parseInt(/** @type {HTMLElement} */ (card).dataset.id || '');
                    this.handleCardClick(cardId);
                }
            });
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }

    /**
     * @param {number} cardId
     */
    handleCardClick(cardId) {
        const result = this.game.flipCard(cardId);
        
        if (result) {
            this.renderer.updateCard(cardId, this.game.getState());
            this.renderer.updateStats(this.game.getState());
            
            // Check for win condition
            if (this.game.getState().isWon) {
                this.handleWin();
            }
        }
    }

    /**
     * @param {KeyboardEvent} e
     */
    handleKeyboardInput(e) {
        switch (e.key.toLowerCase()) {
            case 'r':
                e.preventDefault();
                this.game.restart();
                this.renderer.renderBoard(this.game.getState());
                break;
            case 'p':
                e.preventDefault();
                this.game.togglePause();
                this.renderer.updatePauseButton(this.game.getState().isPaused);
                break;
            case 'enter':
            case ' ': {
                e.preventDefault();
                const focusedCard = /** @type {HTMLElement} */ (document.activeElement).closest('.card');
                if (focusedCard) {
                    const cardId = parseInt(/** @type {HTMLElement} */ (focusedCard).dataset.id || '');
                    this.handleCardClick(cardId);
                }
                break;
            }
        }
    }

    handleWin() {
        const state = this.game.getState();
        
        // Save best score if applicable
        this.storage.saveScore(state.difficulty, state.elapsedTime, state.score);
        
        // Show win modal
        this.showWinModal(state);
        
        // Announce win to screen readers
        this.a11y.announce(`Congratulations! You won in ${state.elapsedTime} seconds with a score of ${state.score}.`);
    }

    /**
     * @param {GameState} state
     */
    showWinModal(state) {
        const modal = document.getElementById('winModal');
        const bestTime = this.storage.getBestTime(state.difficulty);
        
        const finalTime = document.getElementById('finalTime');
        if (finalTime) finalTime.textContent = String(state.elapsedTime);
        const finalScore = document.getElementById('finalScore');
        if (finalScore) finalScore.textContent = String(state.score);
        const bestTimeElement = document.getElementById('bestTime');
        if (bestTimeElement) bestTimeElement.textContent = bestTime ? String(bestTime) : '--';
        
        if (modal) {
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
        }
        
        // Focus on play again button
        const playAgainButton = /** @type {HTMLButtonElement} */ (document.getElementById('playAgain'));
        if (playAgainButton) {
            playAgainButton.focus();
        }
    }

    closeWinModal() {
        const modal = document.getElementById('winModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGameApp();
});
