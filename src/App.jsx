import { useState } from "react"
import confetti from "canvas-confetti"
import { TURNS } from "./constants"
import { Square } from "./components/Square"
import { checkWinnerFrom, checkEndGame } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"
import { BoardGame } from "./components/BoardGame"
import { saveGameStorage, resetGameStorage } from "./logic/storage"

const App = ()=> {
  const [board, setBoard] = useState(()=> {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(()=> {
    const turnFormStorage = window.localStorage.getItem('turn')
    return turnFormStorage ?? TURNS.X
  })
  const [winner, setWinner] = useState(null)

  const resetGame = ()=> {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameStorage()
  }

  const updateBoard = (index)=> {
    if (board[index] || winner) return // Si ya tiene algo
    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // Cambiar el turno
    const newTurn = turn===TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    saveGameStorage({
      board: newBoard,
      turn: newTurn
    })
    // Revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <BoardGame board={board} updateBoard={updateBoard} />
      <section className="turn">
        <Square isSelected={turn===TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn===TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal winner={winner} resetGame={resetGame} />
      <button onClick={resetGame}>Reiniciar Juego</button>
    </main>
  )
}

export default App
