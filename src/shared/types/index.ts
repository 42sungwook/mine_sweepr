export interface Cell {
  id: string
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  neighborMines: number
  isFlagged: boolean
  isWrongFlag: boolean // 결과에서 플래그가 있는데 지뢰가 아닌 경우
  isExploded: boolean // 마지막에 클릭된 지뢰 (빨간 배경)
}

export interface GameState {
  board: Cell[][]
  gameStatus: 'waiting' | 'playing' | 'won' | 'lost'
  mineCount: number
  flagCount: number
  timer: number
  isFirstClick: boolean
  boardWidth: number
  boardHeight: number
}

export type GameAction =
  | { type: 'INIT_GAME' }
  | { type: 'REVEAL_CELL'; payload: { row: number; col: number } }
  | { type: 'TICK_TIMER' }
  | { type: 'GAME_OVER'; payload: { status: 'won' | 'lost' } }
