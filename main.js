const grid = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
const start = [];
const end = [];
let startRow;
let startCol;
let endRow;
let endCol;

function displayGrid(grid, startRow, startCol, endRow, endCol, shortestPath) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const container = document.createElement("div");
  container.className = "grid-container";

  for (let i = 0; i < numRows; i++) {
    const row = document.createElement("div");
    row.className = "grid-row";

    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("div");
      cell.className = grid[i][j] === 1 ? "obstacle cell" : "grid-white cell";

      if (i === startRow && j === startCol) {
        cell.classList.add("start-cell");
        cell.textContent = "S"; // Display 'S' for start
      } else if (i === endRow && j === endCol) {
        cell.classList.add("end-cell");
        cell.textContent = "E"; // Display 'E' for end
      } else if (isInPath(i, j, shortestPath)) {
        cell.classList.add("path");
        cell.classList.add("cell");
      }

      row.appendChild(cell);
    }

    container.appendChild(row);
  }

  document.body.appendChild(container);
}

// Helper function to check if a cell is in the shortest path
function isInPath(row, col, shortestPath) {
  return shortestPath.some(
    ([pathRow, pathCol]) => row === pathRow && col === pathCol
  );
}

function bfs(grid, startRow, startCol, endRow, endCol) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const visited = new Array(numRows)
    .fill(false)
    .map(() => new Array(numCols).fill(false));
  const parents = new Array(numRows)
    .fill(null)
    .map(() => new Array(numCols).fill(null));
  const queue = [];
  const directions = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
  ];

  // Add the start cell to the queue and mark it as visited
  queue.push([startRow, startCol]);
  visited[startRow][startCol] = true;

  // Loop until the queue is empty
  while (queue.length > 0) {
    const [row, col] = queue.shift();

    // Check if the current cell is the end cell
    if (row === endRow && col === endCol) {
      return reconstructPath(parents, startRow, startCol, endRow, endCol);
    }

    // Visit the neighbors of the current cell
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      // Check if the neighbor cell is within the grid bounds and is not blocked
      if (
        newRow >= 0 &&
        newRow < numRows &&
        newCol >= 0 &&
        newCol < numCols &&
        grid[newRow][newCol] !== 1 &&
        !visited[newRow][newCol]
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        parents[newRow][newCol] = [row, col];
      }
    }
  }

  return []; // No path found

  // Helper function to reconstruct the path
  function reconstructPath(parents, startRow, startCol, endRow, endCol) {
    const path = [];
    let currentRow = endRow;
    let currentCol = endCol;

    while (currentRow !== startRow || currentCol !== startCol) {
      path.unshift([currentRow, currentCol]);
      const [parentRow, parentCol] = parents[currentRow][currentCol];
      currentRow = parentRow;
      currentCol = parentCol;
    }

    path.unshift([startRow, startCol]);

    return path;
  }
}

function generatePoints(start, end, grid) {
  do {
    startRow = Math.floor(Math.random() * grid.length);
    startCol = Math.floor(Math.random() * grid[0].length);
    endRow = Math.floor(Math.random() * grid.length);
    endCol = Math.floor(Math.random() * grid[0].length);
    start = [startRow, startCol];
    end = [endRow, endCol];
  } while (startRow === endRow && startCol === endCol);
  console.log(start, end);
}

generatePoints(start, end, grid);

// Find the shortest path using BFS
const shortestPath = bfs(grid, startRow, startCol, endRow, endCol);

// Display the grid with the shortest path
displayGrid(grid, startRow, startCol, endRow, endCol, shortestPath);
