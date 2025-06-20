export const DIFFICULTY_SETTINGS = Object.freeze({
  BEGINNER: {
    width: 8,
    height: 8,
    mines: 10,
    name: 'Beginner'
  },
  INTERMEDIATE: {
    width: 16,
    height: 16,
    mines: 40,
    name: 'Intermediate'
  },
  EXPERT: {
    width: 32,
    height: 16,
    mines: 100,
    name: 'Expert'
  }
})

export type DifficultyLevel = keyof typeof DIFFICULTY_SETTINGS

export const GAME_SETTINGS_KEY = 'minesweeper-game-settings'
