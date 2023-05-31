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
        $url = $this->apiHost . '/api/update_timer.php';
        $data = array(
            'roomId' => $roomId,
        );
        $response = $this->myCurl->postRequest($url, $data);

        $this->roomUpdate($roomId);
    }

    public function checkRoom($userId, $userElo) {
        $url = $this->apiHost . '/api/check_room.php';
        $data = array(
            'userId' => $userId,
            'userElo' => $userElo
        );
        $response = $this->myCurl->postRequest($url, $data);

        $data = json_decode($response, true);

        $this->roomUpdate($data['roomId']);
    }

    public function getListRoom($userId) {
        $url = $this->apiHost . '/api/get_list_room.php';
        $response = $this->myCurl->postRequest($url, []);

        $data = json_decode($response, true);

        var_dump($response);
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
        }

        $this->roomUpdate($roomId, null, $notification, $action);
    }

    public function updateMoves($roomId, $moves, $userId, $captureOpponentsCount, $actionRoom, $notification = null) {
        $url = $this->apiHost . '/api/update_moves.php';

        $data = array(
            'userId' => $userId,
            'roomId' => $roomId,
            'moves' => $moves
        );

        if ($actionRoom) {
            $data['action'] = $actionRoom;
        }

        if ($captureOpponentsCount) {
            $data['captureOpponentsCount'] = $captureOpponentsCount;
        }

        $response = $this->myCurl->postRequest($url, $data);

        if ($actionRoom != 'giveWay') {
            $action = "move";
        }

        $this->roomUpdate($data['roomId'], null, $notification, $action);
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
