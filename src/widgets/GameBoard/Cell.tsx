import React, { memo } from 'react'

import { type Cell as CellType } from '@/shared/types'
import { useAppDispatch } from '@/shared/store'
import { revealCell } from '@/shared/store/slices'

import Bomb from '@/assets/bomb.svg?react'

import styles from './Cell.module.scss'

//
//
//

interface CellProps {
  cell: CellType
}

//
//
//

const Cell: React.FC<CellProps> = memo(({ cell }) => {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(revealCell({ row: cell.row, col: cell.col }))
  }

  const getCellContent = () => {
    if (!cell.isRevealed) return ''
    if (cell.isMine) return <Bomb />
    if (cell.neighborMines > 0) return cell.neighborMines.toString()
    return ''
  }

  const getCellClasses = () => {
    const classes = [styles.cell]

    if (cell.isRevealed) {
      classes.push(styles.revealed)
      if (cell.isMine) {
        classes.push(styles.mine)
      }
    }

    return classes.join(' ')
  }

  return (
    <button
      className={getCellClasses()}
      onClick={handleClick}
      disabled={cell.isRevealed}
      data-count={
        cell.isRevealed && !cell.isMine && cell.neighborMines > 0
          ? cell.neighborMines
          : undefined
      }
    >
      {getCellContent()}
    </button>
  )
})

export default Cell
