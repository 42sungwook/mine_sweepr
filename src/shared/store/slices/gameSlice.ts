import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type GameState, type Cell } from '@/shared/types'
import { BOARD_SIZE, MINE_COUNT } from '@/shared/constants'
import { generateMines, getNeighbors } from '@/shared/utils'

const createInitialBoard = (): Cell[][] => {
  const board: Cell[][] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = []
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = {
        id: `${row}-${col}`,
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isWrongFlag: false
      }
    }
  }
  return board
}

const placeMines = (
  board: Cell[][],
  excludeRow: number,
  excludeCol: number
): Cell[][] => {
  const newBoard = board.map((row) =>
    row.map((cell) => ({ ...cell, isWrongFlag: false }))
  )
  const excludeIndex = excludeRow * BOARD_SIZE + excludeCol
  const mines = generateMines(BOARD_SIZE * BOARD_SIZE, MINE_COUNT, excludeIndex)

  mines.forEach((index) => {
    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE
    newBoard[row][col].isMine = true
  })

  // 주변 지뢰 개수 계산
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!newBoard[row][col].isMine) {
        const neighbors = getNeighbors(row, col, BOARD_SIZE)
        const mineCount = neighbors.filter(
          ([r, c]) => newBoard[r][c].isMine
        ).length
        newBoard[row][col].neighborMines = mineCount
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
      const neighbors = getNeighbors(row, col, BOARD_SIZE)

      neighbors.forEach(([r, c]) => {
        if (!newBoard[r][c].isRevealed) {
          queue.push([r, c])
        }
      })
    }
  }

  return newBoard
}

const initialState: GameState = {
  board: createInitialBoard(),
  gameStatus: 'waiting',
  mineCount: MINE_COUNT,
  flagCount: 0,
  timer: 0,
  isFirstClick: true
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initGame: (state) => {
      state.board = createInitialBoard()
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
        state.board = placeMines(state.board, row, col)
        state.isFirstClick = false
        state.gameStatus = 'playing'
      }

      if (cell.isMine) {
        state.gameStatus = 'lost'

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
        const totalCells = BOARD_SIZE * BOARD_SIZE
        const revealedCells = state.board
          .flat()
          .filter((cell) => cell.isRevealed).length

        if (revealedCells === totalCells - MINE_COUNT) {
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
    }
  }
})

// actions
export const { initGame, revealCell, toggleFlag } = gameSlice.actions

// reducer
export default gameSlice.reducer
