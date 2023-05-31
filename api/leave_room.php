<?php
require '../connectDB.php';

try {
  // Lấy user_id từ form post gởi lên
  $userId = $_POST['userId'];
  $roomId = $_POST['roomId'];
  $notification = $_POST['notification'];

  $sql = "SELECT room_user.*, user.elo, user.name FROM room_user JOIN user ON user.id=room_user.user_id WHERE room_user.user_id=?";
  $stmt = $conn->prepare($sql);
  $stmt->execute([$userId]);
  $roomUser = $stmt->fetch(PDO::FETCH_ASSOC);

  $response = [];
  $win = ['color' => 3];
  $lost = ['color' => 3];
  if ($roomUser && $roomUser['color'] != 3) {
    // Cập nhật trạng thái của phòng thành "wait"
    $sql = "UPDATE room SET status = 'wait', turn_playing = 0, timer = 0, moves='[]' WHERE id = $roomId";
    $statement = $conn->prepare($sql);
    $statement->execute();

    $sql = "UPDATE room_user SET status = 'wait' WHERE color != 3";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    if ($roomUser['status'] == "playing") {
      $sql = "SELECT room_user.*, user.elo, user.name FROM room_user 
        JOIN user ON user.id=room_user.user_id 
        WHERE room_user.user_id!=:user_id AND color != 3";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':user_id', $userId);
      $stmt->execute();
      $opponent = $stmt->fetch(PDO::FETCH_ASSOC);

      $lost['name'] = $roomUser['name'];
      $lost['elo'] = 10 + round(((int)$roomUser['elo'] - (int)$opponent['elo'])/100);
      $elo = $roomUser['elo'] - $lost['elo'];
      $sql = "UPDATE user SET elo = ? WHERE id = ?";
      $statement = $conn->prepare($sql);
      $statement->execute([$elo, $userId]);

      $win['name'] = $opponent['name'];
      $win['elo'] = 10 + round(((int)$roomUser['elo'] - (int)$opponent['elo'])/100);
      $opponentElo = $opponent['elo'] + $win['elo'];
      $sql = "UPDATE user SET elo = ? WHERE id = ?";
      $statement = $conn->prepare($sql);
      $statement->execute([$opponentElo, $opponent['user_id']]);
    } else if ($roomUser['status'] == "wait") {
      // Xóa tin nhắn
      $sql = "UPDATE room SET messages = null WHERE id = $roomId";
      $statement = $conn->prepare($sql);
      $statement->execute();
    }
  }

  // Xóa các dòng trong bảng room_user có user_id tương ứng
  $sql = "DELETE FROM room_user WHERE user_id = :user_id";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':user_id', $userId);
  $stmt->execute();

  // Đóng kết nối cơ sở dữ liệu
  $conn = null;

  $response = [
    "title" => $notification,
    "isDicken" => false,
    "win" => $win,
    "lost" => $lost,
    "win_color" => $opponent['color'],
    "lost_color" => $roomUser['color']
  ];
  echo json_encode($response);
} catch(PDOException $e) {
  echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}
?>
