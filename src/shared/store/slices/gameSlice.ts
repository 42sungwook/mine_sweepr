import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type GameState, type Cell } from '@/shared/types'
import { DIFFICULTY_SETTINGS, type DifficultyLevel } from '@/shared/constants'
import {
  generateMines,
  getNeighbors,
  saveGameSettings,
  loadGameSettings
} from '@/shared/utils'

const createInitialBoardWithSize = (
  width: number,
  height: number
): Cell[][] => {
  const board: Cell[][] = []
  for (let row = 0; row < height; row++) {
    board[row] = []
    for (let col = 0; col < width; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isWrongFlag: false,
        isExploded: false
      }
    }
  }
  return board
}

const placeMines = (
  board: Cell[][],
  excludeRow: number,
  excludeCol: number,
  mineCount: number
): Cell[][] => {
  const newBoard = board.map((row) =>
    row.map((cell) => ({ ...cell, isWrongFlag: false, isExploded: false }))
  )
  const boardWidth = board[0]?.length || 0
  const boardHeight = board.length
  const excludeIndex = excludeRow * boardWidth + excludeCol
  const mines = generateMines(boardWidth * boardHeight, mineCount, excludeIndex)

  mines.forEach((index) => {
    const row = Math.floor(index / boardWidth)
    const col = index % boardWidth
    newBoard[row][col].isMine = true
  })

  // 주변 지뢰 개수 계산
  for (let row = 0; row < boardHeight; row++) {
    for (let col = 0; col < boardWidth; col++) {
      if (!newBoard[row][col].isMine) {
        const neighbors = getNeighbors(row, col, boardWidth, boardHeight)
        const neighborMineCount = neighbors.filter(
          ([r, c]) => newBoard[r][c].isMine
        ).length
        newBoard[row][col].neighborMines = neighborMineCount
      }
    }
  }

  return newBoard
}

const revealEmptyCells = (
  board: Cell[][],
  startRow: number,
  startCol: number
): Cell[][] => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  const visited = new Set<string>()
  const queue: [number, number][] = [[startRow, startCol]]
  const boardWidth = board[0]?.length || 0
  const boardHeight = board.length

  while (queue.length > 0) {
    const [row, col] = queue.shift()!
    const cellId = `${row}-${col}`

    if (visited.has(cellId)) {
      continue
    }

    visited.add(cellId)

    // 플래그된 셀은 열지 않기
    if (!newBoard[row][col].isFlagged) {
      newBoard[row][col].isRevealed = true
    }

    if (newBoard[row][col].neighborMines === 0) {
      const neighbors = getNeighbors(row, col, boardWidth, boardHeight)

      neighbors.forEach(([r, c]) => {
        if (!newBoard[r][c].isRevealed) {
          queue.push([r, c])
        }
      })
    }
  }

  return newBoard
}

// localStorage에서 설정 불러오기
const savedSettings = loadGameSettings()
const defaultSettings = DIFFICULTY_SETTINGS.INTERMEDIATE

const initialSettings = savedSettings || {
  width: defaultSettings.width,
  height: defaultSettings.height,
  mines: defaultSettings.mines
}

