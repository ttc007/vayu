<?php
namespace MySocket;

class RoomManager {
    protected $rooms;

    protected $clients;

    protected $myCurl;

    protected $apiHost = "http://localhost";

    public function __construct() {
        $this->rooms = [];
        $this->myCurl = new MyCurl();
    }

    public function setClients($clients) {
        $this->clients = $clients;
    }

    public function userUpdate($userId, $userEloChange = 0) {
        $url = $this->apiHost . '/api/get_user_info.php';
        $data = array(
            'userId' => $userId,
        );
        $response = $this->myCurl->postRequest($url, $data);

        $data = json_decode($response, true);
        $data['userEloChange'] = $userEloChange;

        $userData = ['action' => 'userUpdate', 'data' => $data];
        if (isset($this->clients[$userId])) {
            $client = $this->clients[$userId];
            $client->send(json_encode($userData));
        }
       
    }

    public function roomUpdate($roomId, $responseResult = null, $notification = null, $action = null) {
        if (!isset($this->rooms[$roomId]['clients'])) {
            $clients = [];
        } else {
            $clients = $this->rooms[$roomId]['clients'];
        }

        $url = $this->apiHost . '/api/get_room_info.php';
        $data = array(
            'roomId' => $roomId,
        );
        $response = $this->myCurl->postRequest($url, $data);

        $roomData = json_decode($response, true);

        if ($roomData) {
            $roomUsers = $roomData['room_users'];
            $room = $roomData['room'];

            $roomData = ['action' => 'roomUsers', 'room_users' => $roomUsers, 'room' => $room];

            if ($responseResult) {
                $roomData['responseResult'] = $responseResult;
            }

            if ($action) {
                $roomData['roomAction'] = $action;
            }

            if ($roomUsers) {
                foreach ($roomUsers as $roomUser) {
                    $userId = (int) $roomUser['user_id'];
                    if (isset($this->clients[$userId])) {
                        $client = $this->clients[$userId];
                        $client->send(json_encode($roomData));

                        if ($notification) {
                            $client->send(json_encode(['action' => 'notification', 'notification' => $notification]));
                        }
                    }
                }
            }
        }
    }

    public function updateTimer($roomId) {
        if (isset($this->rooms[$roomId]['timer']) && $this->rooms[$roomId]['timer'] <= time()) {
            if (isset($this->rooms[$roomId]['turn_playing'])) {
                $this->rooms[$roomId]['turn_playing'] = $this->rooms[$roomId]['turn_playing'] == 1 ? 2 : 1;
            } else {
                $this->rooms[$roomId]['turn_playing'] = 1;
            }

            $this->rooms[$roomId]['timer'] = time() + 20;
            $timer = $this->rooms[$roomId]['timer'];
            $turnPlaying = $this->rooms[$roomId]['turn_playing'];
            $timerServer = time();
            $moves = isset($this->rooms[$roomId]['moves']) ? $this->rooms[$roomId]['moves'] : null;
            $areas = isset($this->rooms[$roomId]['areas']) ? $this->rooms[$roomId]['areas'] : [];

            $data = [
                'action' => 'updateTurnPlaying', 
                'turnPlaying' => $turnPlaying,
                'timer' => $timer,
                'timerServer' => $timerServer,
                'moves' => $moves
            ];

            if (isset($this->rooms[$roomId]['users'])) {
                foreach($this->rooms[$roomId]['users'] as $userIdInArr => $userData) {
                    if (isset($this->clients[$userIdInArr])) {
                        $client = $this->clients[$userIdInArr];
                        $client->send(json_encode($data));
                    }
                }
            }
        }
    }

    public function getTurnPlaying($userId, $roomId) {
        $turnPlaying = isset($this->rooms[$roomId]['turn_playing']) ? $this->rooms[$roomId]['turn_playing'] : null;
        $timer = isset($this->rooms[$roomId]['timer']) ? $this->rooms[$roomId]['timer'] : null;
        $timerServer = time();
        $moves = isset($this->rooms[$roomId]['moves']) ? $this->rooms[$roomId]['moves'] : null;
        $areas = isset($this->rooms[$roomId]['areas']) ? $this->rooms[$roomId]['areas'] : null;

        $player = isset($this->rooms[$roomId]['player']) ? $this->rooms[$roomId]['player'] : null;
        $opponent = isset($this->rooms[$roomId]['opponent']) ? $this->rooms[$roomId]['opponent'] : null;

        if (isset($this->clients[$userId])) {
            $client = $this->clients[$userId];
            $client->send(json_encode([
                'action' => 'updateTurnPlaying', 
                'turnPlaying' => $turnPlaying,
                'timer' => $timer,
                'timerServer' => $timerServer,
                'moves' => $moves,
                'areas' => $areas,
                'player' => $player,
                'opponent' => $opponent
            ]));
        }
    }

    public function getServerTime($userId) {
        $timeServer = time();
        $timeData = ['action' => 'timeServerUpdate', 'timeServer' => $timeServer];
        $client = $this->clients[$userId];
        $client->send(json_encode($timeData));
    }

    public function checkRoom($userId, $userElo) {
        $url = $this->apiHost . '/api/check_room.php';
        $data = array(
            'userId' => $userId,
            'userElo' => $userElo
        );
        $response = $this->myCurl->postRequest($url, $data);

        $data = json_decode($response, true);

        $roomId = $data['roomId'];
        $color = $data['color'];

        $this->roomUpdate($roomId);

        $this->rooms[$roomId]['users'][$userId] = [
            'color' => $color,
            'move_count' => 0,
            'score' => 0
        ];
    }

