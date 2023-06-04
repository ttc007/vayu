<?php
require '../connectDB.php';

$userId = $_POST["userId"];
$userElo = $_POST['userElo'];

$color = 1;

try {

    // Truy vấn dữ liệu từ bảng "user"
    $query = "(SELECT room.*
              FROM room
              JOIN room_user ON room.id = room_user.room_id
              JOIN user ON room_user.user_id = user.id
              WHERE room.status = 'wait'
              ORDER BY ABS(user.elo - :userElo)
              LIMIT 1)";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':userElo', $userElo);
    $stmt->execute();
    $room = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$room) {
        $query = "(SELECT room.*
              FROM room
              WHERE room.status = 'wait'
              LIMIT 1)";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        $room = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Kiểm tra dữ liệu đăng nhập
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Kiểm tra thông tin đăng nhập
        if ($room) {
            $roomId = $room['id'];
            
            $stmt = $conn->prepare("SELECT room_user.*, user.elo FROM room_user
                JOIN user ON user.id = room_user.user_id
                WHERE room_id = $roomId AND user_id != $userId AND color != 3 
                ORDER BY user.elo
            ");
            $stmt->execute();
            $opponent = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($opponent) {
              $color = $opponent['color'] == 1 ? 2 : 1;
              $stmt = $conn->prepare("INSERT INTO room_user (room_id, user_id, status, color) VALUES ('$roomId', '$userId', 'wait', $color)");
              $stmt->execute();

              $updateQuery = "UPDATE room SET status = 'ready' WHERE id = :roomId";
              $updateStatement = $conn->prepare($updateQuery);
              $updateStatement->bindParam(':roomId', $roomId);
              $updateStatement->execute();

              
            } else {
              $stmt = $conn->prepare("INSERT INTO room_user (room_id, user_id, status, color) VALUES ('$roomId', '$userId', 'wait', 1)");
              $stmt->execute();
            }
        } else {
            // Truy vấn dữ liệu từ bảng "user"
		    $stmt = $conn->prepare("INSERT INTO room (status) VALUES ('wait')");
		    $stmt->execute();

		    $roomId = $conn->lastInsertId();
		    $stmt = $conn->prepare("INSERT INTO room_user (room_id, user_id, status, color) VALUES ('$roomId', '$userId', 'wait', 1)");
		    $stmt->execute();
        }

        $conn = null;

        echo json_encode(['roomId'=>$roomId, 'color' => $color]);
    }

} catch (PDOException $e) {
    echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}

?>