// Accessibility Manager Module
/**
 * @typedef {import('./game.js').Difficulty} Difficulty
 * @typedef {import('./game.js').GameState} GameState
 */

export class AccessibilityManager {
    constructor() {
        /** @type {HTMLElement | null} */
        this.announcementsElement = document.getElementById('announcements');
        /** @type {HTMLElement | null} */
        this.lastFocusedElement = null;
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupMotionPreferences();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            
            // Handle arrow key navigation for cards
            if (activeElement && activeElement.classList.contains('card')) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    this.handleArrowNavigation(e.key, /** @type {HTMLElement} */ (activeElement));
                }
            }
        });
    }

    /**
     * @param {string} direction
     * @param {HTMLElement} currentCard
     */
    handleArrowNavigation(direction, currentCard) {
        const board = document.getElementById('board');
        if (!board) return;
        const cards = /** @type {HTMLElement[]} */ (Array.from(board.querySelectorAll('.card')));
        const currentIndex = cards.indexOf(currentCard);
        
        let newIndex = currentIndex;
        const config = this.getGridConfig(board);
        
        switch (direction) {
            case 'ArrowUp':
                newIndex = Math.max(0, currentIndex - config.cols);
                break;
            case 'ArrowDown':
                newIndex = Math.min(cards.length - 1, currentIndex + config.cols);
                break;
            case 'ArrowLeft':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowRight':
                newIndex = Math.min(cards.length - 1, currentIndex + 1);
                break;
        }
        
        if (newIndex !== currentIndex && cards[newIndex]) {
            cards[newIndex].focus();
        }
    }

    /**
     * @param {HTMLElement} board
     */
    getGridConfig(board) {
        const boardClass = board.className;
        if (boardClass.includes('easy')) {
            return { rows: 3, cols: 4 };
        } else if (boardClass.includes('hard')) {
            return { rows: 4, cols: 6 };
        } else {
            return { rows: 4, cols: 4 }; // medium
        }
    }

    setupFocusManagement() {
        // Track focus changes
        document.addEventListener('focusin', (e) => {
            const target = /** @type {HTMLElement} */ (e.target);
            if (target.classList.contains('card') ||
                target.classList.contains('controls') ||
                target.closest('.controls')) {
                this.lastFocusedElement = target;
            }
        });

        // Handle modal focus management
        const modal = document.getElementById('winModal');
        if (modal) {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModalAndRestoreFocus();
                }
            });
        }
    }

    closeModalAndRestoreFocus() {
        const modal = document.getElementById('winModal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
        
        // Restore focus to last focused element or first card
        if (this.lastFocusedElement && this.lastFocusedElement.classList.contains('card')) {
            this.lastFocusedElement.focus();
        } else {
            const firstCard = /** @type {HTMLElement} */ (document.querySelector('.card'));
            if (firstCard) {
                firstCard.focus();
            }
        }
    }

    setupMotionPreferences() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        // Listen for changes to motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }

    /**
     * @param {string} message
     * @param {'polite' | 'assertive'} [priority='polite']
     */
    announce(message, priority = 'polite') {
        if (!this.announcementsElement) return;

        // Clear previous announcements
        this.announcementsElement.textContent = '';
        
        // Set priority
        this.announcementsElement.setAttribute('aria-live', priority);
        
        // Add new announcement
        setTimeout(() => {
            if (this.announcementsElement) {
                this.announcementsElement.textContent = message;
            }
        }, 100);
    }

    /**
     * @param {number} score
     */
    announceMatch(score) {
        this.announce(`Match found! +10 points. Total score: ${score}`);
    }

    /**
     * @param {number} score
     */
    announceMismatch(score) {
        this.announce(`No match. -2 points. Total score: ${score}`);
    }

    /**
     * @param {number} score
     */
    announceStreakBonus(score) {
        this.announce(`Streak bonus! +5 points. Total score: ${score}`);
    }

    /**
     * @param {number} time
     * @param {number} score
     */
    announceWin(time, score) {
        this.announce(`Congratulations! You won in ${time} seconds with a score of ${score}!`, 'assertive');
    }

    /**
     * @param {Difficulty} difficulty
     */
    announceGameStart(difficulty) {
        const difficultyNames = {
            easy: 'Easy (4×3)',
            medium: 'Medium (4×4)',
            hard: 'Hard (6×4)'
        };
        this.announce(`Game started. Difficulty: ${difficultyNames[difficulty]}`);
    }

    /**
     * @param {boolean} isPaused
     */
    announcePause(isPaused) {
        const message = isPaused ? 'Game paused' : 'Game resumed';
        this.announce(message);
    }

    announceRestart() {
        this.announce('Game restarted');
    }

    /**
     * @param {HTMLElement} cardElement
     * @param {GameState} state
     */
    updateCardAriaLabel(cardElement, state) {
        const cardId = parseInt(cardElement.dataset.id || '');
        const card = state.deck.find(c => c.id === cardId);
        const isFlipped = state.flipped.includes(cardId);
        const isMatched = state.matched.has(cardId);

        let label = `Card ${cardId + 1} of ${state.deck.length}`;
        
        if (isMatched) {
            label += ', matched';
        } else if (isFlipped) {
            label += `, showing ${card?.icon}`;
        } else {
            label += ', face down';
        }

        cardElement.setAttribute('aria-label', label);
    }

    /**
     * @param {GameState} state
     */
    updateControlAriaLabels(state) {
        const pauseButton = document.getElementById('pause');
        const restartButton = document.getElementById('restart');
        const difficultySelect = document.getElementById('difficulty');

        if (pauseButton) {
            pauseButton.setAttribute('aria-label', state.isPaused ? 'Resume Game' : 'Pause Game');
        }

        if (restartButton) {
            restartButton.setAttribute('aria-label', 'Restart Game');
        }

        if (difficultySelect) {
            difficultySelect.setAttribute('aria-label', `Game Difficulty: ${state.difficulty}`);
        }
    }

    focusFirstInteractiveElement() {
        const firstCard = /** @type {HTMLElement} */ (document.querySelector('.card'));
        if (firstCard) {
            firstCard.focus();
        } else {
            const firstControl = /** @type {HTMLElement} */ (document.querySelector('.controls button, .controls select'));
            if (firstControl) {
                firstControl.focus();
            }
        }
    }

    /**
     * @param {HTMLElement} modal
     */
    trapFocusInModal(modal) {
        const focusableElements = /** @type {NodeListOf<HTMLElement>} */ (modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // High contrast mode detection
    isHighContrastMode() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }

    // Color scheme detection
    isDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
