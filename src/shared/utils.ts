export const generateMines = (
  totalCells: number,
  mineCount: number,
  excludeIndex?: number
): Set<number> => {
  const mines = new Set<number>()

  while (mines.size < mineCount) {
    const randomIndex = Math.floor(Math.random() * totalCells)

    if (randomIndex !== excludeIndex) {
      mines.add(randomIndex)
    }
  }

  return mines
}

export const getNeighbors = (
  row: number,
  col: number,
  size: number
): [number, number][] => {
  const neighbors: [number, number][] = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue
      }

      const newRow = row + i
      const newCol = col + j

      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        neighbors.push([newRow, newCol])
      }
    }
  }
  return neighbors
}