const initialState: GameState = {
  board: createInitialBoardWithSize(
    initialSettings.width,
    initialSettings.height
  ),
  gameStatus: 'waiting',
  mineCount: initialSettings.mines,
  flagCount: 0,
  timer: 0,
  isFirstClick: true,
  boardWidth: initialSettings.width,
  boardHeight: initialSettings.height
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state) => {
      state.board = createInitialBoardWithSize(
        state.boardWidth,
        state.boardHeight
      )
      state.gameStatus = 'waiting'
      state.flagCount = 0
      state.timer = 0
      state.isFirstClick = true
    },

    revealCell: (
      state,
      action: PayloadAction<{ row: number; col: number }>
    ) => {
      const { row, col } = action.payload
      const cell = state.board[row][col]

      if (
        cell.isRevealed ||
        cell.isFlagged ||
        state.gameStatus === 'won' ||
        state.gameStatus === 'lost'
      ) {
        return
      }

      if (state.isFirstClick) {
        state.board = placeMines(state.board, row, col, state.mineCount)
        state.isFirstClick = false
        state.gameStatus = 'playing'
      }

      if (cell.isMine) {
        state.gameStatus = 'lost'

        // 클릭된 지뢰를 폭발한 지뢰로 표시
        cell.isExploded = true

        // 모든 지뢰 표시 및 잘못된 플래그 표시
        state.board.forEach((row) => {
          row.forEach((cell) => {
            if (cell.isMine) {
              cell.isRevealed = true
            } else if (cell.isFlagged) {
              cell.isWrongFlag = true
            }
          })
        })
      } else {
        state.board = revealEmptyCells(state.board, row, col)

        // 승리 조건 확인
        const totalCells = state.boardWidth * state.boardHeight
        const revealedCells = state.board
          .flat()
          .filter((cell) => cell.isRevealed).length

        if (revealedCells === totalCells - state.mineCount) {
          state.gameStatus = 'won'
        }
      }
    },

    toggleFlag: (
      state,
      action: PayloadAction<{ row: number; col: number }>
    ) => {
      const { row, col } = action.payload
      const cell = state.board[row][col]

      if (
        cell.isRevealed ||
        state.gameStatus === 'won' ||
        state.gameStatus === 'lost'
      ) {
        return
      }

      if (cell.isFlagged) {
        cell.isFlagged = false
        state.flagCount -= 1
      } else {
        cell.isFlagged = true
        state.flagCount += 1
      }
    },

    tickTimer: (state) => {
      if (state.gameStatus === 'playing' && state.timer < 999) {
        state.timer += 1
      }
    },

		/**
		 * Area Open (ref: https://freeminesweeper.org/how-to-play-minesweeper.php)
		 * If an open square has the correct number of marked neighboring mines,
		 * click on the open square to open all remaining unopened neighbor squares all at once.
		 * If an incorrect number of neighbors are marked, or all neighbors are marked or open,
		 * clicking the square has no effect. If an incorrect neighbor is marked, this will cause instant loss.
		 * Yes we find this one confusing too.
		 */
    areaOpen: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload
      const cell = state.board[row][col]

      if (
        !cell.isRevealed ||
        cell.isMine ||
        cell.neighborMines === 0 ||
        state.gameStatus === 'won' ||
        state.gameStatus === 'lost'
      ) {
        return
      }

      const neighbors = getNeighbors(
        row,
        col,
        state.boardWidth,
        state.boardHeight
      )
      const flaggedNeighbors = neighbors.filter(
        ([r, c]) => state.board[r][c].isFlagged
      )
      const unrevealedNeighbors = neighbors.filter(
        ([r, c]) =>
          !state.board[r][c].isRevealed && !state.board[r][c].isFlagged
      )

      if (flaggedNeighbors.length !== cell.neighborMines) {
        return
      }

      if (unrevealedNeighbors.length === 0) {
        return
      }

      let hitMine = false

      for (const [r, c] of unrevealedNeighbors) {
        const neighborCell = state.board[r][c]
        if (neighborCell.isMine) {
          hitMine = true
          neighborCell.isExploded = true
          break
        }
      }

      if (hitMine) {
        state.gameStatus = 'lost'

        state.board.forEach((row) => {
          row.forEach((cell) => {
            if (cell.isMine) {
              cell.isRevealed = true
            } else if (cell.isFlagged) {
              cell.isWrongFlag = true
            }
          })
        })
      } else {
        // 안전한 경우 - 모든 남은 셀들을 열기
        for (const [r, c] of unrevealedNeighbors) {
          state.board = revealEmptyCells(state.board, r, c)
        }

        // 승리 조건 확인
        const totalCells = state.boardWidth * state.boardHeight
        const revealedCells = state.board
          .flat()
          .filter((cell) => cell.isRevealed).length

        if (revealedCells === totalCells - state.mineCount) {
          state.gameStatus = 'won'
        }
      }
    },

    setDifficulty: (state, action: PayloadAction<DifficultyLevel>) => {
      const difficulty = DIFFICULTY_SETTINGS[action.payload]
      state.boardWidth = difficulty.width
      state.boardHeight = difficulty.height
      state.mineCount = difficulty.mines
      state.board = createInitialBoardWithSize(
        difficulty.width,
        difficulty.height
      )
      state.gameStatus = 'waiting'
      state.flagCount = 0
      state.timer = 0
      state.isFirstClick = true

      saveGameSettings({
        width: difficulty.width,
        height: difficulty.height,
        mines: difficulty.mines,
        difficultyLevel: action.payload
      })
    },

    setCustomDifficulty: (
      state,
      action: PayloadAction<{ width: number; height: number; mines: number }>
    ) => {
      const { width, height, mines } = action.payload
      state.boardWidth = width
      state.boardHeight = height
      state.mineCount = mines
      state.board = createInitialBoardWithSize(width, height)
      state.gameStatus = 'waiting'
      state.flagCount = 0
      state.timer = 0
      state.isFirstClick = true

      saveGameSettings({
        width,
        height,
        mines,
        difficultyLevel: 'CUSTOM'
      })
    }
  }
})

// actions
export const {
  initGame,
  revealCell,
  toggleFlag,
  tickTimer,
  areaOpen,
  setDifficulty,
  setCustomDifficulty
} = gameSlice.actions

// reducer
export default gameSlice.reducer
