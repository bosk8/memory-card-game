// Accessibility Manager Module
export class AccessibilityManager {
    constructor() {
        this.announcementsElement = document.getElementById('announcements');
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
            if (activeElement.classList.contains('card')) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    this.handleArrowNavigation(e.key, activeElement);
                }
            }
        });
    }

    handleArrowNavigation(direction, currentCard) {
        const board = document.getElementById('board');
        const cards = Array.from(board.querySelectorAll('.card'));
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
            if (
                e.target.classList.contains('card') ||
                e.target.classList.contains('controls') ||
                e.target.closest('.controls')
            ) {
                this.lastFocusedElement = e.target;
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
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';

        // Restore focus to last focused element or first card
        if (this.lastFocusedElement && this.lastFocusedElement.classList.contains('card')) {
            this.lastFocusedElement.focus();
        } else {
            const firstCard = document.querySelector('.card');
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

    announce(message, priority = 'polite') {
        if (!this.announcementsElement) return;

        // Clear previous announcements
        this.announcementsElement.textContent = '';

        // Set priority
        this.announcementsElement.setAttribute('aria-live', priority);

        // Add new announcement
        setTimeout(() => {
            this.announcementsElement.textContent = message;
        }, 100);
    }

    announceMatch(score) {
        this.announce(`Match found! +10 points. Total score: ${score}`);
    }

    announceMismatch(score) {
        this.announce(`No match. -2 points. Total score: ${score}`);
    }

    announceStreakBonus(score) {
        this.announce(`Streak bonus! +5 points. Total score: ${score}`);
    }

    announceWin(time, score) {
        this.announce(`Congratulations! You won in ${time} seconds with a score of ${score}!`, 'assertive');
    }

    announceGameStart(difficulty) {
        const difficultyNames = {
            easy: 'Easy (4×3)',
            medium: 'Medium (4×4)',
            hard: 'Hard (6×4)'
        };
        this.announce(`Game started. Difficulty: ${difficultyNames[difficulty]}`);
    }

    announcePause(isPaused) {
        const message = isPaused ? 'Game paused' : 'Game resumed';
        this.announce(message);
    }

    announceRestart() {
        this.announce('Game restarted');
    }

    // ARIA label helpers
    updateCardAriaLabel(cardElement, state) {
        const cardId = parseInt(cardElement.dataset.id);
        const card = state.deck.find((c) => c.id === cardId);
        const isFlipped = state.flipped.includes(cardId);
        const isMatched = state.matched.has(cardId);

        let label = `Card ${cardId + 1} of ${state.deck.length}`;

        if (isMatched) {
            label += ', matched';
        } else if (isFlipped) {
            label += `, showing ${card.icon}`;
        } else {
            label += ', face down';
        }

        cardElement.setAttribute('aria-label', label);
    }

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

    // Focus helpers
    focusFirstInteractiveElement() {
        const firstCard = document.querySelector('.card');
        if (firstCard) {
            firstCard.focus();
        } else {
            const firstControl = document.querySelector('.controls button, .controls select');
            if (firstControl) {
                firstControl.focus();
            }
        }
    }

    trapFocusInModal(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
