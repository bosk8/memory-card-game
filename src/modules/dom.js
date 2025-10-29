// DOM Rendering Module
/**
 * @typedef {import('./game.js').GameState} GameState
 * @typedef {import('./game.js').Card} Card
 * @typedef {import('./game.js').Difficulty} Difficulty
 */

export class DOMRenderer {
    constructor() {
        this.board = document.getElementById('board');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.pauseButton = document.getElementById('pause');

        if (!this.board || !this.timerElement || !this.scoreElement || !this.movesElement || !this.pauseButton) {
            throw new Error('Missing required DOM elements');
        }
    }

    /**
     * @param {GameState} state
     */
    renderBoard(state) {
        this.clearBoard();
        this.updateBoardClass(state.difficulty);
        
        state.deck.forEach(card => {
            const cardElement = this.createCardElement(card, state);
            if (this.board) {
                this.board.appendChild(cardElement);
            }
        });
        
        this.updateStats(state);
    }

    clearBoard() {
        if (this.board) {
            this.board.innerHTML = '';
        }
    }

    /**
     * @param {Difficulty} difficulty
     */
    updateBoardClass(difficulty) {
        if (this.board) {
            this.board.className = `board ${difficulty}`;
        }
    }

    /**
     * @param {Card} card
     * @param {GameState} state
     * @returns {HTMLButtonElement}
     */
    createCardElement(card, state) {
        const cardEl = document.createElement('button');
        cardEl.className = 'card';
        cardEl.dataset.id = String(card.id);
        cardEl.dataset.icon = card.icon;
        cardEl.setAttribute('aria-pressed', 'false');
        cardEl.setAttribute('aria-label', `Card ${card.id + 1} of ${state.deck.length}`);
        cardEl.setAttribute('tabindex', '0');
        
        // Card front (question mark)
        const front = document.createElement('span');
        front.className = 'card-front';
        front.setAttribute('aria-hidden', 'true');
        front.textContent = '?';
        
        // Card back (icon)
        const back = document.createElement('span');
        back.className = 'card-back';
        back.setAttribute('aria-hidden', 'true');
        back.textContent = card.icon;
        
        cardEl.appendChild(front);
        cardEl.appendChild(back);
        
        return cardEl;
    }

    /**
     * @param {number} cardId
     * @param {GameState} state
     */
    updateCard(cardId, state) {
        const cardElement = this.board.querySelector(`[data-id="${cardId}"]`);
        if (!cardElement) return;

        const card = state.deck.find(c => c.id === cardId);
        const isFlipped = state.flipped.includes(cardId);
        const isMatched = state.matched.has(cardId);

        // Update visual state
        if (isMatched) {
            cardElement.classList.add('matched');
            cardElement.setAttribute('aria-pressed', 'true');
            cardElement.setAttribute('aria-label', `Card ${cardId + 1} of ${state.deck.length}, matched`);
        } else if (isFlipped) {
            cardElement.classList.add('flipped');
            cardElement.setAttribute('aria-pressed', 'true');
            cardElement.setAttribute('aria-label', `Card ${cardId + 1} of ${state.deck.length}, showing ${card?.icon}`);
        } else {
            cardElement.classList.remove('flipped', 'matched');
            cardElement.setAttribute('aria-pressed', 'false');
            cardElement.setAttribute('aria-label', `Card ${cardId + 1} of ${state.deck.length}, face down`);
        }
    }

    /**
     * @param {GameState} state
     */
    updateStats(state) {
        if (this.timerElement) this.timerElement.textContent = String(state.elapsedTime);
        if (this.scoreElement) this.scoreElement.textContent = String(state.score);
        if (this.movesElement) this.movesElement.textContent = String(state.moves);
    }

    /**
     * @param {boolean} isPaused
     */
    updatePauseButton(isPaused) {
        if (this.pauseButton) {
            this.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
            this.pauseButton.setAttribute('aria-label', isPaused ? 'Resume Game' : 'Pause Game');
        }
    }

    /**
     * @param {Difficulty} difficulty
     */
    updateDifficultySelector(difficulty) {
        const selector = /** @type {HTMLSelectElement} */ (document.getElementById('difficulty'));
        if (selector) {
            selector.value = difficulty;
        }
    }

    /**
     * @param {GameState} state
     * @param {number | null} bestTime
     */
    showWinModal(state, bestTime) {
        const modal = document.getElementById('winModal');
        const finalTime = document.getElementById('finalTime');
        const finalScore = document.getElementById('finalScore');
        const bestTimeElement = document.getElementById('bestTime');

        if (finalTime) finalTime.textContent = String(state.elapsedTime);
        if (finalScore) finalScore.textContent = String(state.score);
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

    hideWinModal() {
        const modal = document.getElementById('winModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
    }

    /**
     * @param {HTMLElement} cardElement
     * @param {boolean} isFlipped
     * @returns {Promise<void>}
     */
    animateCardFlip(cardElement, isFlipped) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip animation for users who prefer reduced motion
            cardElement.classList.toggle('flipped', isFlipped);
            return Promise.resolve();
        }

        return new Promise(resolve => {
            cardElement.classList.toggle('flipped', isFlipped);
            
            // Wait for animation to complete
            setTimeout(resolve, 400);
        });
    }

    /**
     * @param {number} cardId
     */
    focusCard(cardId) {
        const cardElement = /** @type {HTMLElement} */ (this.board.querySelector(`[data-id="${cardId}"]`));
        if (cardElement) {
            cardElement.focus();
        }
    }

    focusFirstCard() {
        const firstCard = /** @type {HTMLElement} */ (this.board.querySelector('.card'));
        if (firstCard) {
            firstCard.focus();
        }
    }

    /**
     * @param {HTMLElement} cardElement
     */
    getCardPosition(cardElement) {
        const cards = Array.from(this.board.querySelectorAll('.card'));
        const index = cards.indexOf(cardElement);
        const config = this.getCurrentGridConfig();
        
        return {
            index,
            row: Math.floor(index / config.cols),
            col: index % config.cols
        };
    }

    getCurrentGridConfig() {
        const boardClass = this.board.className;
        if (boardClass.includes('easy')) {
            return { rows: 3, cols: 4 };
        } else if (boardClass.includes('hard')) {
            return { rows: 4, cols: 6 };
        } else {
            return { rows: 4, cols: 4 }; // medium
        }
    }

    /**
     * @param {HTMLElement} currentCard
     * @param {string} direction
     */
    navigateToCard(currentCard, direction) {
        const config = this.getCurrentGridConfig();
        const currentPos = this.getCardPosition(currentCard);
        let newRow = currentPos.row;
        let newCol = currentPos.col;

        switch (direction) {
            case 'ArrowUp':
                newRow = Math.max(0, currentPos.row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(config.rows - 1, currentPos.row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, currentPos.col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(config.cols - 1, currentPos.col + 1);
                break;
        }

        const newIndex = newRow * config.cols + newCol;
        const cards = Array.from(this.board.querySelectorAll('.card'));
        const targetCard = /** @type {HTMLElement} */ (cards[newIndex]);

        if (targetCard) {
            targetCard.focus();
        }
    }
}
