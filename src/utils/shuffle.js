/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

/**
 * Tests the distribution of the shuffle algorithm.
 * @template T
 * @param {T[]} array The array to test.
 * @param {number} iterations The number of iterations to run.
 * @returns {Map<number, Map<T, number>>[]} An array of maps containing the distribution of each element at each position.
 */
export function testShuffleDistribution(array, iterations = 1000) {
    const positionCounts = array.map(() => new Map());
    
    for (let i = 0; i < iterations; i++) {
        const shuffled = shuffleArray(array);
        shuffled.forEach((item, index) => {
            if (!positionCounts[index].has(item)) {
                positionCounts[index].set(item, 0);
            }
            positionCounts[index].set(item, positionCounts[index].get(item) + 1);
        });
    }
    
    return positionCounts;
}
