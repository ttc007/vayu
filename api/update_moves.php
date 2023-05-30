<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

// Kiểm tra xem có dữ liệu roomId được gửi từ AJAX hay không
if (isset($_POST['roomId'])) {
  // Lấy giá trị roomId từ AJAX
  $roomId = $_POST['roomId'];
  $moves = $_POST['moves'];
  $userId = $_POST['userId'];

  $stmt = $conn->prepare("SELECT * FROM room WHERE id = :roomId");
  $stmt->bindParam(':roomId', $roomId);
  $stmt->execute();
  $room = $stmt->fetch(PDO::FETCH_ASSOC);

  if (isset($_POST['action']) && $_POST['action'] == 'giveWay') {
    $stmt = $conn->prepare("SELECT * FROM user WHERE id = $userId");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
  } else {
    $captureOpponentsCount = $_POST['captureOpponentsCount'];

    $stmt = $conn->prepare("SELECT * FROM room_user WHERE user_id = $userId");
    $stmt->execute();
    $room_user = $stmt->fetch(PDO::FETCH_ASSOC);

    $move_count = $room_user['move_count'] + 1;
    $score = $room_user['score'] + $captureOpponentsCount;
    
    $stmt = $conn->prepare("UPDATE room_user SET move_count = ?, score = ? WHERE user_id = ?");
    $stmt->execute([$move_count, $score, $userId]);
  }

  if ($room) {
    $newTime = time() + 20;
    $newTurnPlaying = $room['turn_playing'] == 1 ? 2 : 1;
    $stmt = $conn->prepare("UPDATE room SET moves = ?, timer = $newTime, turn_playing = $newTurnPlaying WHERE id = ?");
    $stmt->execute([$moves, $roomId]);
  }
  
  // Trả về dữ liệu dưới dạng JSON
  echo json_encode(["status" => 200, "room" => $room, "time" => $newTime, "newTurnPlaying" => $newTurnPlaying]);
} else {
  // Trường hợp không có roomId được gửi lên từ AJAX
  echo json_encode(array('error' => 'Invalid request'));
}
?>