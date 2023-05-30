Vue.component('index-component', {
  props: ['user_name', 'user_elo', 'user_id', 'list_room_playing', 'is_popup_visible', 'user_elo_change'],
  template: `
    <div class="container">
      <div class="avatar">
        <img src="asset/img/ava_default.jpg" alt="Avatar">
      </div>
      <h1 class='name'>{{user_name}}</h1>
      <p class="elo">Elo: {{user_elo}} <span class="elo-change" v-if="user_elo_change != 0"
        :class="{'elo-increase': user_elo_change > 0, 'elo-decrease': user_elo_change < 0 }">{{user_elo_change}}</span></p>

      <div class='btnListRoom-container'>
          <button id="btnListRoom" @click="showPopupListRoom">
            Xem cờ
          </button>
      </div>

      <div class="bottom-content">
        <div class="game-modes-container">
          <div class="game-mode">
            <img src="asset/img/anh2.jpg" alt="Đấu online" class="game-mode-image" @click="showRoomComponent">
            <h3>Đấu online</h3>
          </div>
        </div>

        <div class="logout">
          <a href="logout.php" class="logout-button">THOÁT</a>
        </div>
      </div>

      <div id="popup" class="popup room-popup" v-if="is_popup_visible">
        <div class="popup-content" style="height:600px">
          <h2 class="title">Trận hay đang đấu</h2>
          <div class="list-room-playing ">
            <div v-if="list_room_playing.length==0" class='room-null-msg'>Chưa có trận đấu nào</div>
            <div v-for="room in list_room_playing" :key="room.id" class="list-room-playing-row">
              <div class='row' @click='viewRoom(room.id)'>
                <div class="player">
                  <img src="asset/img/ava_default.jpg" alt="Player 1" class="player-avatar">
                  <p class="name">{{ room.users[0].name }}</p>
                  <p class="elo">Elo: {{ room.users[0].elo }}</p>
                </div>
                <div class="room-info">
                  <h4>Room {{ room.id }}</h4>
                  <img src="asset/img/room_playing.png" alt="Chessboard" class="chessboard-image">
                </div>
                <div class="player">
                  <img src="asset/img/ava_default.jpg" alt="Player 2" class="player-avatar">
                  <p class="name">{{ room.users[1].name }}</p>
                  <p class="elo">Elo: {{ room.users[1].elo }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="btn-container" style="margin-top:9px">
            <button @click="hidePopup" class="btn-close">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isPopupVisible: false,
    };
  },
  methods: {
    showRoomComponent() {
      var userId = this.user_id;
      var userElo = this.user_elo;
      socket.send(JSON.stringify({ action: 'checkRoom', userId: userId, userElo: userElo }));
      this.$emit('set_clicked', 1);
    },
    showPopupListRoom() {
      var userId = this.user_id;
      socket.send(JSON.stringify({ action: 'getListRoom', userId:userId}));
      this.$emit('set_clicked', 1);
    },
    hidePopup() {
      this.$emit('close_list_room');
    },
    viewRoom(roomId) {
      var userId = this.user_id;
      this.$emit('close_list_room');
      socket.send(JSON.stringify({ action: 'viewRoom', userId: userId, roomId: roomId }));
    }
  },
});
