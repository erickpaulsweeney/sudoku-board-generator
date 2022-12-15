import { useEffect, useState } from "react";
import { makepuzzle, solvepuzzle } from "sudoku";
import html2canvas from "html2canvas";

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [active, setActive] = useState(false);

  function clearBoard() {
    let board = document.getElementById("board");
    let child = board.lastElementChild;
    while (child) {
      board.removeChild(child);
      child = board.lastElementChild;
    }
  }

  function generateBoard() {
    let puzzle = makepuzzle();
    let solve = solvepuzzle(puzzle);

    let board = [];
    for (let i = 0; i < puzzle.length; i += 9) {
      board.push(
        puzzle
          .slice(i, i + 9)
          .map((el) => (el ? el.toString() : "-"))
          .reduce((accu, curr) => (accu += curr), "")
      );
    }

    let solution = [];
    for (let i = 0; i < solve.length; i += 9) {
      solution.push(
        solve
          .slice(i, i + 9)
          .map((el) => el.toString())
          .reduce((accu, curr) => (accu += curr), "")
      );
    }

    // console.log(solve);
    // console.log(solution);
    setBoard(board);
    setSolution(solution);
    setActive(true);
  }

  function setPuzzle() {
    clearBoard();

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let tile = document.createElement("div");
        tile.id = r.toString() + "-" + c.toString();
        if (board[r][c] !== "-") {
          tile.innerText = board[r][c];
          tile.classList.add("tile-start");
        }
        if (r === 2 || r === 5) {
          tile.classList.add("horizontal-line");
        }
        if (c === 2 || c === 5) {
          tile.classList.add("vertical-line");
        }

        tile.classList.add("tile");
        document.getElementById("board").append(tile);
      }
    }
  }

  function showSolution() {
    clearBoard();

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        let tile = document.createElement("div");
        tile.id = r.toString() + "-" + c.toString();

        tile.innerText = solution[r][c];
        tile.classList.add("tile-start");

        if (r === 2 || r === 5) {
          tile.classList.add("horizontal-line");
        }
        if (c === 2 || c === 5) {
          tile.classList.add("vertical-line");
        }

        tile.classList.add("tile");
        document.getElementById("board").append(tile);
      }
    }
    setActive(false);
  }

  function downloadimage() {
    /*var container = document.getElementById("image-wrap");*/ /*specific element on page*/
    var container = document.getElementById("board"); /* full page */
    html2canvas(container, { allowTaint: true }).then(function (canvas) {
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = active ? "board.jpg" : "solution.jpg";
      link.href = canvas.toDataURL();
      link.target = "_blank";
      link.click();
    });
  }

  useEffect(() => {
    generateBoard();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (board.length > 0) {
      setPuzzle();
    }
    // eslint-disable-next-line
  }, [board]);

  return (
    <>
      <h1>Sudoku Board Generator</h1>
      <br />
      <div id="board"></div>
      <br />
      <div id="buttons-div">
        <button id="new" onClick={generateBoard}>
          Generate Board
        </button>
        <button id="solution" onClick={showSolution} disabled={!active}>
          Show Solution
        </button>
        <button id="download" onClick={downloadimage}>
          Download {active ? "Board" : "Solution"}
        </button>
      </div>
    </>
  );
}

export default App;
