// Main entry point for the Memory Card Game
import { Game } from './modules/game.js';
import { DOMRenderer } from './modules/dom.js';
import { AccessibilityManager } from './modules/a11y.js';
import { StorageManager } from './modules/storage.js';

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

        // Load best scores and render panel
        this.initBestScoresPanel();
    }

    setupEventListeners() {
        // Difficulty selector
        const difficultySelect = document.getElementById('difficulty');
        difficultySelect.addEventListener('change', (e) => {
            this.game.init(e.target.value);
            this.renderer.renderBoard(this.game.getState());
        });

        // Restart button
        const restartBtn = document.getElementById('restart');
        restartBtn.addEventListener('click', () => {
            this.game.restart();
            this.renderer.renderBoard(this.game.getState());
        });

        // Pause button
        const pauseBtn = document.getElementById('pause');
        pauseBtn.addEventListener('click', () => {
            this.game.togglePause();
            this.renderer.updatePauseButton(this.game.getState().isPaused);
        });

        // Play again button
        const playAgainBtn = document.getElementById('playAgain');
        playAgainBtn.addEventListener('click', () => {
            this.closeWinModal();
            this.game.restart();
            this.renderer.renderBoard(this.game.getState());
        });

        // Card clicks (event delegation)
        const board = document.getElementById('board');
        board.addEventListener('click', (e) => {
            const card = e.target.closest('button.card');
            if (card && card.dataset.id && !this.game.getState().isLocked) {
                const cardId = parseInt(card.dataset.id);
                if (!isNaN(cardId)) {
                    this.handleCardClick(cardId);
                }
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

        // Modal Escape key handler
        const modal = document.getElementById('winModal');
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeWinModal();
                }
            });
        }
    }

    handleCardClick(cardId) {
        const result = this.game.flipCard(cardId);

        if (result) {
            this.renderer.updateCard(cardId, this.game.getState());
            this.renderer.updateStats(this.game.getState());

            const state = this.game.getState();
            
            // If two cards are flipped, update UI after match check completes
            if (state.flipped.length === 2) {
                // Capture flipped card IDs before they're cleared
                const flippedIds = [...state.flipped];
                
                setTimeout(() => {
                    // Update all cards and stats after match check
                    flippedIds.forEach(id => {
                        this.renderer.updateCard(id, this.game.getState());
                    });
                    this.renderer.updateStats(this.game.getState());

                    // Check for win condition after match check
                    if (this.game.getState().isWon) {
                        this.handleWin();
                    }
                }, 800);
            }

            // Check for win condition
            if (this.game.getState().isWon) {
                this.handleWin();
            }
        }
    }

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
            case ' ':
                e.preventDefault();
                const focusedCard = document.activeElement.closest('button.card');
                if (focusedCard && focusedCard.dataset.id) {
                    const cardId = parseInt(focusedCard.dataset.id);
                    if (!isNaN(cardId)) {
                        this.handleCardClick(cardId);
                    }
                }
                break;
        }
    }

    handleWin() {
        const state = this.game.getState();

        // Save best score if applicable
        this.storage.saveScore(state.difficulty, state.elapsedTime, state.score);
        this.renderBestScoresPanel();

        // Show win modal
        this.showWinModal(state);

        // Announce win to screen readers
        this.a11y.announce(`Congratulations! You won in ${state.elapsedTime} seconds with a score of ${state.score}.`);
    }

    showWinModal(state) {
        const modal = document.getElementById('winModal');
        const bestTime = this.storage.getBestTime(state.difficulty);

        document.getElementById('finalTime').textContent = state.elapsedTime;
        document.getElementById('finalScore').textContent = state.score;
        document.getElementById('bestTime').textContent = bestTime || '--';

        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';

        // Focus on play again button
        document.getElementById('playAgain').focus();
    }

    closeWinModal() {
        const modal = document.getElementById('winModal');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }

    // Best Scores panel
    initBestScoresPanel() {
        const noticeEl = document.getElementById('storageNotice');
        if (!this.storage.isStorageAvailable()) {
            if (noticeEl) {
                noticeEl.hidden = false;
                noticeEl.textContent = 'Storage unavailable. Best scores will not be saved.';
            }
            return;
        }
        // Ensure scores exist and render
        this.storage.loadBestScores();
        this.renderBestScoresPanel();
    }

    renderBestScoresPanel() {
        const scores = this.storage.getAllScores();
        const easy = document.getElementById('bestEasy');
        const medium = document.getElementById('bestMedium');
        const hard = document.getElementById('bestHard');
        if (easy && medium && hard) {
            easy.textContent = this.formatScore(scores.easy);
            medium.textContent = this.formatScore(scores.medium);
            hard.textContent = this.formatScore(scores.hard);
        }
    }

    formatScore(entry) {
        if (!entry || entry.time === null) return '--';
        return `${entry.time}s / ${entry.score}`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGameApp();
});
