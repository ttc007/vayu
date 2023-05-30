<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

// Kiểm tra xem có dữ liệu roomId được gửi từ AJAX hay không
if (isset($_POST['roomId'])) {
  // Lấy giá trị roomId từ AJAX
  $roomId = $_POST['roomId'];

  $stmt = $conn->prepare("SELECT * FROM room WHERE id = :roomId");
  $stmt->bindParam(':roomId', $roomId);
  $stmt->execute();
  $room = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($room) {
    if ($room['timer'] <= time()) {
      $newTime = time() + 20;
      $newTurnPlaying = $room['turn_playing'] == 1 ? 2 : 1;
      $query = "UPDATE room SET timer = $newTime, turn_playing = $newTurnPlaying WHERE id = $roomId";
      $stmt = $conn->prepare($query);
      $stmt->execute();
    }
  }

  // Trả về dữ liệu dưới dạng JSON
  echo json_encode(["status" => 200]);
} else {
  // Trường hợp không có roomId được gửi lên từ AJAX
  echo json_encode(array('error' => 'Invalid request'));
}
?>