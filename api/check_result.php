<?php
require '../connectDB.php';

$roomId = $_POST["roomId"];
$score1 = $_POST["score1"];
$score2 = $_POST["score2"];

$sql = "SELECT room_user.*, user.name, user.elo FROM room_user JOIN user ON user.id=room_user.user_id 
	WHERE room_user.color=1 AND room_user.room_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$roomId]);
$user1 = $stmt->fetch(PDO::FETCH_ASSOC);

$sql = "SELECT room_user.*, user.name, user.elo FROM room_user JOIN user ON user.id=room_user.user_id 
	WHERE room_user.color=2 AND room_user.room_id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$roomId]);
$user2 = $stmt->fetch(PDO::FETCH_ASSOC);

$sql = "UPDATE room SET status = 'ready', turn_playing = 0, timer = null WHERE id = $roomId";
$statement = $conn->prepare($sql);
$statement->execute();

$sql = "UPDATE room_user SET status = 'wait' WHERE room_id = $roomId AND color != 3";
$statement = $conn->prepare($sql);
$statement->execute();

$win = ['color' => 3];
$lost = ['color' => 3];
$isDicken = false;

$title = "Kết quả";

if ($score1 == $score2) {
	$isDicken = true;
	$title = "Kết quả điểm số (" . $score1 . "/" . $score2 . ")";
} else if ($score1 > $score2) {
	$win['score'] = $score1;
	$win['name'] = $user1['name'];
	$win['elo'] = 10 - round(((int)$user1['elo'] - (int)$user2['elo'])/100);
	$win['color'] = 1;

	$elo = $user1['elo'] + $win['elo'];
	$sql = "UPDATE user SET elo = ? WHERE id = ?";
  	$statement = $conn->prepare($sql);
    $statement->execute([$elo, $user1['user_id']]);

	$lost['score'] = $score2;
	$lost['name'] = $user2['name'];
	$lost['elo'] = 10 - round(((int)$user1['elo'] - (int)$user2['elo'])/100);
	$lost['color'] = 2;

	$elo = $user2['elo'] - $lost['elo'];
	$sql = "UPDATE user SET elo = ? WHERE id = ?";
  	$statement = $conn->prepare($sql);
    $statement->execute([$elo, $user2['user_id']]);
} else {
	$lost['score'] = $score1;
	$lost['name'] = $user1['name'];
	$lost['elo'] = 10 + round(((int)$user1['elo'] - (int)$user2['elo'])/100);
	$lost['color'] = 1;

	$elo = $user1['elo'] - $lost['elo'];
	$sql = "UPDATE user SET elo = ? WHERE id = ?";
  	$statement = $conn->prepare($sql);
    $statement->execute([$elo, $user1['user_id']]);

	$win['score'] = $score2;
	$win['name'] = $user2['name'];
	$win['elo'] = 10 + round(((int)$user1['elo'] - (int)$user2['elo'])/100);
	$win['color'] = 2;
	
	$elo = $user2['elo'] + $win['elo'];
	$sql = "UPDATE user SET elo = ? WHERE id = ?";
  	$statement = $conn->prepare($sql);
    $statement->execute([$elo, $user2['user_id']]);
}

$response = [
	"isDicken" => $isDicken,
	"win" => $win,
	"lost" => $lost,
	"win_color" => $win['color'],
	"lost_color" => $lost['color'],
	"title" => $title,
];

echo json_encode($response);