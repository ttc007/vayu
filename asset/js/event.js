var threshold = 0.4;

// Xử lý sự kiện click chuột
canvas.addEventListener("click", function (event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left + 20;
  var y = event.clientY - rect.top + 20;

  var row = Math.round(y / cellSize);
  var col = Math.round(x / cellSize);

  if (row > 1 && row <= boardSize && col > 1 && col <= boardSize && !isPositionOccupied(col, row)) {
    var deviationY = row - y / cellSize;
    var deviationX = col - x / cellSize;

    if (Math.abs(deviationX) <= threshold && Math.abs(deviationY) <= threshold) {
      
      // Lưu nước đi vào mảng
      moves.push({ row: row, col: col, player: currentPlayer });

      // Chuyển lượt đi sang người chơi tiếp theo
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
  }

  // Vẽ quân cờ
  drawBoard();

  // Kiểm tra kết quả
  checkResult();
});

function isPositionOccupied(col, row) {
  for (var i = 0; i < moves.length; i++) {
    var move = moves[i];
    if (move.col === col && move.row === row) {
      return true;
    }
  }
  return false;
}

// Xử lý sự kiện di chuột
canvas.addEventListener("mousemove", function (event) {
  drawBoard();

  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left + 20;
  var y = event.clientY - rect.top + 20;

  var row = Math.round(y / cellSize);
  var col = Math.round(x / cellSize);

  if (row > 1 && row <= boardSize && col > 1 && col <= boardSize && !isPositionOccupied(col, row)) {
    var deviationY = row - y / cellSize;
    var deviationX = col - x / cellSize;

    if (Math.abs(deviationX) <= threshold && Math.abs(deviationY) <= threshold) {
      var x = col * cellSize - cellSize;
      var y = row * cellSize - cellSize;

      ctx.beginPath();
      ctx.arc(x, y, cellSize / 4, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }
  }
});
