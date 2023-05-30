<?php
// Kết nối đến database
require_once '../connectDB.php';

// Lấy giá trị user_id từ form post
$opponent_id = $_POST['opponentId'];
$user_id = $_POST['userId'];

// Thực hiện truy vấn để cập nhật dữ liệu
$query = "SELECT * FROM room_user WHERE user_id = :user_id";
$statement = $conn->prepare($query);
$statement->bindParam(':user_id', $opponent_id);
$statement->execute();
$room_user = $statement->fetch(PDO::FETCH_ASSOC);

// Kiểm tra trạng thái của đối thủ
if ($room_user['status'] == "ready") {
    // Đối thủ đã sẵn sàng, cập nhật trạng thái của cả hai người chơi
    $updateQuery = "UPDATE room_user SET status = 'playing', score = 0, move_count = 0, wait_time = null WHERE room_id = :room_id";
    $updateStatement = $conn->prepare($updateQuery);
    $updateStatement->bindParam(':room_id', $room_user['room_id']);
    $updateStatement->execute();

    $timer = time() + 20;
    // Cập nhật trạng thái của phòng thành 'playing'
    $updateRoomQuery = "UPDATE room SET status = 'playing', timer = $timer, turn_playing = 1, moves='' WHERE id = :room_id";
    $updateRoomStatement = $conn->prepare($updateRoomQuery);
    $updateRoomStatement->bindParam(':room_id', $room_user['room_id']);
    $updateRoomStatement->execute();

    $status = 'playing';

    echo json_encode(['action' => 'Bắt đầu']);
} else {
    // Đối thủ chưa sẵn sàng, chỉ cập nhật trạng thái của người chơi hiện tại
    $updateQuery = "UPDATE room_user SET status = 'ready', wait_time = :wait_time WHERE user_id = :user_id";
    $updateStatement = $conn->prepare($updateQuery);
    $wait_time = time() + 10;
    $updateStatement->bindParam(':wait_time', $wait_time);
    $updateStatement->bindParam(':user_id', $user_id);
    $updateStatement->execute();
    $status = 'ready';

    echo json_encode(['action' => 'Chờ sẵn sàng']);
}

// Đóng kết nối đến database
$conn = null;

exit;
?>
