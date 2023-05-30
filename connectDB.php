<?php
try {
    // Kết nối cơ sở dữ liệu
    $conn = new PDO("mysql:host=localhost;dbname=covay", 'root', '');
    // Thiết lập chế độ báo lỗi cho PDO
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}