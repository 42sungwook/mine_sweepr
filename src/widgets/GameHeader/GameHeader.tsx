import React, { useEffect, useState } from 'react'

import { useAppSelector, useAppDispatch } from '@/shared/store'
import { initGame, tickTimer } from '@/shared/store/slices'

import styles from './GameHeader.module.scss'

//
//
//

const GameHeader: React.FC = () => {
  const dispatch = useAppDispatch()
  const { mineCount, flagCount, timer, gameStatus } = useAppSelector(
    (state) => state.game
  )
  const [isMouseDown, setIsMouseDown] = useState(false)

  // 타이머 실행
  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        dispatch(tickTimer())
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [gameStatus, dispatch])

  // 게임 승리 시 알림
  useEffect(() => {
    if (gameStatus === 'won') {
      const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return minutes > 0
          ? `${minutes}분 ${remainingSeconds}초`
          : `${remainingSeconds}초`
      }

      setTimeout(() => {
        alert(
          `🎉 축하합니다! 게임에서 승리했습니다! 🎉\n플레이 시간: ${formatTime(
            timer
          )}`
        )
      }, 100)
    }
  }, [gameStatus, timer])

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true)
    const handleMouseUp = () => setIsMouseDown(false)

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [])

  const handleRestart = () => {
    dispatch(initGame())
  }

  const getRestartButtonEmoji = () => {
    switch (gameStatus) {
      case 'won':
        return '😎'
      case 'lost':
        return '😵'
      case 'waiting':
      case 'playing':
        return isMouseDown ? '😮' : '🙂'
      default:
        return '🙂'
    }
  }

  const formatNumber = (num: number): string => {
    // 100의 자리까지만 보이기
    const displayNum = num % 1000

    return displayNum.toString().padStart(3, '0')
  }

  const remainingMines = mineCount - flagCount

  return (
    <div className={styles.gameHeader}>
      <div className={styles.mineCounter}>{formatNumber(remainingMines)}</div>

      <button
        className={styles.restartButton}
        onClick={handleRestart}
      >
        {getRestartButtonEmoji()}
      </button>

      <div className={styles.timer}>{formatNumber(timer)}</div>
    </div>
  )
}

export default GameHeader
