import React, { useState, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import { setCustomDifficulty } from '@/shared/store/slices/gameSlice'

import styles from './SettingModal.module.scss'

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const { boardWidth, boardHeight, mineCount } = useAppSelector(
    (state) => state.game
  )

  const [width, setWidth] = useState(boardWidth)
  const [height, setHeight] = useState(boardHeight)
  const [mines, setMines] = useState(mineCount)

  useEffect(() => {
    setWidth(boardWidth)
    setHeight(boardHeight)
    setMines(mineCount)
  }, [boardWidth, boardHeight, mineCount])

  const maxMines = Math.floor((width * height) / 3)

  const handleWidthChange = (value: number) => {
    const newWidth = Math.min(100, Math.max(8, value))
    setWidth(newWidth)
    const newMaxMines = Math.floor((newWidth * height) / 3)
    if (mines > newMaxMines) {
      setMines(newMaxMines)
    }
  }

  const handleHeightChange = (value: number) => {
    const newHeight = Math.min(100, Math.max(8, value))
    setHeight(newHeight)
    const newMaxMines = Math.floor((width * newHeight) / 3)
    if (mines > newMaxMines) {
      setMines(newMaxMines)
    }
  }

  const handleMinesChange = (value: number) => {
    const newMines = Math.min(maxMines, Math.max(1, value))
    setMines(newMines)
  }

  const handleConfirm = () => {
    dispatch(setCustomDifficulty({ width, height, mines }))
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.modalWrapper}>
      <div
        className={styles.overlay}
        onClick={handleCancel}
      >
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <span className={styles.title}>Custom Game Setup</span>
            <button
              className={styles.closeButton}
              onClick={handleCancel}
            >
              ×
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Game Width (max 100):</label>
              <input
                type="number"
                className={styles.input}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                min={8}
                max={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Game Height (max 100):</label>
              <input
                type="number"
                className={styles.input}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                min={8}
                max={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Number of Bombs:</label>
              <input
                type="number"
                className={styles.input}
                value={mines}
                onChange={(e) => handleMinesChange(Number(e.target.value))}
                min={1}
                max={maxMines}
              />
            </div>

            <div className={styles.info}>
              <p>Maximum mines: {maxMines} (1/3 of total cells)</p>
              <p>Total cells: {width * height}</p>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              className={styles.button}
              onClick={handleConfirm}
            >
              OK
            </button>
            <button
              className={styles.button}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingModal
