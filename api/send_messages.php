<?php
// Kết nối đến cơ sở dữ liệu
require_once '../connectDB.php';

// Lấy giá trị roomId từ AJAX
$roomId = $_POST['roomId'];
$messages = $_POST['messages'];

$sql = "UPDATE room SET messages=? WHERE id = $roomId";
$statement = $conn->prepare($sql);
$statement->execute([$messages]);