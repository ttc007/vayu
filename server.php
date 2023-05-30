<?php
require 'vendor/autoload.php';
require 'MySocket/MyWebSocket.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MySocket\MyWebSocket;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MyWebSocket()
        )
    ),
    8080
);

$server->run();

