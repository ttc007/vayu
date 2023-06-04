// Ở app cha
var socket = new WebSocket('ws://localhost:8080');
var userId = $("#userId").val();
var roomId = $("#roomId").val();

socket.onopen = function() {
  socket.send(JSON.stringify({ action: 'updateConn', userId: userId }));
  socket.send(JSON.stringify({ action: 'roomUpdate', roomId: roomId }));
  socket.send(JSON.stringify({ action: 'getUserUpdate', userId: userId }));
  socket.send(JSON.stringify({ action: 'getTurnPlaying', userId: userId, roomId: roomId }));
};

socket.onclose = function(event) {};

new Vue({
    el: '#app',
    data: {
    	userId: userId,
    	userName: '',
    	userElo: '',
    	userStatus: '',
    	userColor: '',

    	playerId: '',
    	playerName: '',
    	playerElo: '',
    	playerStatus: '',
    	playerColor: '',
    	playerScore: '',
    	playerMoveCount: '',

    	opponentName:'',
    	opponentElo: '',
    	opponentStatus: '',
    	opponentId: '',
    	opponentColor: '',
    	opponentScore: '',
    	opponentMoveCount: '',

    	roomId: roomId,
    	roomStatus: '',
    	turnPlaying: '',
    	timer: '',
    	timeServer: '',
    	moves: '',
    	notification: '',
    	messages: '',
    	timerInterval: null,
    	
			clicked:false,
			userEloChange:0,
			opponentEloChange :0,
			playerEloChange:0,

			isPopupListRoomVisible: false,
			listRoomPlaying: [],

			moveSound: null,
    	tichtatSound:null,
			tichSound:null,
			gocuaSound:null,
			roiphongSound:null,
			chienthangSound:null,
			thuacuocSound:null,
			batdauSound:null,
			dongcuaSound:null,
			isGetRequestResult: false,
			isResult: false,
			responseResult: null,
			isUserLost:false,
			isUserWin:false,
			wait_time:null,
			waitInterval:null,
			isOpponentWaitReady:false,
			opponentWaitReadyTime:null,

			isGetDicken:false,
			areas:{}
    },
    mounted() {
    	socket.onmessage = (event) => {
	      var message = event.data;
	      var jsonData = JSON.parse(message);

	      switch (jsonData.action) {
				  case 'roomUsers':
				    this.roomUsers(jsonData, 1);

				    var roomId = this.roomId;
				    var userId = this.userId;

			    	if (jsonData.roomAction == 'Bắt đầu' && this.isUserInteracted()) {
			    		this.batdauSound.play();
			    		this.isOpponentWaitReady = false;
			    		this.turnPlaying = 1;
			    		this.moves = null;
			    		this.areas = {};
  						socket.send(JSON.stringify({ action: 'getTurnPlaying', userId: userId, roomId: roomId }));

  						this.playerScore = 0;
	        		this.playerMoveCount = 0;

	        		this.opponentScore = 0;
	        		this.opponentMoveCount = 0;

	        		this.isOpponentWaitReady = false;

			    	} else if (jsonData.roomAction == 'move' && this.isUserInteracted()) {
			    		this.moveSound.play();
			    	}

				    if (jsonData.responseResult) {
				    	this.isResult = true;
				    	this.responseResult = jsonData.responseResult;
				    	if (this.playerColor == jsonData.responseResult.win_color) {
				    		this.playerEloChange = jsonData.responseResult.win.elo;
				    	} else if (this.playerColor == jsonData.responseResult.lost_color) {
				    		this.playerEloChange = - jsonData.responseResult.lost.elo;
				    	} 

				    	if (this.opponentColor == jsonData.responseResult.win_color) {
				    		this.opponentEloChange = jsonData.responseResult.win.elo;
				    	} else if (this.opponentColor == jsonData.responseResult.lost_color) {
				    		this.opponentEloChange = - jsonData.responseResult.lost.elo;
				    	}

				    	setTimeout(() => {
				        this.isResult = false;
					    	this.responseResult = null;
					    	this.playerEloChange = 0;
					    	this.opponentEloChange = 0;
				      }, 7000);
				    }

				    break;
				  case 'timeServerUpdate':
				    this.timeServer = jsonData.timeServer;
				    if (this.timer - this.timeServer <= 1 && this.isUserInteracted() && this.roomStatus == 'playing') {
				    	// Tiếng quá to
				    	//this.tichSound.play();
				    }

				    if (this.wait_time && this.wait_time - jsonData.timeServer <= 5) {
				    	var opponentId;
				    	if (this.userId == this.playerId) {
				    		opponentId = this.opponentId;
				    	} else {
				    		opponentId = this.playerId;
				    	}

				      var countDown = this.wait_time - jsonData.timeServer;
				      socket.send(JSON.stringify({
				      	action: 'waitReady', 
				      	opponentId: opponentId, 
				      	countDown: countDown 
				      }));

				      var userId = this.userId;
				      var roomId = this.roomId;
				      if (this.wait_time - jsonData.timeServer == 0) {
				      	socket.send(JSON.stringify({
					      	action: 'disRoomOpponent', 
					      	opponentId: opponentId, 
					      	userId: userId,
					      	roomId:roomId
					      }));

					      this.waitInterval = null;
				      }
				    }
				    break;
			    case 'listRoomUpdate':
			    	this.isPopupListRoomVisible = true;
			    	if (jsonData.data) {
			    		this.listRoomPlaying = jsonData.data.data;
			    	}
				    break;
			    case 'userUpdate':
			    	this.userName = jsonData.data.user.name;
			    	this.userElo = jsonData.data.user.elo;
			    	if (jsonData.data.userEloChange && jsonData.data.userEloChange != 0) {
			    		this.userEloChange = jsonData.data.userEloChange;
			    		setTimeout(() => {
					    	this.userEloChange = 0;
				      }, 3000);
			    	}
				    break;
			    case 'getRequestResult':
			    	this.isGetRequestResult = true;
				    break;
			    case 'getDicken':
			    	this.isGetDicken = true;
				    break;
			    case 'notification':
			    	this.notification = jsonData.notification;
				    break;
			    case 'notificationWaitReady':
			    	if (this.roomStatus != 'playing') {
			    		this.isOpponentWaitReady = true;
			    		this.opponentWaitReadyTime = jsonData.countDown;
			    	} else {
			    		this.isOpponentWaitReady = false;
			    	}
			    	
				    break;
			    case 'disRoom':
			    	this.roomId = 0;
			    	var userId = this.userId;
			    	if (this.isUserInteracted()) {
			    		this.dongcuaSound.play();
			    	}
			    	socket.send(JSON.stringify({ action: 'getUserUpdate', userId: userId }));
			    	this.isOpponentWaitReady = false;
				    break;
				  case 'updateMoves':
			    	this.moves = jsonData.moves;
			    	this.playerScore = jsonData.player.score;
			    	this.playerMoveCount = jsonData.player.moveCount;
			    	this.opponentScore = jsonData.opponent.score;
			    	this.opponentMoveCount = jsonData.opponent.moveCount;
			    	this.turnPlaying = jsonData.turnPlaying;
			    	this.timer = jsonData.timer;

			    	if (this.isUserInteracted()) {
			    		this.moveSound.play();
			    	}

			    	if (jsonData.areas) {
			    		this.areas = jsonData.areas;
			    	}

				    break;
			    case 'updateTurnPlaying':
			    	this.turnPlaying = jsonData.turnPlaying;
			    	if (jsonData.timer) this.timer = jsonData.timer;
			    	this.timeServer = jsonData.timerServer;
			    	this.moves = jsonData.moves;

			    	if (jsonData.areas) {
			    		this.areas = jsonData.areas;
			    	}

			    	if (jsonData.player) {
			    		this.playerMoveCount = jsonData.player.moveCount;
			    		this.playerScore = jsonData.player.score;
			    	}

			    	if (jsonData.opponent) {
			    		this.opponentMoveCount = jsonData.opponent.moveCount;
			    		this.opponentScore = jsonData.opponent.score;
			    	}

	      		if (this.roomStatus == 'playing' && !this.timerInterval) {
	      			this.startTimer();
	      		}
				    break;
				  default:
				    // Xử lý khi không khớp với bất kỳ case nào
				    break;
				}
	    };

			this.moveSound = new Audio('asset/sound/cach.mp3');
			this.tichtatSound = new Audio('asset/sound/tichtat.mp3');
			this.tichSound = new Audio('asset/sound/tich.mp3');
			this.gocuaSound = new Audio('asset/sound/gocua.mp3');
			this.roiphongSound = new Audio('asset/sound/roiphong.mp3');
			this.chienthangSound = new Audio('asset/sound/chienthang.mp3');
			this.thuacuocSound = new Audio('asset/sound/thuacuoc.mp3');
			this.batdauSound = new Audio('asset/sound/batdau.mp3');
			this.dongcuaSound = new Audio('asset/sound/dongcua.mp3');
    },
    watch: {
	    timeServer(newVal, oldVal) {
	      // Kiểm tra nếu lượt đánh thay đổi, vẽ lại bàn cờ
	      if (this.timer - newVal == 5 && this.roomStatus=='playing' && this.isUserInteracted()) {
	      	this.tichtatSound.play();
	      }

	      if (this.timer - newVal == 20 || this.timer - newVal == 0) {
	        this.tichtatSound.pause();
	      }
	    },
	    responseResult (newVal, oldVal) {
	    	if (newVal != oldVal && newVal) {
	    		if (newVal.win_color == this.userColor && this.isUserInteracted()) {
	    			this.chienthangSound.play();
	    		}

	    		if (newVal.lost_color == this.userColor && this.isUserInteracted()) {
	    			this.thuacuocSound.play();
	    		}
	    	}
	    },
	    roomStatus (newVal, oldVal) {
	    	if (newVal != oldVal && newVal && newVal != 'playing') {
	    		this.timerInterval = null;
	    		this.tichtatSound.pause();
	    	}
	    }
  	},
    methods: {
    	closeListRoom() {
    		this.isPopupListRoomVisible = false;
    	},
    	startWaitInterval() {
    		this.waitInterval = setInterval(() => {
	    		socket.send(JSON.stringify({ action: 'getServerTime', userId: userId }));
		    }, 1000);
    	},
    	closeResult() {
    		this.isResult = false;
    	},
      showRoom(roomId) {
        this.roomId = roomId;
        this.playerEloChange = 0;
      	this.opponentEloChange = 0;
      },
      showIndex() {
      	this.roomId = 0;
      	this.roomStatus = '';
      	this.playerEloChange = 0;
      	this.opponentEloChange = 0;
      },
      setClicked(clicked) {
      	this.clicked = clicked;
      },
      closeGetRequestResult() {
      	this.isGetRequestResult = false;
      },
      closeGetDicken() {
      	this.isGetDicken = false;
      },
	    roomUsers(jsonData, isSound = 0) {
	      const usersArray = Object.values(jsonData.room_users);
	      const room = jsonData.room;
	      const userId = this.userId;
	      this.roomId = room.id;

	      this.roomStatus = room.status;
	      // this.turnPlaying = room.turn_playing;
	      // this.timer = room.timer;

	      const opponentInfo = usersArray.find(user => user.color == 1);
	      const player = usersArray.find(user => user.color == 2);
	      const user = usersArray.find(user => user.user_id == this.userId);

	      if ((!this.playerName || !this.opponentName) && (player && opponentInfo)) {
	      	if (this.isUserInteracted()) {
        		this.gocuaSound.play();
	      	}
        }

        if ((this.playerName && this.opponentName) && (!player || !opponentInfo)) {
	      	if (this.isUserInteracted()) {
        		this.roiphongSound.play();
	      	}
        }

        if (player && this.userName == player.name) {
        	this.wait_time = player.wait_time;
        }

        if (opponentInfo && this.userName == opponentInfo.name) {
        	this.wait_time = opponentInfo.wait_time;
        }

	      if (player) {
	        this.playerName = player.name;
	        this.playerElo = player.elo;
	        this.playerStatus = player.status;
	        this.playerId = player.user_id;
	        this.playerColor = player.color;
	        // this.playerScore = player.score;
	        // this.playerMoveCount = player.move_count;
	      } else {
	        this.playerName = '';
	        this.playerElo = '';
	        this.playerStatus = '';
	        this.playerColor = '';
	        this.tichtatSound.pause();
	      }

	      if (opponentInfo) {
	        this.opponentName = opponentInfo.name;
	        this.opponentElo = opponentInfo.elo;
	        this.opponentStatus = opponentInfo.status;
	        this.opponentId = opponentInfo.user_id;
	        this.opponentColor = opponentInfo.color;
	        // this.opponentScore = opponentInfo.score;
	        // this.opponentMoveCount = opponentInfo.move_count;
	      } else {
	        this.opponentName = '';
	        this.opponentElo = '';
	        this.opponentStatus = '';
	        this.opponentColor = '';
	        this.tichtatSound.pause();
	      }

	      if (user) {
	      	this.userColor = user.color;
	      	this.userStatus = user.status;
	      }

	      if (this.roomStatus === 'playing' && this.timer) {
		      this.startTimer();
		    } else if (this.roomStatus === 'wait') {
		      this.stopTimer();
		    }

		   	if (this.moves != room.moves && isSound && this.roomStatus == 'playing' && room.moves != '') {
		   		this.tichtatSound.pause();
		   	}

		    // this.moves = room.moves;
		    this.messages = room.messages;
	    },
	    startTimer() {
		    const userId = this.userId;
		    if (this.roomStatus == 'playing') {
		    	this.timerInterval = setInterval(() => {
		    		socket.send(JSON.stringify({ action: 'getServerTime', userId: userId }));
		    		this.checkTimerExpired();
			    }, 1000);
		    }
		  },
		  stopTimer() {
		    // Triển khai logic để dừng đếm ngược ở đây
		    clearInterval(this.timerInterval);
		  },
		  checkTimerExpired() {
		  	if (this.roomStatus == 'playing') {
		  		const timeDifference = this.timer - this.timeServer;
				  if (timeDifference <= 0) {
				    // Gọi API đến server để cập nhật timer và đổi lượt đi
				    const roomId = this.roomId;
				    socket.send(JSON.stringify({ action: 'updateTimer', roomId: roomId }));
				  }
		  	}
		  },
		  isUserInteracted() {
			  return this.clicked;
			}
    }
});