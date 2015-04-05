/*
  Connect 4 Game logic

  Written for Blueprints: Express.js, Chapter 3

*/
var MIN_ROWS = 6,
    MIN_COLUMNS = 7,
    players = ['x','o'];

// Initializes and returns the board as a 2D array.
// Arguments accepted are int rows, int columns,
// Default values: rows = 6, columns = 7
exports.initializeBoard = function initializeBoard(rows, columns){
  var board = [];
  rows = rows || MIN_ROWS;
  columns = columns || MIN_COLUMNS;

  // Default values is minimum size of the game
  if (rows < MIN_ROWS) {
    rows = MIN_ROWS;
  }

  if (columns < MIN_COLUMNS) {
    columns = MIN_COLUMNS;
  }

  // Generate board
  for (var i = 0; i < rows; i++){
    var row = [];
    for (var j = 0; j < columns; j++){
      row.push(' ');
    }
    board.push(row);
  }
  return board;
};

// Used to draw the board to console, mainly for debugging
exports.drawBoard = function drawBoard(board){
  var numCols = board[0].length,
      numRows = board.length;
  consolePrint(' ');
  for (var i = 1; i <= numCols; i++){
    consolePrint(i+'');
    consolePrint(' ');
  }
  consolePrint('\n');
  for (var j = 0; j < numCols*2+1; j++){
    consolePrint('-');
  }
  consolePrint('\n');
  for (i = 0; i < numRows; i++){
    consolePrint('|');
    for (j = 0; j < numCols; j++){
      consolePrint(board[i][j]+'');
      consolePrint('|');
    }
    consolePrint('\n');
    for (j = 0; j < numCols*2+1; j++){
      consolePrint('-');
    }
    consolePrint('\n');
  }
};

// Make a move for the specified player, at the indicated column for this board
// Player should be the player number, 1 or 2
exports.makeMove = function makeMove(player, column, board){
  if (player !== 1 && player !== 2) {
    return false;
  }
  var p = players[player-1];
  for (var i = board.length-1; i >= 0; i--){
    if (board[i][column-1] === ' '){
      board[i][column-1] = p;
      return board;
    }
  }
  return false;
}

// Check for victory on behalf of the player on this board, starting at location (row, column)
// Player should be the player number, 1 or 2
exports.checkForVictory = function checkForVictory(player, lastMoveColumn, board){
  if (player !== 1 && player !== 2) {
    return false;
  }
  var p = players[player-1],
      directions = [[1,0],[1,1],[0,1],[1,-1]],
      rows = board.length,
      columns = board[0].length,
      lastMoveRow;
  lastMoveColumn--;
  // Get the lastMoveRow based on the lastMoveColumn
  for (var r = 0; r < rows; r++) {
    if(board[r][lastMoveColumn] !== ' ') {
      lastMoveRow = r;
      break;
    }
  }


  for (var i = 0; i<directions.length; i++){
    var matches = 0;
    // Check in the 'positive' direction
    for (var j = 1; j < Math.max(rows,columns); j++){
      if (board[lastMoveRow + j*directions[i][1]] && p === board[lastMoveRow + j*directions[i][1]][lastMoveColumn + j*directions[i][0]]){
        matches++;
      } else {
        break;
      }
    }
    // Check in the 'negative' direction
    for (j = 1; j < Math.max(rows,columns); j++){
      if (board[lastMoveRow - j*directions[i][1]] && p === board[lastMoveRow - j*directions[i][1]][lastMoveColumn - j*directions[i][0]]){
        matches++;
      } else {
        break;
      }
    }
    // If there are greater than three matches, then that means there are at least 4 in a row
    if (matches >= 3){
      return true;
    }
  }
  return false;
};

function consolePrint(msg) {
  process.stdout.write(msg);
}
