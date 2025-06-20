import React, { useState, useRef, useEffect } from 'react'

import { useAppDispatch } from '@/shared/store'
import { initGame, setDifficulty } from '@/shared/store/slices'
import type { DifficultyLevel } from '@/shared/constants'

import styles from './GameMenu.module.scss'
import SettingModal from './SettingModal'

//
//
//

const GameMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsGameMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault()
        dispatch(initGame())
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  const handleGameMenuClick = () => {
    setIsGameMenuOpen(!isGameMenuOpen)
  }

  const handleMenuItemClick = (action: string) => {
    setIsGameMenuOpen(false)

    switch (action) {
      case 'new':
        dispatch(initGame())
        break
      case 'beginner':
        dispatch(setDifficulty('BEGINNER' as DifficultyLevel))
        break
      case 'intermediate':
        dispatch(setDifficulty('INTERMEDIATE' as DifficultyLevel))
        break
      case 'expert':
        dispatch(setDifficulty('EXPERT' as DifficultyLevel))
        break
      case 'custom':
        setIsSettingModalOpen(true)
        break
      case 'exit':
        console.log('Exit game')
        break
    }
  }

  return (
    <div className={styles.gameMenuContainer}>
      <div
        className={styles.gameSetting}
        ref={menuRef}
      >
        <div
          className={`${styles.gameSettingItem} ${
            isGameMenuOpen ? styles.active : ''
          }`}
          onClick={handleGameMenuClick}
        >
          Game
        </div>
        {isGameMenuOpen && (
          <div className={styles.gameMenu}>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('new')}
            >
              <span>New</span>
              <span className={styles.shortcut}>F2</span>
            </div>
            <div className={styles.menuDivider}></div>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('beginner')}
            >
              <span>Beginner</span>
            </div>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('intermediate')}
            >
              <span>Intermediate</span>
            </div>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('expert')}
            >
              <span>Expert</span>
            </div>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('custom')}
            >
              <span>Custom...</span>
            </div>
            <div className={styles.menuDivider}></div>
            <div
              className={styles.menuItem}
              onClick={() => handleMenuItemClick('exit')}
            >
              <span>Exit</span>
            </div>
          </div>
        )}
      </div>
      <SettingModal
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
      />
    </div>
  )
}

export default GameMenu
