import React from 'react'

import { GameBoard } from '@/widgets'
import GameHeader from '@/widgets/GameHeader'

import styles from './GamePage.module.scss'

//
//
//

const GamePage: React.FC = () => {
  return (
    <div className={styles.gamePage}>
      <h1 className={styles.title}>지뢰 찾기 게임</h1>
      <div className={styles.gameContainer}>
        <GameHeader />
        <GameBoard />
      </div>
    </div>
  )
}

export default GamePage
