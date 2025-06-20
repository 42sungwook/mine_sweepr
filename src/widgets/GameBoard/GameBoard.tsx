import React from 'react'
import { useAppSelector } from '@/shared/store'

import { Cell } from '@/features'

import styles from './GameBoard.module.scss'

//
//
//

const GameBoard: React.FC = () => {
  const board = useAppSelector((state) => state.game.board)

  return (
    <div className={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.boardRow}
        >
          {row.map((cell) => (
            <Cell
              key={cell.id}
              cell={cell}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default GameBoard
