export interface Cell {
  id: string
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  neighborMines: number
  isFlagged: boolean
  isWrongFlag: boolean // not mine when revealed
}

export interface GameState {
  board: Cell[][]
  gameStatus: 'waiting' | 'playing' | 'won' | 'lost'
  mineCount: number
  flagCount: number
  timer: number
  isFirstClick: boolean
}

export type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'REVEAL_CELL'; payload: { row: number; col: number } }
  | { type: 'TICK_TIMER' }
  | { type: 'GAME_OVER'; payload: { status: 'won' | 'lost' } }
