// Storage Manager Module
export class StorageManager {
    constructor() {
        this.storageKey = 'memoryGameScores';
        this.schemaVersion = '1.0';
        this.defaultScores = {
            easy: { time: null, score: 0, date: null },
            medium: { time: null, score: 0, date: null },
            hard: { time: null, score: 0, date: null }
        };
    }

    // Load best scores from localStorage
    loadBestScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                this.saveScores(this.defaultScores);
                return this.defaultScores;
            }

            const scores = JSON.parse(stored);

            // Check schema version and migrate if needed
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

    // Save scores to localStorage
    saveScores(scores) {
        try {
            scores.version = this.schemaVersion;
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
        } catch (error) {
            console.error('Failed to save scores to localStorage:', error);
        }
    }

    // Save a new score if it's better than the current best
    saveScore(difficulty, time, score) {
        const scores = this.loadBestScores();
        const currentBest = scores[difficulty];

        // Check if this is a better time (lower is better)
        const isBetterTime = !currentBest.time || time < currentBest.time;

        // Check if this is a better score (higher is better)
        const isBetterScore = score > currentBest.score;

        if (isBetterTime || isBetterScore) {
            scores[difficulty] = {
                time: isBetterTime ? time : currentBest.time,
                score: isBetterScore ? score : currentBest.score,
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            };

            this.saveScores(scores);
            return true; // Score was saved
        }

        return false; // Score was not better
    }

    // Get best time for a difficulty
    getBestTime(difficulty) {
        const scores = this.loadBestScores();
        return scores[difficulty]?.time || null;
    }

    // Get best score for a difficulty
    getBestScore(difficulty) {
        const scores = this.loadBestScores();
        return scores[difficulty]?.score || 0;
    }

    // Get all scores
    getAllScores() {
        return this.loadBestScores();
    }

    // Clear all scores (for testing or reset)
    clearScores() {
        try {
            localStorage.removeItem(this.storageKey);
            this.saveScores(this.defaultScores);
        } catch (error) {
            console.error('Failed to clear scores:', error);
        }
    }

    // Export scores (for backup or sharing)
    exportScores() {
        const scores = this.loadBestScores();
        const exportData = {
            version: this.schemaVersion,
            exportDate: new Date().toISOString(),
            scores: scores
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Import scores (for restore from backup)
    importScores(jsonData) {
        try {
            const importData = JSON.parse(jsonData);

            // Validate structure
            if (!importData.scores || typeof importData.scores !== 'object') {
                throw new Error('Invalid scores data structure');
            }

            // Validate difficulty levels
            const requiredDifficulties = ['easy', 'medium', 'hard'];
            for (const difficulty of requiredDifficulties) {
                if (!importData.scores[difficulty]) {
                    throw new Error(`Missing difficulty: ${difficulty}`);
                }
            }

            // Save imported scores
            this.saveScores(importData.scores);
            return true;
        } catch (error) {
            console.error('Failed to import scores:', error);
            return false;
        }
    }

    // Check if localStorage is available
    isStorageAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const scores = this.loadBestScores();
            const dataSize = JSON.stringify(scores).length;

            return {
                available: this.isStorageAvailable(),
                dataSize: dataSize,
                quota: this.getStorageQuota(),
                usage: ((dataSize / this.getStorageQuota()) * 100).toFixed(2) + '%'
            };
        } catch (error) {
            return {
                available: false,
                error: error.message
            };
        }
    }

    // Estimate storage quota (approximate)
    getStorageQuota() {
        // Most browsers have 5-10MB localStorage limit
        // This is a rough estimate
        return 5 * 1024 * 1024; // 5MB in bytes
    }

    // Migration helpers for future schema changes
    migrateScores(fromVersion, toVersion) {
        const scores = this.loadBestScores();

        // Example migration logic (can be expanded for future versions)
        if (fromVersion === '1.0' && toVersion === '1.1') {
            // Add new fields, transform existing data, etc.
            console.warn('Migrating scores from version 1.0 to 1.1');
        }

        scores.version = toVersion;
        this.saveScores(scores);
    }

    // Validate score data integrity
    validateScores(scores) {
        const requiredDifficulties = ['easy', 'medium', 'hard'];

        for (const difficulty of requiredDifficulties) {
            const score = scores[difficulty];

            if (!score || typeof score !== 'object') {
                return false;
            }

            // Validate time (should be number or null)
            if (score.time !== null && (typeof score.time !== 'number' || score.time < 0)) {
                return false;
            }

            // Validate score (should be number >= 0)
            if (typeof score.score !== 'number' || score.score < 0) {
                return false;
            }

            // Validate date (should be string or null)
            if (score.date !== null && typeof score.date !== 'string') {
                return false;
            }
        }

        return true;
    }
}
