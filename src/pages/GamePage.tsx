import React from 'react'

import { GameBoard } from '@/widgets'
import GameHeader from '@/widgets/GameHeader/GameHeader'
import GameMenu from '@/widgets/GameMenu/GameMenu'

import styles from './GamePage.module.scss'

//
//
//

const GamePage: React.FC = () => {
  return (
    <div className={styles.gamePage}>
      <div className={styles.gameSettingContainer}>
        <GameMenu />
        <div className={styles.gameContainer}>
          <GameHeader />
          <GameBoard />
        </div>
      </div>
    </div>
  )
}

export default GamePage
