// DOM Rendering Module
export class DOMRenderer {
    constructor() {
        this.board = document.getElementById('board');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.pauseButton = document.getElementById('pause');
    }

    renderBoard(state) {
        this.clearBoard();
        this.updateBoardClass(state.difficulty);

        state.deck.forEach((card) => {
            const cardElement = this.createCardElement(card, state);
            this.board.appendChild(cardElement);
        });

        this.updateStats(state);
    }

    clearBoard() {
        this.board.innerHTML = '';
    }

    updateBoardClass(difficulty) {
        this.board.className = `board ${difficulty}`;
    }

    createCardElement(card, state) {
        const cardEl = document.createElement('button');
        cardEl.className = 'card';
        cardEl.dataset.id = card.id;
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

    updateCard(cardId, state) {
        const cardElement = this.board.querySelector(`[data-id="${cardId}"]`);
        if (!cardElement) return;

        const card = state.deck.find((c) => c.id === cardId);
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
            cardElement.setAttribute('aria-label', `Card ${cardId + 1} of ${state.deck.length}, showing ${card.icon}`);
        } else {
            cardElement.classList.remove('flipped', 'matched');
            cardElement.setAttribute('aria-pressed', 'false');
            cardElement.setAttribute('aria-label', `Card ${cardId + 1} of ${state.deck.length}, face down`);
        }
    }

    updateStats(state) {
        this.timerElement.textContent = state.elapsedTime;
        this.scoreElement.textContent = state.score;
        this.movesElement.textContent = state.moves;
    }

    updatePauseButton(isPaused) {
        this.pauseButton.textContent = isPaused ? 'RESUME' : 'PAUSE';
        this.pauseButton.setAttribute('aria-label', isPaused ? 'Resume Game' : 'Pause Game');
    }

    updateDifficultySelector(difficulty) {
        const selector = document.getElementById('difficulty');
        selector.value = difficulty;
    }

    showWinModal(state, bestTime) {
        const modal = document.getElementById('winModal');
        const finalTime = document.getElementById('finalTime');
        const finalScore = document.getElementById('finalScore');
        const bestTimeElement = document.getElementById('bestTime');

        finalTime.textContent = state.elapsedTime;
        finalScore.textContent = state.score;
        bestTimeElement.textContent = bestTime || '--';

        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';

        // Focus on play again button
        document.getElementById('playAgain').focus();
    }

    hideWinModal() {
        const modal = document.getElementById('winModal');
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
    }

    // Animation helpers
    animateCardFlip(cardElement, isFlipped) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Skip animation for users who prefer reduced motion
            cardElement.classList.toggle('flipped', isFlipped);
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            cardElement.classList.toggle('flipped', isFlipped);

            // Wait for animation to complete
            setTimeout(resolve, 400);
        });
    }

    // Focus management
    focusCard(cardId) {
        const cardElement = this.board.querySelector(`[data-id="${cardId}"]`);
        if (cardElement) {
            cardElement.focus();
        }
    }

    focusFirstCard() {
        const firstCard = this.board.querySelector('button.card');
        if (firstCard) {
            firstCard.focus();
        }
    }

    // Keyboard navigation helpers
    getCardPosition(cardElement) {
        const cards = Array.from(this.board.querySelectorAll('button.card'));
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
        const cards = Array.from(this.board.querySelectorAll('button.card'));
        const targetCard = cards[newIndex];

        if (targetCard) {
            targetCard.focus();
        }
    }
}
