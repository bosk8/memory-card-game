import { Game } from '../src/modules/game';

describe('Game Logic', () => {
  let game;

  beforeEach(() => {
    game = new Game();
    game.init('easy');
  });

  test('should initialize with the correct default state', () => {
    const state = game.getState();
    expect(state.difficulty).toBe('easy');
    expect(state.deck.length).toBe(12);
    expect(state.score).toBe(0);
    expect(state.moves).toBe(0);
  });

  test('should increase score by 10 on a correct match', () => {
    game.state.deck = [
      { id: 0, icon: 'A', matched: false },
      { id: 1, icon: 'A', matched: false },
      { id: 2, icon: 'B', matched: false },
      { id: 3, icon: 'B', matched: false },
    ];
    game.state.flipped = [0, 1];
    game.checkMatch();
    expect(game.getState().score).toBe(10);
  });

  test('should decrease score by 2 on an incorrect match', () => {
    game.state.score = 10;
    game.state.deck = [
      { id: 0, icon: 'A', matched: false },
      { id: 1, icon: 'B', matched: false },
      { id: 2, icon: 'C', matched: false },
      { id: 3, icon: 'D', matched: false },
    ];
    game.state.flipped = [0, 1];
    game.checkMatch();
    expect(game.getState().score).toBe(8);
  });

  test('should not have a negative score', () => {
    game.state.deck = [
      { id: 0, icon: 'A', matched: false },
      { id: 1, icon: 'B', matched: false },
      { id: 2, icon: 'C', matched: false },
      { id: 3, icon: 'D', matched: false },
    ];
    game.state.flipped = [0, 1];
    game.checkMatch();
    expect(game.getState().score).toBe(0);
  });

  test('should apply a streak bonus of 5 points on the 3rd consecutive match', () => {
    game.state.deck = [
      { id: 0, icon: 'A', matched: false },
      { id: 1, icon: 'A', matched: false },
      { id: 2, icon: 'B', matched: false },
      { id: 3, icon: 'B', matched: false },
      { id: 4, icon: 'C', matched: false },
      { id: 5, icon: 'C', matched: false },
    ];
    game.state.flipped = [0, 1];
    game.checkMatch();
    expect(game.getState().score).toBe(10);
    game.state.flipped = [2, 3];
    game.checkMatch();
    expect(game.getState().score).toBe(20);
    game.state.flipped = [4, 5];
    game.checkMatch();
    expect(game.getState().score).toBe(35);
  });
});
