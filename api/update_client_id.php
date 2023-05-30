<?php
// Kết nối đến database
require_once '../connectDB.php';

// Lấy giá trị user_id từ form post
$user_id = $_POST['user_id'];
$client_id = $_POST['client_id'];

// Đối thủ đã sẵn sàng, cập nhật trạng thái của cả hai người chơi
$updateQuery = "UPDATE user SET client_id = ? WHERE id = ?";
$updateStatement = $conn->prepare($updateQuery);
$updateStatement->execute([$client_id, $user_id]);

// Đóng kết nối đến database
$conn = null;

echo json_encode(['status' => 200]);
exit;
?>
