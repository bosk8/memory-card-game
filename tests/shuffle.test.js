import { shuffleArray as shuffle } from '../src/utils/shuffle';

describe('Fisher-Yates Shuffle', () => {
  test('should not have the same order after shuffling', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const originalArray = [...array];
    const shuffledArray = shuffle(array);
    expect(shuffledArray).not.toEqual(originalArray);
  });

  test('should contain the same elements after shuffling', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const originalArray = [...array];
    const shuffledArray = shuffle(array);
    expect(shuffledArray.sort()).toEqual(originalArray.sort());
  });

  test('should have the same length after shuffling', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffledArray = shuffle(array);
    expect(shuffledArray.length).toBe(array.length);
  });
});
