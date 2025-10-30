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
├── index.html              # Main HTML file (entry point)
├── src/                    # Source code
│   ├── main.js             # Application entry point
│   ├── styles.css           # CSS with responsive design and animations
│   ├── modules/             # Game modules
│   │   ├── game.js          # Core game logic and state management
│   │   ├── dom.js           # DOM rendering and manipulation
│   │   ├── a11y.js          # Accessibility features and keyboard navigation
│   │   └── storage.js       # LocalStorage management for scores
│   └── utils/               # Utility functions
│       └── shuffle.js       # Fisher-Yates shuffle algorithm
├── tests/                   # Test files
│   ├── game.test.js         # Game logic tests
│   ├── storage.test.js      # Storage tests
│   └── shuffle.test.js      # Shuffle utility tests
├── config/                  # Configuration files
│   ├── eslint.config.js     # ESLint configuration
│   └── vitest.config.js      # Vitest test configuration
├── docs/                    # Documentation
│   ├── DESIGN_SYSTEM.md     # Complete UI/UX design system specification
│   ├── IMPLEMENTATION_COMPLETE.md  # Implementation completion report
│   ├── IMPLEMENTATION_GUIDE.md     # Quick reference guide
│   ├── SANITY_CHECK_COMPLETE.md    # Final sanity check report
│   ├── UI_UX_SUMMARY.md     # UI/UX overview
│   └── project-scope.md     # Original project specification
├── assets/                  # Static assets
│   └── icons/
│       └── icons.txt        # Card icon definitions
├── README.md                # This file
├── package.json             # NPM configuration and scripts
├── .prettierrc              # Prettier configuration
└── .gitignore               # Git ignore rules
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

### Prerequisites

- Node.js 18+ (for development only)
- A modern web browser with ES6+ module support (Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+)

### Option 1: Play Online

Visit the live demo: https://bosk8.github.io/memory-card-game/

### Option 2: Run Locally (No Build Required)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bosk8/memory-card-game.git
   cd memory-card-game
   ```

2. **Open** `index.html` in a modern web browser
3. **Start playing** immediately - no build step required!

### Option 3: Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the game**: Open `index.html` in your browser

3. **Development commands**:
   ```bash
   npm run lint          # Check code quality
   npm run lint:fix      # Fix linting issues automatically
   npm run format        # Format code with Prettier
   npm run format:check  # Check formatting without changes
   npm run test          # Run test suite
   npm run test:watch    # Run tests in watch mode
   npm run test:coverage # Generate test coverage report
   npm run validate      # Run all checks (lint, format, test)
   ```

## Testing

The project uses [Vitest](https://vitest.dev/) for testing. Test files are located in the `tests/` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Game Logic**: Core game mechanics, card flipping, matching, scoring
- **Storage**: LocalStorage operations, score persistence, validation
- **Shuffle**: Fisher-Yates algorithm correctness and distribution

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow code style**: Run `npm run format` before committing
3. **Run tests**: Ensure `npm test` passes
4. **Check code quality**: Run `npm run validate` before pushing
5. **Write meaningful commits**: Use clear, descriptive commit messages
6. **Update documentation**: If adding features, update README.md
7. **Test accessibility**: Ensure keyboard navigation and screen reader support
8. **Submit a pull request** with a clear description of changes

### Code Style

- Use ESLint for code quality checks
- Use Prettier for code formatting (configured in `.prettierrc`)
- Follow ES6+ module conventions
- Maintain accessibility standards (WCAG 2.1 AA)

### File Structure

When adding new features:

- **Game logic** → `src/modules/game.js`
- **DOM manipulation** → `src/modules/dom.js`
- **Accessibility** → `src/modules/a11y.js`
- **Storage** → `src/modules/storage.js`
- **Utilities** → `src/utils/`
- **Tests** → `tests/` directory
- **Documentation** → `docs/` directory
- **Configuration** → `config/` directory

## Performance Goals

- **Lighthouse Performance**: ≥90
- **Lighthouse Accessibility**: ≥95
- **Lighthouse Best Practices**: ≥90

## CI/CD

This project uses GitHub Actions for continuous integration. The CI pipeline runs on every push and pull request:

- **Linting**: ESLint checks
- **Formatting**: Prettier validation
- **Testing**: Vitest test suite

See `.github/workflows/ci.yml` for configuration details.

## License

This project is open source and available under the MIT License.
