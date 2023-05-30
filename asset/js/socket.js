var roomId = $("#roomId").val();
var userId = parseInt($("#userId").val());
var userName = $("#userName").val();
var userElo = $("#userElo").val();
var color = parseInt($("#color").val());

var socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Kết nối WebSocket đã được thiết lập.');
    // Gửi yêu cầu xóa người chơi khỏi danh sách phòng chờ
    socket.send(JSON.stringify({ action: 'leaveLobby', id: userId }));
    
    var data = {
      action: 'joinRoom',
      data: {
        roomId: roomId,
        id: userId,
        name: userName,
        elo: userElo
      }
    };

    socket.send(JSON.stringify(data));
};

socket.onmessage = function(event) {
    console.log('Nhận tin nhắn từ máy chủ:', event.data);
};

socket.onclose = function(event) {
    console.log('Kết nối WebSocket đã đóng.');
};

socket.onerror = function(error) {
    console.log('Lỗi kết nối WebSocket:', error);
};

function updateLobbyList(data) {
    // console.log(data);
}

socket.onmessage = function(event) {
    var message = event.data;
    var jsonData = JSON.parse(message);
    
    // Thực hiện các xử lý với dữ liệu JSON đã được parse
    // if (jsonData.action == 'lobbyUpdate') updateLobbyList(jsonData.data);
    if (jsonData.action == 'roomUsers') roomUsers(jsonData);
};

function roomUsers(jsonData) {
  const usersArray = Object.values(jsonData.data);
  const roomStatus = jsonData.status;
  // Xử lý dữ liệu danh sách người chơi
  // Ví dụ: Cập nhật thông tin đối thủ trong phòng
  const opponentInfo = usersArray.find(user => user.userId !== userId);

  if (opponentInfo) {
    // Cập nhật thông tin đối thủ lên HTML
    $('.opponent-content .play-name').text(opponentInfo.userName);
    $('.opponent-content .elo').text('Điểm Elo: ' + opponentInfo.userElo);
    $('#opponentUserId').val(opponentInfo.userId);
    
    if (opponentInfo.status === 'ready') $('.opponent-content').addClass('ready');
  } else {
    $('.opponent-content .play-name').text("");
    $('.opponent-content .elo').text("");
    $('#readyButton').hide();
  }

  const userInfo = usersArray.find(user => user.userId == userId);;

  if (roomStatus === 'ready' && userInfo.status === 'wait') {
    $('#readyButton').css('display', 'inline-block');
  } else {
    // Ẩn nút "Ready" nếu không phải trạng thái "ready"
    $('#readyButton').hide();
  }

  console.log(jsonData);
}

$(document).ready(function() {
  $('#leave-room-btn').click(function() {
    socket.send(JSON.stringify({ action: 'leaveRoom', roomId: roomId, userId: userId }));
    Promise.resolve().then(function() {
      $('#leave-room-form')[0].submit();
    });
  });

  $('#readyButton').click(function() {
    socket.send(JSON.stringify({ action: 'playerReady', roomId: roomId, userId: userId }));
  });
});