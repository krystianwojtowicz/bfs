var gridModule = (function () {
  var startRow, startCol, endRow, endCol;
  var grid = [];
  var numRows = 5;
  var numCols = 5;
  var numObstacles = 5;
  function displayGrid(grid, shortestPath) {
    var numRows = grid.length;
    var numCols = grid[0].length;
    var container = document.createElement("div");
    container.className = "grid-container";
    for (var i = 0; i < numRows; i++) {
      var row = document.createElement("div");
      row.className = "grid-row";
      for (var j = 0; j < numCols; j++) {
        var cell = document.createElement("div");
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
    return shortestPath.some(function (_a) {
      var pathRow = _a[0],
        pathCol = _a[1];
      return row === pathRow && col === pathCol;
    });
  }
  function bfs(grid, startRow, startCol, endRow, endCol) {
    var numRows = grid.length;
    var numCols = grid[0].length;
    var visited = new Array(numRows).fill(false).map(function () {
      return new Array(numCols).fill(false);
    });
    var visited = new Array(numRows).fill(false).map(function () {
      return new Array(numCols).fill(false);
    });
    var parents = new Array(numRows).fill(null).map(function () {
      return new Array(numCols).fill(null);
    });
    var queue = [];
    var directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1], // Left
    ];
    // Add the start cell to the queue and mark it as visited
    queue.push([startRow, startCol]);
    visited[startRow][startCol] = true;
    // Loop until the queue is empty
    while (queue.length > 0) {
      var _a = queue.shift(),
        row = _a[0],
        col = _a[1];
      // Check if the current cell is the end cell
      if (row === endRow && col === endCol) {
        return reconstructPath(parents, startRow, startCol, endRow, endCol);
      }
      // Visit the neighbors of the current cell
      for (
        var _i = 0, directions_1 = directions;
        _i < directions_1.length;
        _i++
      ) {
        var _b = directions_1[_i],
          dx = _b[0],
          dy = _b[1];
        var newRow = row + dx;
        var newCol = col + dy;
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
  }
  // Helper function to reconstruct the path
  function reconstructPath(parents, startRow, startCol, endRow, endCol) {
    var path = [];
    var currentRow = endRow;
    var currentCol = endCol;
    while (currentRow !== startRow || currentCol !== startCol) {
      path.unshift([currentRow, currentCol]);
      var _a = parents[currentRow][currentCol],
        parentRow = _a[0],
        parentCol = _a[1];
      currentRow = parentRow;
      currentCol = parentCol;
    }
    path.unshift([startRow, startCol]);
    return path;
  }
  function generatePoints() {
    var numRows = grid.length;
    var numCols = grid[0].length;
    do {
      startRow = Math.floor(Math.random() * numRows);
      startCol = Math.floor(Math.random() * numCols);
      endRow = Math.floor(Math.random() * numRows);
      endCol = Math.floor(Math.random() * numCols);
    } while (
      grid[startRow][startCol] === 1 ||
      grid[endRow][endCol] === 1 ||
      (startRow === endRow && startCol === endCol)
    );
  }
  function generateGrid() {
    var grid = new Array(numRows).fill(null).map(function () {
      return new Array(numCols).fill(0);
    });
    while (numObstacles > 0) {
      var row = Math.floor(Math.random() * numRows);
      var col = Math.floor(Math.random() * numCols);
      if (grid[row][col] === 0) {
        grid[row][col] = 1;
        numObstacles--;
      }
    }
    return grid;
  }
  function initialize() {
    grid = generateGrid();
    generatePoints();
    // Find the shortest path using BFS
    var shortestPath = bfs(grid, startRow, startCol, endRow, endCol);
    if (shortestPath.length === 0) {
      console.log("No path found");
    }
    // Display the grid with the shortest path
    displayGrid(grid, shortestPath);
  }
  return {
    initialize: initialize,
  };
})();
gridModule.initialize();
