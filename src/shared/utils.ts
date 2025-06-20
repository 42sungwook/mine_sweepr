import { GAME_SETTINGS_KEY } from './constants'

export const generateMines = (
  totalCells: number,
  mineCount: number,
  excludeIndex?: number
): Set<number> => {
  const mines = new Set<number>()

  while (mines.size < mineCount) {
    const randomIndex = Math.floor(Math.random() * totalCells)

    if (randomIndex !== excludeIndex) {
      mines.add(randomIndex)
    }
  }

  return mines
}

export const getNeighbors = (
  row: number,
  col: number,
  width: number,
  height: number
): [number, number][] => {
  const neighbors: [number, number][] = []

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue
      }

      const newRow = row + i
      const newCol = col + j

      if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
        neighbors.push([newRow, newCol])
      }
    }
  }
  return neighbors
}

export interface GameSettings {
  width: number
  height: number
  mines: number
  difficultyLevel?: string
}

export const saveGameSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save game settings to localStorage:', error)
  }
}

export const loadGameSettings = (): GameSettings | null => {
  try {
    const saved = localStorage.getItem(GAME_SETTINGS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load game settings from localStorage:', error)
  }
  return null
}
