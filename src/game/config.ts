export interface DifficultyOption {
    wpm: number;
    label: string;
    scoreBonus: number;
    maxWordLen: number;
    lifeUpScore: number;
}

export const DIFFICULTY: Record<string, DifficultyOption> = {
    easy: {
        wpm: 10,
        label: "Easy",
        scoreBonus: 1,
        maxWordLen: 4,
        lifeUpScore: 250,
    },
    normal: {
        wpm: 15,
        label: "Normal",
        scoreBonus: 1,
        maxWordLen: 6,
        lifeUpScore: 500,
    },
    hard: {
        wpm: 30,
        label: "Hard",
        scoreBonus: 2,
        maxWordLen: 8,
        lifeUpScore: 1000,
    },
    mania: {
        wpm: 40,
        label: "Mania",
        scoreBonus: 3,
        maxWordLen: 999,
        lifeUpScore: 2000,
    },
} as const;