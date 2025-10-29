// Storage Manager Module
/**
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 */

/**
 * @typedef {object} Score
 * @property {number | null} time
 * @property {number} score
 * @property {string | null} date
 */

/**
 * @typedef {object} Scores
 * @property {Score} easy
 * @property {Score} medium
 * @property {Score} hard
 * @property {string} [version]
 */

export class StorageManager {
    constructor() {
        this.storageKey = 'memoryGameScores';
        this.schemaVersion = '1.0';
        /** @type {Scores} */
        this.defaultScores = {
            easy: { time: null, score: 0, date: null },
            medium: { time: null, score: 0, date: null },
            hard: { time: null, score: 0, date: null }
        };
    }

    /**
     * @returns {Scores}
     */
    loadBestScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                this.saveScores(this.defaultScores);
                return this.defaultScores;
            }

            const scores = /** @type {Scores} */ (JSON.parse(stored));
            
            if (!scores.version || scores.version !== this.schemaVersion) {
                scores.version = this.schemaVersion;
                this.saveScores(scores);
            }

            return scores;
        } catch (error) {
            console.warn('Failed to load scores from localStorage:', error);
            this.saveScores(this.defaultScores);
            return this.defaultScores;
        }
    }

    /**
     * @param {Scores} scores
     */
    saveScores(scores) {
        try {
            scores.version = this.schemaVersion;
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
        } catch (error) {
            console.error('Failed to save scores to localStorage:', error);
        }
    }

    /**
     * @param {Difficulty} difficulty
     * @param {number} time
     * @param {number} score
     * @returns {boolean}
     */
    saveScore(difficulty, time, score) {
        const scores = this.loadBestScores();
        const currentBest = scores[difficulty];

        const isBetterTime = !currentBest.time || time < currentBest.time;
        const isBetterScore = score > currentBest.score;

        if (isBetterTime || isBetterScore) {
            scores[difficulty] = {
                time: isBetterTime ? time : currentBest.time,
                score: isBetterScore ? score : currentBest.score,
                date: new Date().toISOString().split('T')[0]
            };
            this.saveScores(scores);
            return true;
        }
        return false;
    }

    /**
     * @param {Difficulty} difficulty
     * @returns {number | null}
     */
    getBestTime(difficulty) {
        const scores = this.loadBestScores();
        return scores[difficulty]?.time || null;
    }

    /**
     * @param {Difficulty} difficulty
     * @returns {number}
     */
    getBestScore(difficulty) {
        const scores = this.loadBestScores();
        return scores[difficulty]?.score || 0;
    }

    /**
     * @returns {Scores}
     */
    getAllScores() {
        return this.loadBestScores();
    }

    clearScores() {
        try {
            localStorage.removeItem(this.storageKey);
            this.saveScores(this.defaultScores);
        } catch (error) {
            console.error('Failed to clear scores:', error);
        }
    }

    /**
     * @returns {string}
     */
    exportScores() {
        const scores = this.loadBestScores();
        return JSON.stringify({
            version: this.schemaVersion,
            exportDate: new Date().toISOString(),
            scores
        }, null, 2);
    }

    /**
     * @param {string} jsonData
     * @returns {boolean}
     */
    importScores(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            if (!importData.scores || typeof importData.scores !== 'object') {
                throw new Error('Invalid scores data structure');
            }
            const requiredDifficulties = ['easy', 'medium', 'hard'];
            for (const difficulty of requiredDifficulties) {
                if (!importData.scores[difficulty]) {
                    throw new Error(`Missing difficulty: ${difficulty}`);
                }
            }
            this.saveScores(importData.scores);
            return true;
        } catch (error) {
            console.error('Failed to import scores:', error);
            return false;
        }
    }

    isStorageAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    getStorageInfo() {
        try {
            const scores = this.loadBestScores();
            const dataSize = JSON.stringify(scores).length;
            return {
                available: this.isStorageAvailable(),
                dataSize,
                quota: this.getStorageQuota(),
                usage: (dataSize / this.getStorageQuota() * 100).toFixed(2) + '%'
            };
        } catch (error) {
            return {
                available: false,
                error: (/** @type {Error} */ (error)).message
            };
        }
    }

    getStorageQuota() {
        return 5 * 1024 * 1024; // 5MB
    }

    /**
     * @param {string} fromVersion
     * @param {string} toVersion
     */
    migrateScores(fromVersion, toVersion) {
        const scores = this.loadBestScores();
        if (fromVersion === '1.0' && toVersion === '1.1') {
            console.log('Migrating scores from version 1.0 to 1.1');
        }
        scores.version = toVersion;
        this.saveScores(scores);
    }

    /**
     * @param {Scores} scores
     * @returns {boolean}
     */
    validateScores(scores) {
        /** @type {Difficulty[]} */
        const requiredDifficulties = ['easy', 'medium', 'hard'];
        for (const difficulty of requiredDifficulties) {
            const score = scores[difficulty];
            if (!score || typeof score !== 'object') return false;
            if (score.time !== null && (typeof score.time !== 'number' || score.time < 0)) return false;
            if (typeof score.score !== 'number' || score.score < 0) return false;
            if (score.date !== null && typeof score.date !== 'string') return false;
        }
        return true;
    }
}
