<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

$data = [];
// Thực hiện truy vấn danh sách user_rooms từ DB
$query = "SELECT room.*
    FROM room
    JOIN room_user ON room.id = room_user.room_id
    JOIN user ON user.id = room_user.user_id
    WHERE room.status ='playing'
    GROUP BY room.id
    ORDER BY user.elo
    LIMIT 10";
$statement = $conn->prepare($query);
$statement->execute();
$rooms = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($rooms as $key => $room) {
	$data[$key] = $room;
	// Thực hiện truy vấn danh sách user_rooms từ DB
	$query = "SELECT * FROM room_user JOIN user ON user.id = room_user.user_id WHERE room_user.room_id = ? AND room_user.color!=3";
	$statement = $conn->prepare($query);
	$statement->execute([$room['id']]);
	$room_users = $statement->fetchAll(PDO::FETCH_ASSOC);
	$data[$key]['users'] = $room_users;
}

// Trả về dữ liệu dưới dạng JSON
echo json_encode(["data" => $data]);
?>
