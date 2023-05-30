Vue.component('room-component', {
  props: [
    'user_id', 
    'user_name', 
    'user_elo',
    'user_status', 
    'user_color',

    'player_id',
    'player_name', 
    'player_elo', 
    'player_status',
    'player_color',
    'player_score',
    'player_move_count',

    'opponent_id',
    'opponent_name', 
    'opponent_elo', 
    'opponent_status',
    'opponent_color',
    'opponent_score',
    'opponent_move_count',
    'room_id', 
    'room_status',
    'turn_playing',
    'timer',
    'time_server',
    'moves',
    'notification',
    'messages',
    'opponent_elo_change',
    'player_elo_change',
    'is_get_request_result',
    'is_result',
    'response_result',
    'is_opponent_wait_ready',
    'opponent_wait_ready_time',

    'is_get_dicken'
    ],
  template: `
    <div class="canvas-wrapper game-container" id="canvas-wrapper">
        <div class="player-info">
          <div class="play-content" :class="{ 
            'my-info': user_color == player_color,
            'zoom-in-zoom-out': player_zoom_in }">
            <div v-if="player_color != ''">
              <div class="play-content-info" >
                <img src="asset/img/ava_default.jpg"class="player-avatar" v-if="player_color != ''">
                <div class="play-name">{{ player_name }}</div>
                <div class="elo" v-if="player_elo">Elo:{{ player_elo }}
                <span class="elo-change" v-if="player_elo_change != 0"
                  :class="{'elo-increase': player_elo_change > 0, 'elo-decrease': player_elo_change < 0 }">
                  <span v-if="player_elo_change>0">+</span>{{player_elo_change}}</span></div>
              </div>
              <div class="user-color">
                <div class="color" v-if="player_color !=''"
                  :class="{'black': player_color == 1, 'white': player_color == 2}"
                  v-if="room_status === 'playing'"
                ></div>
              </div>

              <div class='container-timer' v-if="room_status=='playing'">
                <div class="timer" v-if="player_color == turn_playing && room_status == 'playing'">
                  <div class="timer-circle"></div>
                  <div class="timer-text" id='timer-player' v-if="time_server">{{timer - time_server}}</div>
                </div>
              </div>
              <button class="give-btn" @click="giveWay" title="Nhường lượt" 
                v-if="room_status=='playing' && turn_playing==user_color && user_color==player_color"></button>
            </div>
              
            <!-- Div sẵn sàng -->
            <div class="ready-overlay" v-if="room_status=='ready'&&player_status=='ready'">
              <span class="ready-text">Sẵn sàng</span>
            </div>
          </div>
          <div class='user-score-container' v-if="room_status=='playing'">
            <div class="move-count" v-if="player_move_count">Số nước đi: {{player_move_count}}</div>
            <div class="score" v-if="player_score">Điểm: {{player_score}}</div>
            <div class="surrender-container"
              v-if="user_color != 3 && user_color == player_color">
              <button class="surrender-btn" @click="showPopupSurrender" title="Đầu hàng">
              </button>
              <button class="dicken-btn" @click="showPopupDicken" title="Cầu hòa" 
                v-if='player_color == turn_playing'></button>
              <button class="result-request" 
                @click="showCheckResultPopup" title="Yêu cầu tính điểm" 
                v-if='player_color == turn_playing'>
              </button>
            </div>
          </div>

          <div class="leave-room-btn">
            <button id="leave-room-btn" class="btn btn-icon" title="Rời phòng" @click="showPopupLeaveRoom"></button>
          </div>

          <div class="bottom-content"></div>
        </div>

        <div class="canvas-container">
          <!-- Div notification -->
          <div class="notification-container" v-show="showNotification">
            <span class="notification-text">{{notification}}</span>
          </div>

          <div id="ready-button-container">
            <button id="readyButton" v-if="room_status === 'ready' && user_status === 'wait'" @click="ready">Sẵn sàng</button>
          </div>
          <canvas id="board" ref="canvas" ></canvas>
        </div>

        <div class="opponent-info">
          <div class="opponent-content" 
            :class="{ 
              'my-info': opponent_color == user_color, 
              'zoom-in-zoom-out': opponent_zoom_in}">
            <div v-if="opponent_color !=''">
              <div class="opponent-content-info" v-if="opponent_id !=''">
                <img src="asset/img/ava_default.jpg" class="player-avatar" >
                <div class="play-name">{{ opponent_name }}</div>
                <div class="elo" v-if="opponent_elo">Elo: {{ opponent_elo }}<span class="elo-change" v-if="opponent_elo_change != 0"
                  :class="{'elo-increase': opponent_elo_change > 0, 'elo-decrease': opponent_elo_change < 0 }">
                  <span v-if="opponent_elo_change>0">+</span>{{opponent_elo_change}}</span></div>
              </div>
              
              <div class="opponent-color" v-if="opponent_id !=''">
                <div class="color"
                  :class="{'black': opponent_color == 1, 'white': opponent_color == 2}"
                  v-if="room_status === 'playing'"
                ></div>
              </div>

              <div class="opponent-container-timer" v-if="opponent_id !=''">
                <div class="timer timer-left" v-if="opponent_color == turn_playing && room_status == 'playing'">
                  <div class="timer-circle"></div>
                  <div class="timer-text" id='timer-opponent' v-if="time_server">{{timer - time_server}}</div>
                </div>
              </div>

              <button class="give-btn" @click="giveWay" title="Nhường lượt" 
                v-if="room_status=='playing' && turn_playing==opponent_color && user_color==opponent_color""></button>
            </div>
            <!-- Div sẵn sàng -->
            <div class="ready-overlay" v-if="room_status=='ready'&&opponent_status=='ready'">
              <span class="ready-text">Sẵn sàng</span>
            </div>
          </div>
          <div class='opponent-score-container' 
            v-if="room_status=='playing'">
            <div class="move-count" v-if="opponent_move_count">Số nước đi:{{opponent_move_count}}</div>
            <div class="score" v-if="opponent_score">Điểm: {{opponent_score}}</div>
            <div class="surrender-container"
              v-if="user_color != 3 && user_color == opponent_color">
              <button class="surrender-btn" @click="showPopupSurrender" title="Đầu hàng">
              </button>
              <button class="dicken-btn" @click="showPopupDicken" title="Cầu hòa" 
                v-if='opponent_color == turn_playing'>
              </button>
              <button class="result-request" @click="showCheckResultPopup" title="Yêu cầu tính điểm"  
                v-if='opponent_color == turn_playing'>
              </button>
            </div>
          </div>
        </div>

        <chat-component class="chat-component" 
          :messages="messages"
          :user_name="user_name"
          :room_id='room_id'
        ></chat-component>

        <popup-component v-if="isPopupLeaveRoom" class="room-popup"
          :title="'Bạn có chắc muốn rời phòng'"
          :message="'Bạn sẽ được tính là thua'"
          @ok_click="showIndexComponent"
          @close_popup="hidePopupLeaveRoom"
        ></popup-component>

        <popup-component v-if="isPopupSurrender" class="room-popup"
          :title="'Bạn có chắc muốn đầu hàng'"
          :message="'Bạn sẽ được tính là thua'"
          @ok_click="surrender"
          @close_popup="hidePopupSurrender"
        ></popup-component>

        <popup-component v-if="isPopupCheckResult" class="room-popup"
          :title="'Bạn muốn yêu cầu tính điểm'"
          :message="'Yêu cầu sẽ được gởi đến cho đối thủ'"
          @ok_click="sendRequestResult"
          @close_popup="hidePopupRequestResult"
        ></popup-component>

        <popup-component v-if="isPopupDicken" class="room-popup"
          :title="'Bạn muốn cầu hòa'"
          :message="'Yêu cầu sẽ được gởi đến cho đối thủ'"
          @ok_click="sendRequestDicken"
          @close_popup="hidePopupDicken"
        ></popup-component>

        <popup-component v-if="is_get_request_result" class="room-popup"
          :title="'Đối thủ muốn yêu cầu tính điểm'"
          :message="'Hệ thống sẽ tính điểm và phán định thắng thua'"
          @ok_click="checkResult"
          @close_popup="cancelGetResult"
        ></popup-component>

        <popup-component v-if="is_get_dicken" class="room-popup"
          :title="'Đối thủ muốn cầu hòa'"
          :message="'Các bạn sẽ kết thúc trong êm đẹp'"
          @ok_click="sendDicken"
          @close_popup="cancelDicken"
        ></popup-component>

        <div class="popup room-popup" v-if="is_result">
          <div class="popup-content" style="height:260px">
            <h2 class="title">{{resultTitle}}</h2>
            <div class="result-container">
              <div v-if="isDicken" class="dicken-mesage">
                <h3 class="dicken-mesage">Các bạn đã hòa nhau</h3>
              </div>
              <div class="result-column win-column" v-if="!isDicken">
                <div>
                  <h4>Chiến thắng</h4>
                  <p>{{win.name}}: +{{win.elo}} Elo</p>
                  <p v-if="win.score">Điểm: {{win.score}}</p>
                </div>
              </div>
              <div class="result-column lost-column" v-if="!isDicken">
                <div>
                  <h4>Thua cuộc</h4>
                  <p>{{lost.name}}: -{{win.elo}} Elo</p>
                  <p v-if="lost.score">Điểm: {{lost.score}}</p>
                </div>
              </div>
            </div>
            <div class="btn-container" style="margin-top:9px">
              <button class="btn-ok" @click="closeResult">Đồng ý</button>
              <button class="btn-close" @click="closeResult">Đóng</button>
            </div>
          </div>
        </div>

        <div class="wait-ready-notification" v-if='is_opponent_wait_ready'>
          <div>Đối thủ đã sẵn sàng và đang chờ bạn!</div>
          <div class="countdown">{{opponent_wait_ready_time}}</div>
        </div>

      </div>
  `,
  data() {
    return {
      cellSize: 24,
      boardSize: 19,
      highlightedRow: -1,
      highlightedCol: -1,
      canvasWidth: 0,
      canvasHeight: 0,
      threshold: 0.3,
      player_zoom_in: false,
      opponent_zoom_in: false,
      showNotification: false,
      isPopupLeaveRoom: false,
      isPopupSurrender: false,
      isPopupCheckResult:false,
      isPopupDicken:false,
      win:null,
      lost:null,
      isDicken:false,
      resultTitle:null
    };
  },
  mounted() {
    // Cập nhật kích thước canvas
    this.updateCanvasSize();

    // Vẽ canvas ban đầu
    this.drawBoard();

    const canvas = this.$refs.canvas;
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('click', this.handleClick);

    var roomId = this.room_id;
  },
  watch: {
    response_result(newVal, oldVal) {
      var result = newVal;
      if (result != '' && newVal != oldVal && result != null) {
        this.resultTitle = result.title;
        if (result.isDicken) {
          this.isDicken = result.isDicken;
        } else {
          this.isDicken = false;
          this.win = result.win;
          this.lost = result.lost;
        }
      }
    },
    turn_playing(newVal, oldVal) {
      // Kiểm tra nếu lượt đánh thay đổi, vẽ lại bàn cờ
      if (newVal != oldVal) {
        this.drawBoard();

        if (newVal == this.player_color) this.player_zoom_in = true;
        if (newVal == this.opponent_color) this.opponent_zoom_in = true;

        if (newVal == this.user_color && !this.checkCanMove()) {
          var userId = this.user_id;
          var roomId = this.room_id;
          var notification = this.user_name + " không còn đường nào để đi";

          socket.send(JSON.stringify({action: 'surrender', roomId: roomId, userId:userId, notification:notification}));
        }
      }

      setTimeout(() => {
        this.player_zoom_in = false;
        this.opponent_zoom_in = false;
      }, 1000);
    },
    moves(newVal, oldVal) {
      // Kiểm tra nếu lượt đánh thay đổi, vẽ lại bàn cờ
      if (this.moves == '') {
        this.moves = "[]";
      }
    },
    notification(newVal, oldVal) {
      if (newVal !== oldVal && newVal != '') {
        this.showNotification = true;
      }

      setTimeout(() => {
        this.showNotification = false;
      }, 2000);
    },
  },
  methods: {
    closeResult() {
      this.$emit('close_result');
    },
    showPopupDicken () {
      this.isPopupDicken = true;
    },
    hidePopupDicken() {
      this.isPopupDicken = false;
    },
    sendRequestDicken() {
      this.isPopupDicken = false;
      if (this.user_id == this.player_id) {
        var opponentId = this.opponent_id;
      } else {
        var opponentId = this.player_id;
      }
      socket.send(JSON.stringify({action: 'sendGetDicken', opponentId: opponentId }));
    },
    cancelDicken() {
      this.$emit('close_get_dicken');
      var roomId = this.room_id;
      var opponentId;
      if (this.user_id == this.player_id) var opponentId = this.opponent_id;
      else opponentId = this.player_id;
      var notification = this.user_name + " đã từ chối cầu hòa";
      socket.send(JSON.stringify({action: 'cancelRequestResult', opponentId: opponentId, notification: notification }));
    },
    sendDicken() {
      this.$emit('close_get_dicken');
      var roomId = this.room_id;
      socket.send(JSON.stringify({action: 'sendDicken', roomId: roomId }));
    },
    showCheckResultPopup() {
      this.isPopupCheckResult = true;
    },
    hidePopupRequestResult() {
      this.isPopupCheckResult = false;
    },
    sendRequestResult() {
      this.isPopupCheckResult = false;
      if (this.user_id == this.player_id) {
        var opponentId = this.opponent_id;
      } else {
        var opponentId = this.player_id;
      }
      socket.send(JSON.stringify({action: 'sendRequestResult', opponentId: opponentId }));
    },
    cancelGetResult() {
      this.$emit('close_get_request_result');
      var roomId = this.room_id;
      var opponentId;
      if (this.user_id == this.player_id) var opponentId = this.opponent_id;
      else opponentId = this.player_id;
      var notification = this.user_name + " đã từ chối yêu cầu tính điểm";
      socket.send(JSON.stringify({action: 'cancelRequestResult', opponentId: opponentId, notification: notification }));
    },
    showPopupLeaveRoom() {
      this.$emit('set_clicked', 1);
      if (this.user_color != 3 && this.room_status=='playing') {
        this.isPopupLeaveRoom = true;
      } else {
        this.showIndexComponent();
      }
    },
    hidePopupLeaveRoom() {
      this.isPopupLeaveRoom = false;
    },
    showIndexComponent() {
      var userId = this.user_id;
      var roomId = this.room_id;

      var notification = this.user_name + ' đã rời phòng';
      socket.send(JSON.stringify({action: 'leaveRoom', roomId: roomId, userId:userId, notification:notification}));
      this.$emit('show_index');
    },
    showPopupSurrender() {
      this.$emit('set_clicked', 1);
      this.isPopupSurrender = true;
    },
    hidePopupSurrender() {
      this.isPopupSurrender = false;
    },
    surrender() {
      var userId = this.user_id;
      var roomId = this.room_id;
      var notification = this.user_name + " đã đầu hàng";

      socket.send(JSON.stringify({action: 'surrender', roomId: roomId, userId:userId, notification:notification}));
      this.isPopupSurrender = false;
    },
    updateCanvasSize() {
      // Cập nhật kích thước canvas dựa trên kích thước bàn cờ
      this.canvasWidth = this.cellSize * (this.boardSize + 1);
      this.canvasHeight = this.cellSize * (this.boardSize + 1);

      // Lấy tham chiếu đến phần tử canvas
      const canvas = this.$refs.canvas;

      // Cập nhật kích thước canvas
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
    },
    drawBoard() {
      // Lấy tham chiếu đến phần tử canvas
      const canvas = this.$refs.canvas;

      // Vẽ bàn cờ trong canvas
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      // Vẽ các đường ngang
      for (var row = 0; row < this.boardSize; row++) {
        ctx.beginPath();
        ctx.moveTo(this.cellSize, (row + 1) * this.cellSize);
        ctx.lineTo(this.boardSize * this.cellSize, (row + 1) * this.cellSize);
        ctx.stroke();
      }

      // Vẽ các đường dọc
      for (var col = 0; col < this.boardSize; col++) {
        ctx.beginPath();
        ctx.moveTo((col + 1) * this.cellSize, this.cellSize);
        ctx.lineTo((col + 1) * this.cellSize, this.boardSize * this.cellSize);
        ctx.stroke();
      }

      // Vẽ các điểm hoshi
      var hoshiPositions = [3, 9, 15]; // Vị trí của các điểm hoshi trên một cạnh
      
      for (var i = 0; i < hoshiPositions.length; i++) {
        for (var j = 0; j < hoshiPositions.length; j++) {
          var col = hoshiPositions[i];
          var row = hoshiPositions[j];
          
          var x = col * this.cellSize + this.cellSize;
          var y = row * this.cellSize + this.cellSize;

          ctx.beginPath();
          ctx.arc(x, y, this.cellSize / 8, 0, 2 * Math.PI);
          ctx.fillStyle = "black";
          ctx.fill();
          ctx.closePath();
        }
      }

      var moves = (this.moves == '') ? [] : JSON.parse(this.moves);
      // Vẽ quân cờ
      if (moves) {
        for (var i = 0; i < moves.length; i++) {
          var move = moves[i];
          var row = move.row;
          var col = move.col;
          var player = move.player;

          var x = col * this.cellSize - this.cellSize;
          var y = row * this.cellSize - this.cellSize;

          ctx.beginPath();
          ctx.arc(x, y, this.cellSize / 2 - 1, 0, 2 * Math.PI);
          ctx.fillStyle = player == 1 ? "black" : "white";
          ctx.fill();
          ctx.closePath();

          if (i == moves.length - 1) {
            ctx.beginPath();
            ctx.arc(x, y, this.cellSize / 2 - 1, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    },
    ready() {
      var userId = this.user_id;
      var opponentId = this.opponent_id == this.user_id ? this.player_id : this.opponent_id;
      var roomId = this.room_id;

      if (this.player_status != 'ready' && this.opponent_status != 'ready') {
        this.$emit('start_wait_interval');
      }

      socket.send(JSON.stringify({ action: 'ready', userId: userId, opponentId: opponentId, roomId: roomId}));
    },
    handleMouseMove(event) {
      if (this.room_status == 'playing' && this.user_color == this.turn_playing) {
        this.drawBoard();

        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');

        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left + 20;
        var y = event.clientY - rect.top + 20;

        var row = Math.round(y / this.cellSize);
        var col = Math.round(x / this.cellSize);

        if (this.isPositionValid(col, row)) {
          var deviationY = row - y / this.cellSize;
          var deviationX = col - x / this.cellSize;

          if (Math.abs(deviationX) <= this.threshold && Math.abs(deviationY) <= this.threshold) {
            var x = col * this.cellSize - this.cellSize;
            var y = row * this.cellSize - this.cellSize;

            ctx.beginPath();
            ctx.arc(x, y, this.cellSize / 2 - 2, 0, 2 * Math.PI);
            ctx.fillStyle = this.user_color == 1 ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"; // Màu đen mờ hoặc trắng mờ
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    },
    handleClick(event) {
      this.$emit('set_clicked', 1);
      if (this.room_status == 'playing' && this.user_color == this.turn_playing) {
        const canvas = this.$refs.canvas;
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left + 20;
        var y = event.clientY - rect.top + 20;

        var row = Math.round(y / this.cellSize);
        var col = Math.round(x / this.cellSize);

        if (this.isPositionValid(col, row)) {

          var deviationY = row - y / this.cellSize;
          var deviationX = col - x / this.cellSize;

          if (Math.abs(deviationX) <= this.threshold && Math.abs(deviationY) <= this.threshold) {
            
            var currentPlayer = this.user_color;

            if (this.moves == '') this.moves = '[]';
            var moves = JSON.parse(this.moves);
            // Lưu nước đi vào mảng
            moves.push({ row: row, col: col, player: currentPlayer });

            this.captureOpponents(col, row, moves);
          }
        }

        // Vẽ quân cờ
        this.drawBoard();
      }
    },
    isPositionOccupied(col, row, moves = null) {
      if (moves == null) {
        if (this.moves == '') moves = [];
        else moves = JSON.parse(this.moves);
      }

      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (move.col === col && move.row === row) {
          return true;
        }
      }
      return false;
    },
    getDirections(col, row, exclude = null) {
      var directions = ["left", "right", "top", "bottom"];

      if (col === 2) {
        directions = directions.filter(direction => direction !== "left");
      }

      if (col === 20) {
        directions = directions.filter(direction => direction !== "right");
      }

      if (row === 2) {
        directions = directions.filter(direction => direction !== "top");
      }

      if (row === 20) {
        directions = directions.filter(direction => direction !== "bottom");
      }

      if (exclude) {
        directions = directions.filter(direction => direction !== exclude);
      }

      return directions;
    },
    getNextMove(col, row, direction) {
      switch (direction) {
        case "left":
          return { col: col - 1, row: row };
        case "right":
          return { col: col + 1, row: row };
        case "top":
          return { col: col, row: row - 1 };
        case "bottom":
          return { col: col, row: row + 1 };
        default:
          return { col: col, row: row };
      }
    },
    getExcludeDirection(fromDirection) {
      switch (fromDirection) {
        case "left":
          return 'right';
        case "right":
          return "left";
        case "top":
          return "bottom";
        case "bottom":
          return "top";
        default:
          return "center";
      }
    },
    isPositionOccupiedByAlly(col, row, color) {
      var moves = JSON.parse(this.moves);

      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (move.col == col && move.row == row && move.player == color) {
          return true; // Vị trí bị chiếm bởi quân đồng minh
        }
      }
      
      return false; // Vị trí không bị chiếm bởi quân đồng minh
    },
    isPositionValid(col, row) {
      if (this.isPositionOccupied(col, row)) {
        return false; // Vị trí không hợp lệ vì bị chiếm
      }

      if (this.hasAir(col, row, { col, row })) {
        return true; // Vị trí hợp lệ do có khí
      }

      if (Object.keys(this.getCaptureOpponents(col, row)).length > 0) {
        return true; // Vị trí hợp lệ do ăn được quân
      }

      return false; // Vị trí không hợp lệ
    },
    hasAir(col, row, excludedPoint = null, areaCheck = {}) {
      var directions = this.getDirections(col, row);

      for (var i = 0; i < directions.length; i++) {
        var direction = directions[i];
        var nextMove = this.getNextMove(col, row, direction);
        if (excludedPoint && nextMove.col === excludedPoint.col && nextMove.row === excludedPoint.row) {
          continue; // Bỏ qua điểm loại trừ
        }

        if (!this.isPositionOccupied(nextMove.col, nextMove.row)) {
          return true; // Có khí
        }

        // console.log(nextMove.col, nextMove.row, this.user_color);
        if (this.isPositionOccupiedByAlly(nextMove.col, nextMove.row, this.user_color)) {
          if (areaCheck[`${nextMove.col}_${nextMove.row}`]) {
            continue;
          }
          areaCheck[`${nextMove.col}_${nextMove.row}`] = true;
          if (this.hasAir(nextMove.col, nextMove.row, { col, row }, areaCheck)) {
            return true;
          }
        }
      }
      return false; // Không có khí
    },
    getOpponentColor() {
      var opponent_color;
      if (this.user_color == this.player_color) {
        opponent_color = this.opponent_color;
      } else {
        opponent_color = this.player_color;
      }

      return opponent_color;
    },
    hasAirOpponent(col, row, data) {
      var directions = this.getDirections(col, row, data.excludeDirection);

      for (var i = 0; i < directions.length; i++) {
        var direction = directions[i];
        var nextMove = this.getNextMove(col, row, direction);

        if (!this.isPositionOccupied(nextMove.col, nextMove.row, data.moves)) {
          return true; // Có khí
        }

        var opponent_color = this.getOpponentColor();
        
        if (this.isPositionOccupiedByAlly(nextMove.col, nextMove.row, opponent_color)) {
          data.excludeDirection = this.getExcludeDirection(direction);

          if (data.connectedOpponents[nextMove.col + '_' + nextMove.row]) {
            continue;
          }

          data.connectedOpponents[nextMove.col + '_' + nextMove.row] = data.direction;

          if (this.hasAirOpponent(nextMove.col, nextMove.row, data)) {
            return true;
          }
        }
      }

      return false; // Không có khí
    },
    getCaptureOpponents(col, row) {
      var directions = this.getDirections(col, row);
      var moves = JSON.parse(this.moves);
      moves.push({col:col, row:row, player: this.user_color});
      var data = {connectedOpponents:{}}
      data.moves = moves;

      var opponent_color = this.getOpponentColor();

      for (var i = 0; i < directions.length; i++) {
        var direction = directions[i];
        var nextMove = this.getNextMove(col, row, direction);

        if (this.isPositionOccupiedByAlly(nextMove.col, nextMove.row, opponent_color)) {
          if (!data.connectedOpponents[nextMove.col + '_' + nextMove.row]) {
            data.connectedOpponents[nextMove.col + '_' + nextMove.row] = direction;
            data.direction = direction;
            if (this.hasAirOpponent(nextMove.col, nextMove.row, data)) {
              data.connectedOpponents = Object.fromEntries(
                Object.entries(data.connectedOpponents).filter(([key, value]) => value !== direction)
              );
            }
          }
        }
      }

      return data.connectedOpponents;
    },
    captureOpponents(col, row, moves) {
      var roomId = this.room_id;
      var userId = this.user_id;
      
      var connectedOpponents = this.getCaptureOpponents(col, row);
      var capturedOpponents = Object.keys(connectedOpponents);

      for (var i = 0; i < capturedOpponents.length; i++) {
        var position = capturedOpponents[i];
        moves = moves.filter(move => move.col + '_' + move.row !== position);
      }

      var captureOpponentsCount = capturedOpponents.length;
      var moves = JSON.stringify(moves);
      // Gọi api update move

      var data = { 
        'action' : 'updateMoves',
        roomId: roomId, 
        moves: moves, 
        captureOpponentsCount : captureOpponentsCount, 
        userId: userId 
      }

      socket.send(JSON.stringify(data));
    },
    giveWay() {
      var moves = this.moves;
      var roomId = this.room_id;
      var userId = this.user_id;

      var notification = this.user_name + " đã nhường lượt";

      var data = { 
        'action' : 'updateMoves',
        roomId: roomId, 
        moves: moves, 
        userId: userId, 
        'actionRoom' : 'giveWay',
        notification: notification
      }
      
      socket.send(JSON.stringify(data));
    },
    isAreaContained(innerPoints, opponentInnerPoints) {
      // Kiểm tra xem tất cả các điểm trong vùng đều nằm trong vùng đối thủ
      for (var i = 0; i < innerPoints.length; i++) {
        var point = innerPoints[i];
        if (!opponentInnerPoints || 
          !opponentInnerPoints.some(
            opponentPoint => opponentPoint.col === point.col && opponentPoint.row === point.row)) {
          return false;
        }
      }

      return true;
    },
    checkResult() {
      var areas = this.getAreas();

      var areasUnique1 = areas[1];
      var areasUnique2 = areas[2];

      if (this.player_color == 1) {
        var score1 = this.player_score;
        var score2 = this.opponent_score;
      } else {
        var score1 = this.opponent_score;
        var score2 = this.player_score;
      }

      for (areaString in areasUnique1) {
        var innerPoints = areasUnique1[areaString];
        score1 += innerPoints.length;
        // Kiểm tra xem vùng hiện tại có nằm trong vùng của người chơi 2 không
        var isInOpponentArea = false;
        for (var opponentAreaString in areasUnique2) {
          var opponentInnerPoints = areasUnique2[opponentAreaString];
          if (this.isAreaContained(innerPoints, opponentInnerPoints)) {
            isInOpponentArea = true;
            break;
          }
        }

        // Nếu vùng hiện tại nằm trong vùng của người chơi 2 và chỉ có 1 khí
        if (isInOpponentArea && innerPoints.length <= 1) {
          // Cộng điểm của vùng hiện tại vào điểm của người chơi 2
          var area = JSON.parse(areaString);
          score1 -= innerPoints.length;
          score2 += Object.keys(area).length;
        } else if (isInOpponentArea && innerPoints.length > 1) {
          score2 -= innerPoints.length;
        }
      }

      for (areaString in areasUnique2) {
        var innerPoints = areasUnique2[areaString];
        score2 += innerPoints.length;
        // Kiểm tra xem vùng hiện tại có nằm trong vùng của người chơi 2 không
        var isInOpponentArea = false;
        for (var opponentAreaString in areasUnique1) {
          var opponentInnerPoints = areasUnique1[opponentAreaString];
          if (this.isAreaContained(innerPoints, opponentInnerPoints)) {
            isInOpponentArea = true;
            break;
          }
        }

        // Nếu vùng hiện tại nằm trong vùng của người chơi 2 và chỉ có 1 khí
        if (isInOpponentArea && innerPoints.length <= 1) {
          var area = JSON.parse(areaString);
          // Cộng điểm của vùng hiện tại vào điểm của người chơi 2
          score2 -= innerPoints.length;
          score1 += Object.keys(area).length;;
        } else if (isInOpponentArea && innerPoints.length > 1) {
          score1 -= innerPoints.length;
        }
      }

      var data = {
        score1: score1,
        score2: score2,
        roomId:roomId,
        action: 'resultRoom'
      }

      socket.send(JSON.stringify(data));
      this.$emit('close_get_request_result');
    },
    getMove(col, row) {
      var moves = JSON.parse(this.moves);
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        if (move.col == col && move.row == row) {
          return move; 
        }
      }

      return null;
    },
    checkPointInArea(currentMove, areasUnique) {
      for (areaString in areasUnique) {
        var areaObject = JSON.parse(areaString);
        if (areaObject[`${currentMove.col}_${currentMove.row}`]) {
          return true
        }
      }

      return false;
    },
    getAreas() {
      var areas = {1: {}, 2: {}}
      var moves = JSON.parse(this.moves);

      for (var row = 2; row <= 20; row++) {
        for (var col = 2; col <= 20; col++) {
          var currentMove = this.getMove(col, row);
          if (currentMove) {
            var areasUnique = areas[currentMove.player];

            if (!this.checkPointInArea(currentMove, areasUnique)) {
              let area1 = {}
              area1[`${currentMove.col}_${currentMove.row}`] = true;
              this.continueArea(area1, currentMove.player, areasUnique);
              areasUnique = this.validArea(areasUnique);
              areasUnique = this.removeNestedAreas(areasUnique);
              areas[currentMove.player] = areasUnique;
            }
          }
        }
      }

      return areas;
    },
    convertToMove(moveString) {
      if (!moveString) return null;

      const [col, row] = moveString.split('_');
      return { col: parseInt(col), row: parseInt(row) };
    },
    continueArea(area, color, areasUnique = {}) {
      var areas = [];
      var areaFors = [];

      const keys = Object.keys(area);
      var lastMove = this.convertToMove(keys[keys.length -1]);
      var lastMoveBefore = this.convertToMove(keys[keys.length -2]);
      var firstMove = this.convertToMove(keys[0]);

      var directionFrom = this.getFromDirection(lastMove, lastMoveBefore);
      var excludeDirection = this.getExcludeDirectionResult(directionFrom);
      const directions = this.getDirectionResult(lastMove, excludeDirection);
      var count = 0;

      for (const direction of directions) {
        const nextMove = this.getNextMoveResult(lastMove, direction);
        if (this.isPositionOccupiedByAlly(nextMove.col, nextMove.row, color)) {
          var areaFirst = { ...area }; 

          if (areaFirst[`${nextMove.col}_${nextMove.row}`]) {
            continue; 
          }

          if (this.isEdgePoint(nextMove) && this.isEdgePoint(firstMove)) {
            areaFirst[`${nextMove.col}_${nextMove.row}`] = true;

            if (!areasUnique[`${JSON.stringify()}`]) {
              areasUnique[`${JSON.stringify(areaFirst)}`] = true;
            }
          }

          areaFirst[`${nextMove.col}_${nextMove.row}`] = true;
          areas.push(areaFirst);
        }
      }

      for (areaFor of areas) {
        if (!areasUnique[`${JSON.stringify()}`]) {
          areasUnique[`${JSON.stringify(areaFor)}`] = true;
          this.continueArea(areaFor, color, areasUnique);
        }
      }
    },
    getFromDirection(move, moveBefore) {
      if (!moveBefore) {
        return null;
      }

      const colDiff = move.col - moveBefore.col;
      const rowDiff = move.row - moveBefore.row;

      if (colDiff === 0 && rowDiff === -1) {
        return 'top';
      } else if (colDiff === 1 && rowDiff === -1) {
        return 'right_top';
      } else if (colDiff === 1 && rowDiff === 0) {
        return 'right';
      } else if (colDiff === 1 && rowDiff === 1) {
        return 'right_bottom';
      } else if (colDiff === 0 && rowDiff === 1) {
        return 'bottom';
      } else if (colDiff === -1 && rowDiff === 1) {
        return 'left_bottom';
      } else if (colDiff === -1 && rowDiff === 0) {
        return 'left';
      } else if (colDiff === -1 && rowDiff === -1) {
        return 'left_top';
      } else {
        // Trường hợp không xác định
        return null;
      }
    },
    getDirectionResult(move, excludes = []) {
      let directions = ['left', 'right', 'top', 'bottom', 'left_top', 'left_bottom', 'right_top', 'right_bottom'];
      const col = move.col;
      const row = move.row;

      if (col === 2) {
        excludes.push('left', 'left_top', 'left_bottom');
      }

      if (col === 20) {
        excludes.push('right', 'right_top', 'right_bottom');
      }

      if (row === 2) {
        excludes.push('top', 'left_top', 'right_top');
      }

      if (row === 20) {
        excludes.push('bottom', 'right_bottom', 'left_bottom');
      }

      directions = directions.filter(direction => !excludes.includes(direction));

      return directions;
    },
    getNextMoveResult(move, direction) {
      const col = parseInt(move.col);
      const row = parseInt(move.row);

      const nextMove = {
        'left': { col: col - 1, row: row },
        'right': { col: col + 1, row: row },
        'top': { col: col, row: row - 1 },
        'bottom': { col: col, row: row + 1 },
        'left_top': { col: col - 1, row: row - 1 },
        'left_bottom': { col: col - 1, row: row + 1 },
        'right_top': { col: col + 1, row: row - 1 },
        'right_bottom': { col: col + 1, row: row + 1 },
      };

      return nextMove[direction] || { col, row };
    },
    getExcludeDirectionResult(fromDirection) {
      const excludeDirectionMap = {
        'left': ['right', 'right_top', 'right_bottom'],
        'right': ['left', 'left_top', 'left_bottom'],
        'top': ['bottom', 'bottom_left', 'bottom_right'],
        'bottom': ['top', 'top_left', 'top_right'],
        'left_top': ['right', 'right_bottom', 'bottom'],
        'left_bottom': ['right', 'right_top', 'top'],
        'right_top': ['left', 'left_bottom', 'bottom'],
        'right_bottom': ['left', 'left_top', 'top'],
      };

      return excludeDirectionMap[fromDirection] || [];
    },
    isEdgePoint(point) {
      return point.col == "2" || point.row == "2" || point.col == "20" || point.row == "20";
    },
    isAdjacent(point1, point2) {
      // Tính khoảng cách giữa các hàng và cột của hai điểm
      var colDistance = Math.abs(point1.col - point2.col);
      var rowDistance = Math.abs(point1.row - point2.row);

      return (colDistance == 1 && rowDistance == 0) || (colDistance == 0 && rowDistance == 1) || (colDistance == 1 && rowDistance == 1);
    },
    checkAdjacentDirections(directionConnected) {
      var direction1 = directionConnected[0];
      var direction2 = directionConnected[1];
      const adjacentDirections = {
        top: ['left_top', 'right_top'],
        bottom: ['left_bottom', 'right_bottom'],
        left: ['left_top', 'left_bottom'],
        right: ['right_top', 'right_bottom'],
        left_top: ['left', 'top'],
        left_bottom: ['left', 'bottom'],
        right_top: ['right', 'top'],
        right_bottom: ['right', 'bottom'],
      };

      return adjacentDirections[direction1].includes(direction2);
    },
    getLines(area, includesPoints) {
      var keys = Object.keys(area);

      if (keys[0] == '2_4') console.log(area, includesPoints);

      var lines = {};
      if (includesPoints.length == 0) return lines;

      var firstPoint = this.convertToMove(keys[0]);
      var lastPoint = this.convertToMove(keys[keys.length-1]);


      if (this.isAdjacent(firstPoint, lastPoint)) {
        return lines;
      }

      if (includesPoints.length == 2) {
        var point1 = includesPoints[0];
        var point2 = includesPoints[1];

        if (point1.col == point2.col) {
          for (let row = 2; row <= 20; row++) {
            lines[`${point1.col}_${row}`] = true;
          }

          for (let col = point1.col == 20 ? firstPoint.col + 1 : firstPoint.col - 1; 
             point1.col == 20 ? col < 20 : col > 2;
             point1.col == 20 ? col++ : col--) {
            lines[`${col}_2`] = true;
          }

          for (let col = point1.col == 20 ? lastPoint.col + 1 : lastPoint.col - 1; 
             point1.col == 20 ? col < 20 : col > 2;
             point1.col == 20 ? col++ : col--) {
            lines[`${col}_20`] = true;
          }
        } else if (point1.row == point2.row) {
          for (let col = 2; col <= 20; col++) {
            lines[`${col}_${point1.row}`] = true;
          }

          for (let row = point1.row == 20 ? firstPoint.row + 1 : firstPoint.row - 1; 
             point1.row == 20 ? row < 20 : row > 2;
             point1.row == 20 ? row++ : row--) {
            lines[`2_${row}`] = true;
          }

          for (let row = point1.row == 20 ? lastPoint.row + 1 : lastPoint.row - 1; 
             point1.row == 20 ? row < 20 : row > 2;
             point1.row == 20 ? row++ : row--) {
            lines[`20_${row}`] = true;
          }
        }
      }
      else if (includesPoints.length == 1) {
        var point = includesPoints[0];

        for (let row = point.row; 
           point.row < point.rowEnd ? row < point.rowEnd : row > point.rowEnd;
           point.row < point.rowEnd ? row++ : row--) {
          lines[`${point.col}_${row}`] = true;
        }

        for (let col = point.col; 
           point.col < point.colEnd ? col < point.colEnd : col > point.colEnd;
           point.col < point.colEnd ? col++ : col--) {
          lines[`${col}_${point.row}`] = true;
        }
      }

      return lines;
    },
    getCornerPosition(area) {
      const points = Object.keys(area).map(pointString => {
        const [col, row] = pointString.split('_');
        return { col: parseInt(col), row: parseInt(row) };
      });

      var firstPoint = points[0];
      var lastPoint = points[points.length - 1];

      var includesPoints = [];
      if ((firstPoint.row == 2 && lastPoint.row == 20) || (lastPoint.row == 2 && firstPoint.row == 20)) {
        if (firstPoint.col > 11 && lastPoint.col > 11) {
          includesPoints.push({col:20, row:2});
          includesPoints.push({col:20, row:20});
        } else {
          includesPoints.push({col:2, row:2});
          includesPoints.push({col:2, row:20});
        }
      } else if ((firstPoint.col == 2 && lastPoint.col == 20) || (lastPoint.col == 2 && firstPoint.col == 20)) {
        if (firstPoint.row > 11 && lastPoint.row > 11) {
          includesPoints.push({col:2, row:20});
          includesPoints.push({col:20, row:20});
        } else {
          includesPoints.push({col:2, row:2});
          includesPoints.push({col:20, row:2});
        }
      } else {
        var count = 0;
        for (pointFor of points) {
          if (this.isEdgePoint(pointFor) && count == 0) {
            firstPoint = pointFor;
            count++;
            continue;
          }

          if (this.isEdgePoint(pointFor) && count == 1) {
            lastPoint = pointFor;
            count++;
          }
        }

        var keys = Object.keys(area);

        if (count == 2 && (firstPoint.col != lastPoint.col && firstPoint.row != lastPoint.row)) {
          var point = {}
          if (firstPoint.col == 2 || lastPoint.col == 2) {
            point.col = 2;
            point.colEnd = lastPoint.col == 2 ? firstPoint.col : lastPoint.col;
          } else {
            point.col = 20;
            point.colEnd = lastPoint.col == 20 ? firstPoint.col : lastPoint.col;
          }

          if (firstPoint.row == 2 || lastPoint.row == 2) {
            point.row = 2;
            point.rowEnd = lastPoint.row == 2 ? firstPoint.row : lastPoint.row;
          } else {
            point.row = 20;
            point.rowEnd = lastPoint.row == 20 ? firstPoint.row : lastPoint.row;
          }

          includesPoints.push(point);
        }
      }

      var lines = {};
      if (!this.isAdjacent(firstPoint, lastPoint)) {
        lines = this.getLines(area, includesPoints);
      }

      const allPoints = [...points, ...includesPoints];

      const minCol = Math.min(...allPoints.map(point => point.col));
      const maxCol = Math.max(...allPoints.map(point => point.col));
      const minRow = Math.min(...allPoints.map(point => point.row));
      const maxRow = Math.max(...allPoints.map(point => point.row));

      // Kiểm tra các góc của khu vực
      const topLeftCorner = { col: minCol, row: minRow };
      const topRightCorner = { col: maxCol, row: minRow };
      const bottomLeftCorner = { col: minCol, row: maxRow };
      const bottomRightCorner = { col: maxCol, row: maxRow };

      return {
        minCol:minCol,
        maxCol:maxCol,
        minRow:minRow,
        maxRow:maxRow,
        lines: lines,
      };
    },
    isInnerArea(areaCheck, lines, col, row) {
      for (const position in areaCheck) {
        const [x, y] = position.split('_');
        
        if (x == col) {
          for (const position2 in areaCheck) {
            if (position2 == position) continue;
            const [a, b] = position2.split('_');
            
            if (a == col && b != y) {
              var min = Math.min(y, b);
              var max = Math.max(y, b);
              if (row <= max && row >= min) {
                return true;
              }
            }
          }

          for (point in lines) {
            const [a, b] = point.split('_');
            if (a == col && b != y) {
              var min = Math.min(y, b);
              var max = Math.max(y, b);
              if (row <= max && row >= min) {
                return true;
              }
            }
          }
        }
      }

      return false;
    },
    getInnerPositions(area) {
      const innerPositions = [];

      var corners = this.getCornerPosition(area);
      var keys = Object.keys(area);

      for (let col = corners.minCol; col <= corners.maxCol; col++) {
        for (let row = corners.minRow; row <= corners.maxRow; row++) {
          if (this.isInnerArea(area, corners.lines, col, row) && !this.isPositionOccupied(col, row) ) {
            innerPositions.push({ col: col, row: row });
          }
        }
      }

      if (keys[0] == '5_20') console.log(area, corners, innerPositions);
      return innerPositions;
    },
    validArea(areasUnique) {
      var validArea = {}

      for (var areaString in areasUnique) {
        var area = JSON.parse(areaString);

        // Lấy danh sách các điểm trong khu vực (area)
        var keys = Object.keys(area);

        const points = Object.keys(area).map(pointString => {
        const [col, row] = pointString.split('_');
          return { col: parseInt(col), row: parseInt(row) };
        });

        var firstPoint = points[0];
        var lastPoint = points[points.length - 1];

        var count = 0;
        for (pointFor of points) {
          if (this.isEdgePoint(pointFor) && count == 0) {
            firstPoint = pointFor;
            count++;
            continue;
          }

          if (this.isEdgePoint(pointFor) && count == 1) {
            lastPoint = pointFor;
            count++;
          }
        }

        if (count == 2) {
          validArea[areaString] = this.getInnerPositions(area);
        }

        if (this.isAdjacent(firstPoint, lastPoint) && !validArea[areaString]) {
          validArea[areaString] = this.getInnerPositions(area);
        }
      }

      return validArea;
    },
    removeNestedAreas(areasUnique) {
      if (areasUnique) {
        var areaKeys = Object.keys(areasUnique);

        for (var i = 0; i < areaKeys.length; i++) {
          var areaString = areaKeys[i];
          var innerPositions = areasUnique[areaString];
          var isNested = false;
          if (innerPositions)

          for (var j = 0; j < areaKeys.length; j++) {
            if (i === j) continue;
            var areaStringCheck = areaKeys[j];
            var innerPositionsCheck = areasUnique[areaStringCheck];

            if (innerPositions.every(position =>
              innerPositionsCheck.some(
                checkPosition =>
                  checkPosition.col === position.col &&
                  checkPosition.row === position.row
              )
            )) {
              delete areasUnique[areaString];

              return this.removeNestedAreas(areasUnique);
            }
          }
        }
      }

      console.log()
      return areasUnique;
    },
    checkCanMove() {
      for (var col = 2; col <= 20; col++) {
        for (var row = 2; row <= 20; row++) {
          if (this.isPositionValid(col, row)) {
            return true;
          }
        }
      }

      return false;
    }
  }
});
