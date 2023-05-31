<?php
session_start();

if (!isset($_SESSION['user'])) {
  header("Location: login_form.php");
  exit(); // Đảm bảo dừng việc thực thi các mã lệnh tiếp theo
} else {
	$user = $_SESSION['user'];
}

require 'connectDB.php';
try {
    // Truy vấn dữ liệu từ bảng "user"
		$query = "SELECT room_user.*, room_user.status as status, room.status as room_status, 
			room.turn_playing, room.timer, room.moves
			FROM room_user
			JOIN room ON room_user.room_id = room.id WHERE room_user.user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$user['id']]);

    // Lấy tất cả dòng dữ liệu từ kết quả truy vấn
    $roomUser = $stmt->fetch(PDO::FETCH_ASSOC);

    $roomId = 0;
    if ($roomUser) {
    	$roomId = $roomUser['room_id'];
    }

    $conn = null;
} catch (PDOException $e) {
    echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}


?>

<!DOCTYPE html>
<html>
<head>
	<title>Cờ vây online</title>
  <link rel="icon" type="image/x-icon" href="asset/img/anh1.ico">
	<link rel="stylesheet" type="text/css" href="asset/css/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
 	<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>

	<meta charset="UTF-8">
</head>
<body>
	<div id="app">
		<!-- Sử dụng các component trong template -->
		<input type="hidden" id='userId' value="<?php echo $user['id']; ?>">
		<input type="hidden" id='roomId' value="<?php echo $roomId; ?>">
	  <index-component v-if="roomId==0"
	  	:user_name="userName" 
	  	:user_elo="userElo" 
	  	:user_id="userId"
	  	@show_room="showRoom"
	  	@set_clicked="setClicked"
	  	:is_popup_visible="isPopupListRoomVisible"
	  	:list_room_playing="listRoomPlaying"
	  	:user_elo_change="userEloChange"
	  	@close_list_room="closeListRoom"
  	></index-component>

  	<room-component v-if="roomId>0"
	  	:user_name="userName" 
	  	:user_elo="userElo" 
	  	:user_id="userId"
	  	:user_status='userStatus'
	  	:user_color="userColor"

	  	:player_name="playerName" 
	  	:player_elo="playerElo" 
	  	:player_id="playerId"
	  	:player_status='playerStatus'
	  	:player_color="playerColor"
	  	:player_score='playerScore'
	  	:player_move_count='playerMoveCount'

	  	:opponent_name="opponentName" 
	  	:opponent_elo="opponentElo" 
	  	:room_status="roomStatus"
	  	:opponent_status="opponentStatus"
	  	:opponent_id = "opponentId"
	  	:opponent_color="opponentColor"
	  	:opponent_score='opponentScore'
	  	:opponent_move_count='opponentMoveCount'

	  	:room_id="roomId"
	  	:turn_playing="turnPlaying"
	  	:timer="timer"
	  	:time_server='timeServer'
	  	:moves='moves'
	  	:notification='notification'
	  	:messages='messages'
	  	@show_index="showIndex"
	  	@room_users='roomUsers'
	  	@set_clicked="setClicked"
	  	:opponent_elo_change="opponentEloChange"
    	:player_elo_change="playerEloChange"
    	:is_get_request_result="isGetRequestResult"
    	@close_get_request_result="closeGetRequestResult"
    	:is_result="isResult"
    	:response_result="responseResult"
    	@close_result="closeResult"
    	@start_wait_interval="startWaitInterval"
    	:is_opponent_wait_ready="isOpponentWaitReady"
    	:opponent_wait_ready_time="opponentWaitReadyTime"
    	:is_get_dicken="isGetDicken"
    	@close_get_dicken="closeGetDicken"
  	></room-component>
	</div>

  <script src="asset/js/component/indexComponent_.js"></script>
  <script src="asset/js/component/roomComponent_.js"></script>
  <script src="asset/js/component/popupComponent_.js"></script>
  <script src="asset/js/component/chatComponent_.js"></script>
  <script src="asset/js/index.js"></script>
</body>
</html>