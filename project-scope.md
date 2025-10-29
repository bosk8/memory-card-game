```markdown
# Memory Card Game — 8-Step Project Scope

## 1) Define Specifications
- **Goal**: Flip cards to match pairs. Win when all pairs are matched.
- **Modes**: Easy (4×3 = 12 cards), Medium (4×4 = 16 cards), Hard (6×4 = 24 cards).
- **Scoring**: +10 points per match, −2 points per mismatch, bonus multiplier for consecutive matches (e.g., +5 every 3rd match), elapsed time tracking.
- **UX Features**: Keyboard support (Enter/Space to flip, R to restart, P to pause), difficulty selector before game start, restart button, pause/resume toggle.
- **Acceptance Criteria**:
  - Written ruleset document provided.
  - Game rules enforced consistently across all difficulties.
  - Win condition triggers modal showing final stats (time, score, best time).

## 2) Scaffold Project Structure
```
/memory-game
├── /src
│   ├── index.html
│   ├── styles.css
│   ├── main.js                 // entry point, app initialization
│   ├── modules/
│   │   ├── game.js             // game state + core logic
│   │   ├── dom.js              // rendering + event delegation
│   │   ├── a11y.js             // accessibility: focus, ARIA labels
│   │   └── storage.js          // localStorage save/load for best scores
│   └── utils/
│       └── shuffle.js          // Fisher-Yates shuffle utility
├── /assets/icons/*.svg         // card icon SVGs (12-24 icons per difficulty)
└── README.md
```

- **Framework**: Vanilla JavaScript ES6+ modules (no build step for simplicity).
- **Acceptance Criteria**:
  - `index.html` loads without errors.
  - Blank game board renders on first load.
  - All modules import/export correctly.
  - No console errors.

## 3) Model & Shuffle Algorithm

### Game State Shape
```
{
  deck: [
    { id: 0, icon: 'apple', matched: false },
    { id: 1, icon: 'apple', matched: false },
    ...
  ],
  flipped: ,              // indices of currently flipped cards[1]
  matched: new Set(),     // indices of successfully matched pairs[1]
  moves: 42,
  score: 410,
  streakCount: 3,
  startTime: 1729900000000,     // milliseconds
  elapsedTime: 45,              // seconds
  difficulty: 'medium',          // 'easy' | 'medium' | 'hard'
  isPaused: false,
  isWon: false
}
```

### Shuffle Implementation
- Use **Fisher-Yates algorithm** for unbiased randomization (each permutation equally likely).
- Create deck by duplicating icon list (e.g., [🍎, 🍎, 🍊, 🍊, ...]) per difficulty.
- Shuffle in-place: `for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }`

### Acceptance Criteria
- ✓ New shuffle on every game start: no duplicates beyond pairs.
- ✓ Fisher-Yates verified with distribution test (e.g., 1,000 shuffles show uniform variance).
- ✓ No repeated pairs within difficulty.

## 4) Render Board & Wire Events

### DOM Structure
```
<div id="game-container" class="game">
  <header>
    <h1>Memory Card Game</h1>
    <div class="stats">
      <span class="timer">Time: <span id="timer">0</span>s</span>
      <span class="score">Score: <span id="score">0</span></span>
      <span class="moves">Moves: <span id="moves">0</span></span>
    </div>
  </header>
  
  <div class="controls">
    <select id="difficulty" aria-label="Game Difficulty">
      <option value="easy">Easy (4×3)</option>
      <option value="medium" selected>Medium (4×4)</option>
      <option value="hard">Hard (6×4)</option>
    </select>
    <button id="restart" aria-label="Restart Game">Restart</button>
    <button id="pause" aria-label="Pause Game">Pause</button>
  </div>

  <div id="board" class="board" role="main" aria-label="Game Board">
    <!-- Cards rendered here by JS -->
  </div>
</div>
```

### Card Element
```
<button 
  class="card" 
  data-id="0" 
  data-icon="apple"
  aria-pressed="false"
  aria-label="Card 1">
  <span class="card-front" aria-hidden="true">?</span>
  <span class="card-back" aria-hidden="true">🍎</span>
</button>
```

### Event Delegation Strategy
- Single `click` listener on `#board` with `e.target.closest('.card')`.
- Keyboard listeners on `document` for pause (P), restart (R), arrow navigation.
- Lock input during flip animations and comparison delay.
- Debounce: set `isLocked` flag during 500ms flip duration; release after match/mismatch logic.

### Acceptance Criteria
- ✓ Clicks and keyboard (Enter/Space) flip cards.
- ✓ No double-flips within same pair selection.
- ✓ No race conditions (input locked during animations).

## 5) Core Game Logic

### Turn Flow
1. **First card flip**: Store `flipped[0]`, keep card face-up.
2. **Second card flip**: Store `flipped[1]`.
3. **Compare**:
   - If `deck[flipped[0]].icon === deck[flipped[1]].icon`:
     - Mark both as `matched`, add to `matched` Set.
     - **Score**: +10 points; if `streakCount++ === 3`, add +5 bonus.
     - Keep both face-up.
   - Else:
     - **Score**: −2 points.
     - Reset `streakCount` to 0.
     - After 800ms delay, flip both face-down.
4. **Moves**: Increment after every pair comparison.
5. **Timer**: Increment elapsed seconds every 1000ms (unless paused).

### Win Condition
- Check if `matched.size === deck.length / 2`.
- Stop timer, show modal with stats: time, score, best time (from localStorage).

### Acceptance Criteria
- ✓ Rules enforced across all difficulties.
- ✓ Score/streak logic verified with unit tests.
- ✓ Timer accurate to ±1 second.
- ✓ Win modal appears on game completion.

## 6) Animation & Performance

### CSS Transitions
```
.card {
  perspective: 1000px;
  transition: transform 0.4s ease-in-out;
}

.card.flipped {
  transform: rotateY(180deg);
}
```

### JavaScript Animation Orchestration
- Use `requestAnimationFrame` for frame-perfect timing.
- Chain animations with callbacks:
  ```
  flip(cardEl, true); // trigger CSS transform
  setTimeout(() => {
    flip(cardEl, false); // unflip after delay
  }, 800);
  ```

### Motion Preferences
```
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Disable flip animations; instant state changes
  cardEl.classList.add('no-motion');
}
```

### Performance Optimization
- Render cards once on game init; reuse DOM elements.
- Throttle timer updates to 100ms intervals (display refresh).
- No excessive reflows: batch DOM updates via `requestAnimationFrame`.

### Acceptance Criteria
- ✓ Smooth 60 FPS on modern hardware.
- ✓ Motion reduced when `prefers-reduced-motion` is set.
- ✓ No janky animations or dropped frames.

## 7) Accessibility & UX Polish

### Semantics & ARIA
- Each card is a `<button>` with `aria-pressed="false|true"`.
- Use `aria-label` for card position: "Card 1 of 16".
- Live region (`aria-live="polite"`) announces matches: "Match! +10 points."
- Game container has `role="main"`.

### Keyboard Navigation
- Tab through cards (visual focus ring).
- Enter/Space to flip focused card.
- R to restart, P to pause.
- Up/Down/Left/Right to navigate grid.

### Focus Management
- Keep focus on the last interacted card.
- Visible focus ring: `outline: 3px solid #0066cc;`

### Visual Accessibility
- **Contrast**: All text ≥ 4.5:1 against backgrounds (WCAG AA).
- **Touch targets**: Cards ≥ 44×44px.
- **Responsive**: Grid adapts to mobile, tablet, desktop.

### Acceptance Criteria
- ✓ Full keyboard play without mouse.
- ✓ Screen reader announces game state, matches, score.
- ✓ Lighthouse Accessibility score ≥ 95.
- ✓ Mobile responsive (tested at 375px–1920px widths).

## 8) Persistence, Results & QA

### Local Storage Schema
```
// storage.js
const scores = {
  easy: { time: 45, score: 520, date: '2025-10-28' },
  medium: { time: 120, score: 310, date: '2025-10-27' },
  hard: { time: 200, score: 100, date: '2025-10-26' }
};
localStorage.setItem('memoryGameScores', JSON.stringify(scores));
```

### Save/Load Logic
- On game win: Compare current score/time with best saved; update if better.
- On app load: Fetch saved best times from `localStorage` and display.
- Add version field to detect schema changes in future updates.

### Win Modal
```
<div class="modal" id="winModal" role="dialog" aria-labelledby="modalTitle">
  <h2 id="modalTitle">🎉 You Won!</h2>
  <p>Time: <span id="finalTime">120</span>s</p>
  <p>Score: <span id="finalScore">310</span></p>
  <p>Best Time: <span id="bestTime">45</span>s</p>
  <button id="playAgain">Play Again</button>
</div>
```

### Unit Tests
```
// game.test.js
describe('Fisher-Yates Shuffle', () => {
  test('produces unique permutation', () => { ... });
  test('no bias toward any position', () => { ... });
});

describe('Match Logic', () => {
  test('matching pair increments score by 10', () => { ... });
  test('mismatch decrements score by 2', () => { ... });
  test('streak bonus triggers every 3rd match', () => { ... });
});

describe('Timer', () => {
  test('increments by 1 every second', () => { ... });
  test('pauses and resumes correctly', () => { ... });
});
```

### Manual QA Checklist
- [ ] **Mobile**: Play on iPhone SE, Android (375px width). Cards clickable. No overflow.
- [ ] **Desktop**: Test on Chrome, Firefox, Safari. Smooth animations. Focus visible.
- [ ] **Slow CPU**: Test on throttled device (DevTools). No animations freeze.
- [ ] **Reduced Motion**: Disable animations, verify instant flips.
- [ ] **Accessibility**: Run Lighthouse. Use screen reader (NVDA/JAWS). Tab through grid.
- [ ] **Storage**: Play 3 games, clear browser cache, reload. Best scores persist.

### Acceptance Criteria
- ✓ All unit tests pass.
- ✓ Best scores persist across sessions.
- ✓ Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90.
- ✓ QA checklist fully passed (no regressions).

---

## Deliverables
- **Source code**: `/memory-game` directory with all modules.
- **README.md**: Setup instructions, features list, how to run tests.
- **Lighthouse report** (screenshot or JSON export).
- **Accessibility checklist** with manual test notes (WCAG 2.1 AA compliance verified).
```
