<?php
require '../connectDB.php';

$roomId = $_POST["roomId"];

$sql = "UPDATE room SET status = 'ready', turn_playing = 0, timer = null WHERE id = $roomId";
$statement = $conn->prepare($sql);
$statement->execute();

$sql = "UPDATE room_user SET status = 'wait' WHERE room_id = $roomId AND color != 3";
$statement = $conn->prepare($sql);
$statement->execute();

$response = [
	"isDicken" => true,
	"title" => "Hòa cuộc"
];

echo json_encode($response);