<?php
require '../connectDB.php';

$opponentId = $_POST["opponentId"];
$userId = $_POST['userId'];
$roomId = $_POST['roomId'];

$sql = "DELETE FROM room_user WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$opponentId]);
$user1 = $stmt->fetch(PDO::FETCH_ASSOC);

$sql = "UPDATE room_user SET wait_time = null, status='wait' WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$userId]);
$user1 = $stmt->fetch(PDO::FETCH_ASSOC);

$sql = "UPDATE room SET status='wait' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$roomId]);
$user1 = $stmt->fetch(PDO::FETCH_ASSOC);