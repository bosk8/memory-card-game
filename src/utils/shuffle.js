// Fisher-Yates Shuffle Algorithm
export function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// Test function for shuffle distribution (for development)
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
