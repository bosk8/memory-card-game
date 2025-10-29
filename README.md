# Memory Card Game

A fully accessible, responsive memory card matching game built with vanilla JavaScript ES6+ modules.

## Features

- **Three Difficulty Levels**: Easy (4×3), Medium (4×4), Hard (6×4)
- **Smart Scoring System**: +10 points per match, -2 points per mismatch, streak bonuses
- **Timer Tracking**: Elapsed time with pause/resume functionality
- **Best Score Persistence**: LocalStorage saves your best times and scores
- **Full Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Motion Reduction**: Respects user's motion preferences

## How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard from the dropdown
2. **Flip Cards**: Click cards or use keyboard (Enter/Space) to reveal icons
3. **Match Pairs**: Find matching icon pairs to score points
4. **Win**: Match all pairs to complete the game

### Keyboard Controls

- **Arrow Keys**: Navigate between cards
- **Enter/Space**: Flip focused card
- **R**: Restart game
- **P**: Pause/Resume game
- **Tab**: Navigate through controls

## 🎮 Live Demo

**Play the game online**: https://bosk8.github.io/memory-card-game/

## Project Structure

```
memory-card-game/
├── index.html              # Main HTML file
├── src/
│   ├── styles.css          # CSS with responsive design and animations
│   ├── main.js             # Application entry point
│   ├── modules/
│   │   ├── game.js         # Core game logic and state management
│   │   ├── dom.js          # DOM rendering and manipulation
│   │   ├── a11y.js         # Accessibility features and keyboard navigation
│   │   └── storage.js      # LocalStorage management for scores
│   └── utils/
│       └── shuffle.js      # Fisher-Yates shuffle algorithm
├── assets/
│   └── icons/
│       └── icons.txt       # Card icon definitions
├── tests/
│   ├── game.test.js        # Tests for game logic
│   └── shuffle.test.js     # Tests for shuffle algorithm
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions workflow
├── .eslintrc.json          # ESLint configuration
├── babel.config.cjs        # Babel configuration
├── jest.config.cjs         # Jest configuration
├── package.json            # NPM package configuration
├── tsconfig.json           # TypeScript configuration
├── README.md               # This file
└── project-scope.md        # Original project specification
```

## Technical Details

### Game Mechanics
- **Shuffle Algorithm**: Fisher-Yates for unbiased randomization
- **State Management**: Centralized game state with clear data flow
- **Animation**: CSS transitions with JavaScript orchestration
- **Performance**: Efficient DOM updates and batched operations

### Accessibility Features
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard support with logical focus flow
- **Live Regions**: Real-time announcements for game state changes
- **Motion Reduction**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Support for high contrast mode
- **Touch Targets**: Minimum 44×44px touch targets for mobile

### Browser Support
- Modern browsers with ES6+ module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

## Getting Started

### Play Online
Visit the live demo: https://bosk8.github.io/memory-card-game/

### Run Locally
1. **Clone the repository**: `git clone https://github.com/bosk8/memory-card-game.git`
2. **Install dependencies**: `npm install`
3. **Open** `index.html` in a modern web browser

### Development
- **Run tests**: `npm test`
- **Run linter**: `npm run lint`
- **Run type checker**: `npm run typecheck`

## Performance Goals

- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95  
- **Lighthouse Best Practices**: ≥90

## License

This project is open source and available under the MIT License.
