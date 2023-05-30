<?php
require '../connectDB.php';

$userId = $_POST["userId"];
$roomId = $_POST["roomId"];

$stmt = $conn->prepare("INSERT INTO room_user (room_id, user_id, status, color) VALUES ('$roomId', '$userId', 'view', 3)");
$stmt->execute();

echo json_encode(['status' => 200]);
?>