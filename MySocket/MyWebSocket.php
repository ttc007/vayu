<?php
namespace MySocket;

require 'MyCurl.php';
require 'RoomManager.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class MyWebSocket implements MessageComponentInterface {
    protected $clients = [];
    protected $rooms = [];
    protected $roomManager;

    public function __construct() {
        $this->roomManager = new RoomManager();
    }

    public function onOpen(ConnectionInterface $conn) {
        // Khởi tạo kết nối
        // Thêm client vào danh sách kết nối
        
    }

    public function onClose(ConnectionInterface $conn) {
        unset($this->clients[$conn->resourceId]);
        $this->roomManager->setClients($this->clients);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        // Xử lý lỗi
    }

    public function onMessage(ConnectionInterface $from, $message) {
        // Xử lý tin nhắn
        $data = json_decode($message, true);

        $action = $data['action'];

        switch ($action) {
            case 'updateConn':
                $userId = (int) $data['userId'];
                $this->clients[$userId] = $from;
                $this->roomManager->setClients($this->clients);
                break;
            case 'getUserUpdate':
                $userId = (int) $data['userId'];
                $this->roomManager->userUpdate($userId);
                break;
            case 'roomUpdate':
                $roomId = $data['roomId'];
                $this->roomManager->roomUpdate($roomId);
                break;
            case 'updateTimer':
                $roomId = $data['roomId'];
                $this->roomManager->updateTimer($roomId);
                break;
            case 'getServerTime':
                $userId = $data['userId'];
                $timeServer = time();
                $timeData = ['action' => 'timeServerUpdate', 'timeServer' => $timeServer];
                $client = $this->clients[$userId];
                $client->send(json_encode($timeData));
                break;
            case 'checkRoom':
                $userId = $data['userId'];
                $userElo = $data['userElo'];
                $this->roomManager->checkRoom($userId, $userElo);
                break;
            case 'getListRoom':
                $userId = $data['userId'];
                $this->roomManager->getListRoom($userId);
                break;
            case 'viewRoom':
                $roomId = $data['roomId'];
                $userId = $data['userId'];
                $this->roomManager->viewRoom($userId, $roomId);
                break;
            case 'leaveRoom':
                $roomId = $data['roomId'];
                $userId = $data['userId'];
                $notification = $data['notification'];
                $this->roomManager->leaveRoom($userId, $roomId, $notification);
                break;
            case 'ready':
                $opponentId = $data['opponentId'];
                $userId = $data['userId'];
                $roomId = $data['roomId'];
                $this->roomManager->ready($userId, $opponentId, $roomId);
                break;
            case 'updateMoves':
                $roomId = $data['roomId'];
                $moves = $data['moves'];
                $userId = $data['userId'];

                $captureOpponentsCount = isset($data['captureOpponentsCount']) ? $data['captureOpponentsCount'] : null;
                $actionRoom = isset($data['actionRoom']) ? $data['actionRoom'] : null;
                $notification = isset($data['notification']) ? $data['notification'] : null;

                $this->roomManager->updateMoves($roomId, $moves, $userId, $captureOpponentsCount, $actionRoom, $notification);

                break;
            case 'surrender':
                $userId = $data['userId'];
                $roomId = $data['roomId'];
                $notification = $data['notification'];
                $this->roomManager->surrender($userId, $roomId, $notification);
                break;
            case 'sendMessages':
                $roomId = $data['roomId'];
                $messages = $data['messages'];
                $this->roomManager->sendMessages($roomId, $messages);
                break;
            case 'sendRequestResult':
                $opponentId = $data['opponentId']; 
                $data = ['action' => 'getRequestResult'];
                $client = $this->clients[$opponentId];
                $client->send(json_encode($data));
                break;
            case 'cancelRequestResult':
                $opponentId = $data['opponentId'];
                $notification = $data['notification'];

                $userId = (int) $opponentId;
                if (isset($this->clients[$userId])) {
                    $client = $this->clients[$userId];
                    $client->send(json_encode(['action' => 'notification', 'notification' => $notification]));
                }
                break;
            case 'resultRoom':
                $score1 = $data['score1'];
                $score2 = $data['score2'];
                $roomId = $data['roomId'];
                $this->roomManager->resultRoom($roomId, $score1, $score2);
                break;
            case 'sendDicken':
                $roomId = $data['roomId'];
                $this->roomManager->sendDicken($roomId);
                break;
            case 'waitReady':
                $opponentId = $data['opponentId'];
                $countDown = $data['countDown'];
                $userId = (int) $opponentId;
                if (isset($this->clients[$userId])) {
                    $client = $this->clients[$userId];
                    $client->send(json_encode(['action' => 'notificationWaitReady', 'countDown' => $countDown]));
                }
                break;
            case 'disRoomOpponent':
                $opponentId = $data['opponentId'];
                $roomId = $data['roomId'];
                $userId = $data['userId'];

                $this->roomManager->disRoomOpponent($opponentId, $roomId, $userId);
                break;
            case 'sendGetDicken':
                $opponentId = $data['opponentId']; 
                $data = ['action' => 'getDicken'];
                $client = $this->clients[$opponentId];
                $client->send(json_encode($data));
                break;
            // Xử lý các sự kiện khác tại đây
            default:
                // Xử lý sự kiện không được nhận dạng
                break;
        }
    }
}