    public function getListRoom($userId) {
        $url = $this->apiHost . '/api/get_list_room.php';
        $response = $this->myCurl->postRequest($url, []);

        $data = json_decode($response, true);

        $sendData = ['action' => 'listRoomUpdate', 'data' => $data];
        $client = $this->clients[$userId];
        $client->send(json_encode($sendData));
    }

    public function viewRoom($userId, $roomId) {
        $url = $this->apiHost . '/api/view_room.php';

        $data = array(
            'userId' => $userId,
            'roomId' => $roomId
        );
        $response = $this->myCurl->postRequest($url, $data);
        $this->roomUpdate($data['roomId']);

        $this->rooms[$roomId]['users'][$userId] = [
            'color' => 3
        ];
    }

    public function leaveRoom($userId, $roomId, $notification) {
        $url = $this->apiHost . '/api/leave_room.php';

        $data = array(
            'userId' => $userId,
            'roomId' => $roomId,
            'notification' => $notification
        );
        $response = $this->myCurl->postRequest($url, $data);

        $responseResult = json_decode($response);

        $userEloChange = null;
        if (isset($responseResult->win)) {
            $userEloChange = - (int)$responseResult->win->elo;
        }

        $this->roomUpdate($roomId, $responseResult);

        $this->userUpdate($userId, $userEloChange);

        unset($this->rooms[$roomId]['users'][$userId]);
    }

    public function ready($userId, $opponentId, $roomId) {
        $url = $this->apiHost . '/api/ready.php';

        $data = array(
            'userId' => $userId,
            'opponentId' => $opponentId
        );

        $response = $this->myCurl->postRequest($url, $data);
        $responseResult = json_decode($response);
        $action = $responseResult->action;
        $notification = null;
        if ($action == "Bắt đầu") {
            $notification = "Trận đầu bắt đầu";
            $this->rooms[$roomId]['turn_playing'] = 1;
            $this->rooms[$roomId]['timer'] = time() + 20;
            $this->rooms[$roomId]['moves'] = '';
            $this->rooms[$roomId]['areas'] = [];
            $this->rooms[$roomId]['player'] = [
                'moveCount' => 0,
                'score' => 0
            ];
            $this->rooms[$roomId]['opponent'] = [
                'moveCount' => 0,
                'score' => 0
            ];
        }

        $this->roomUpdate($roomId, null, $notification, $action);
    }

    public function updateMoves($roomId, $data, $notification = null) {
        $this->rooms[$roomId]['timer'] = time() + 20;
        $data['timer'] = $this->rooms[$roomId]['timer'];
        if (isset($data['turnPlaying'])) {
            $this->rooms[$roomId]['turn_playing'] = $data['turnPlaying'];
        }

        if (isset($data['moves'])) {
            $this->rooms[$roomId]['moves'] = $data['moves'];
        }

        if (isset($data['areas'])) {
            $this->rooms[$roomId]['areas'] = $data['areas'];
        }

        if (isset($data['player'])) {
            $this->rooms[$roomId]['player'] = $data['player'];
        }

        if (isset($data['opponent'])) {
            $this->rooms[$roomId]['opponent'] = $data['opponent'];
        }



        if ($this->rooms[$roomId]['users']) {
            foreach($this->rooms[$roomId]['users'] as $userIdInArr => $userData) {
                if (isset($this->clients[$userIdInArr])) {
                    $client = $this->clients[$userIdInArr];
                    $client->send(json_encode($data));

                    if ($notification) {
                        $client->send(json_encode(['action' => 'notification', 'notification' => $notification]));
                    }
                }
            }
        }
    }

    public function surrender($userId, $roomId, $notification) {
        $url = $this->apiHost . '/api/surrender.php';

        $data = array(
            'userId' => $userId,
            'roomId' => $roomId,
            'notification' => $notification
        );

        $response = $this->myCurl->postRequest($url, $data);

        $responseResult = json_decode($response);

        $this->roomUpdate($roomId, $responseResult);

    }

    public function sendMessages($roomId, $messages) {
        $url = $this->apiHost . '/api/send_messages.php';

        $data = array(
            'roomId' => $roomId,
            'messages' => $messages
        );

        $response = $this->myCurl->postRequest($url, $data);
        $this->roomUpdate($roomId);
    }

    public function cancelRequestResult($userName, $roomId) {
        $url = $this->apiHost . '/api/cancel_check_result.php';

        $data = array(
            'roomId' => $roomId,
            'userName' => $userName
        );

        $response = $this->myCurl->postRequest($url, $data);
        $this->roomUpdate($roomId);
    }

    public function resultRoom($roomId, $score1, $score2) {
        $url = $this->apiHost . '/api/check_result.php';

        $data = array(
            'roomId' => $roomId,
            'score1' => $score1,
            'score2' => $score2,
        );

        $response = $this->myCurl->postRequest($url, $data);
        $responseResult = json_decode($response);

        $this->roomUpdate($roomId, $responseResult);
    }

    public function disRoomOpponent($opponentId, $roomId, $userId) {
        $url = $this->apiHost . '/api/dis_room.php';

        $data = array(
            'opponentId' => $opponentId,
            'userId' => $userId,
            'roomId' => $roomId
        );

        $response = $this->myCurl->postRequest($url, $data);

        $opponentId = (int) $opponentId;
        if (isset($this->clients[$opponentId])) {
            $client = $this->clients[$opponentId];
            $client->send(json_encode(['action' => 'disRoom']));
        }

        $this->roomUpdate($roomId);
    }

    public function sendDicken($roomId) {
        $url = $this->apiHost . '/api/dicken_room.php';

        $data = array(
            'roomId' => $roomId,
        );

        $response = $this->myCurl->postRequest($url, $data);
        $responseResult = json_decode($response);

        $this->roomUpdate($roomId, $responseResult);
    }
}
