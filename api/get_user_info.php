<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

// Kiểm tra xem có dữ liệu roomId được gửi từ AJAX hay không
if (isset($_POST['userId'])) {
  // Lấy giá trị roomId từ AJAX
  $userId = $_POST['userId'];

  // Thực hiện truy vấn danh sách user_rooms từ DB
  $query = "SELECT user.id, user.name, user.elo FROM user WHERE id=:id";
  $statement = $conn->prepare($query);
  $statement->bindParam(':id', $userId);
  $statement->execute();
  $user = $statement->fetch(PDO::FETCH_ASSOC);

  // Trả về dữ liệu dưới dạng JSON
  echo json_encode(["user" => $user]);
} else {
  // Trường hợp không có roomId được gửi lên từ AJAX
  echo json_encode(array('error' => 'Invalid request'));
}
?>