<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

// Kiểm tra xem có dữ liệu roomId được gửi từ AJAX hay không
if (isset($_POST['roomId'])) {
  // Lấy giá trị roomId từ AJAX
  $roomId = $_POST['roomId'];

  // Thực hiện truy vấn danh sách user_rooms từ DB
  $query = "SELECT ru.*, u.name, u.elo
  FROM room_user ru
  JOIN user u ON ru.user_id = u.id
  WHERE ru.room_id = :roomId";
  $statement = $conn->prepare($query);
  $statement->bindParam(':roomId', $roomId);
  $statement->execute();
  $userRooms = $statement->fetchAll(PDO::FETCH_ASSOC);

  // Thực hiện truy vấn danh sách user_rooms từ DB
  $query = "SELECT * FROM room WHERE id = :roomId";
  $statement = $conn->prepare($query);
  $statement->bindParam(':roomId', $roomId);
  $statement->execute();
  $room = $statement->fetch(PDO::FETCH_ASSOC);

  // Trả về dữ liệu dưới dạng JSON
  echo json_encode(["room" => $room, "room_users" => $userRooms]);
} else {
  // Trường hợp không có roomId được gửi lên từ AJAX
  echo json_encode(array('error' => 'Invalid request'));
}
?>
