var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

// Kích thước ô và số lượng ô trên bàn cờ
var cellSize = 24;
var boardSize = 19;

// Vị trí điểm giao được chuột di chuyển vào
var highlightedRow = -1;
var highlightedCol = -1;

// Kích thước canvas dựa trên kích thước bàn cờ
var canvasWidth = cellSize * (boardSize + 1);
var canvasHeight = cellSize * (boardSize + 1);

// Cập nhật kích thước canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var moves = [];

// Vẽ bàn cờ và quân cờ
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ các đường ngang
  for (var row = 0; row < boardSize; row++) {
    ctx.beginPath();
    ctx.moveTo(cellSize, (row + 1) * cellSize);
    ctx.lineTo(boardSize * cellSize, (row + 1) * cellSize);
    ctx.stroke();
  }

  // Vẽ các đường dọc
  for (var col = 0; col < boardSize; col++) {
    ctx.beginPath();
    ctx.moveTo((col + 1) * cellSize, cellSize);
    ctx.lineTo((col + 1) * cellSize, boardSize * cellSize);
    ctx.stroke();
  }

  // Vẽ các điểm hoshi
  var hoshiPositions = [3, 9, 15]; // Vị trí của các điểm hoshi trên một cạnh
  
  for (var i = 0; i < hoshiPositions.length; i++) {
    for (var j = 0; j < hoshiPositions.length; j++) {
      var col = hoshiPositions[i];
      var row = hoshiPositions[j];
      
      var x = col * cellSize + cellSize;
	    var y = row * cellSize + cellSize;

	    ctx.beginPath();
	    ctx.arc(x, y, cellSize / 8, 0, 2 * Math.PI);
	    ctx.fillStyle = "black";
	    ctx.fill();
	    ctx.closePath();
    }
  }

  // Vẽ quân cờ
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    var row = move.row;
    var col = move.col;
    var player = move.player;

    var x = col * cellSize - cellSize;
  	var y = row * cellSize - cellSize;

    ctx.beginPath();
    ctx.arc(x, y, cellSize / 3, 0, 2 * Math.PI);
    ctx.fillStyle = player === 1 ? "black" : "white";
    ctx.fill();
    ctx.closePath();
  }
}
// Gọi hàm vẽ bàn cờ
drawBoard();

// Kiểm tra kết quả
function checkResult() {
	//
}
