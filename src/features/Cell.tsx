import React, { memo, useCallback } from 'react'

import { type Cell as CellType } from '@/shared/types'
import {
  useAppDispatch,
  revealCell,
  toggleFlag,
  areaOpen
} from '@/shared/store'

import styles from './Cell.module.scss'

//
//
//

interface CellProps {
  cell: CellType
}

const MOBILE_DOUBLE_TAP_DELAY = 500 // ms

//
//
//

const Cell: React.FC<CellProps> = memo(({ cell }) => {
  const dispatch = useAppDispatch()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (cell.isFlagged) {
        e.preventDefault()
        return
      }

      // Area Open
      if (cell.isRevealed) {
        if (cell.neighborMines > 0) {
          dispatch(areaOpen({ row: cell.row, col: cell.col }))
        }
        e.preventDefault()
        return
      }

      dispatch(revealCell({ row: cell.row, col: cell.col }))
    },
    [
      cell.row,
      cell.col,
      cell.isFlagged,
      cell.isRevealed,
      cell.neighborMines,
      dispatch
    ]
  )

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // target이 currentTarget의 자식이 아닌 경우에만 중단
      if (!e.currentTarget.contains(e.target as Node)) {
        return
      }

      if (cell.isRevealed) {
        return
      }

      dispatch(toggleFlag({ row: cell.row, col: cell.col }))
    },
    [cell.row, cell.col, cell.isRevealed, dispatch]
  )

  const lastTapTimeRef = React.useRef<number>(0)

  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTapTimeRef.current

    if (timeDiff < MOBILE_DOUBLE_TAP_DELAY && timeDiff > 0) {
      e.preventDefault()

      if (!cell.isRevealed) {
        dispatch(toggleFlag({ row: cell.row, col: cell.col }))
      }

      lastTapTimeRef.current = 0
    } else {
      lastTapTimeRef.current = currentTime
    }
  }

  const getCellContent = () => {
    if (cell.isWrongFlag) return <div className={styles.xBombIcon} />
    if (cell.isRevealed && cell.isMine)
      return <div className={styles.bombIcon} />
    if (cell.isFlagged) return <div className={styles.flagIcon} />
    if (!cell.isRevealed) return ''
    if (cell.isMine) return <div className={styles.bombIcon} />
    if (cell.neighborMines > 0) return cell.neighborMines.toString()
    return ''
  }

  const getCellClasses = () => {
    const classes = [styles.cell]

    if (cell.isRevealed) {
      classes.push(styles.revealed)
      if (cell.isExploded) {
        classes.push(styles.exploded)
      }
    }

    return classes.join(' ')
  }

  return (
    <button
      className={getCellClasses()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onTouchEnd={handleTouchEnd}
      disabled={false}
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
