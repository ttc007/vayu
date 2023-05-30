<?php
$username = $_POST["username"];
$password = $_POST["password"];
session_start();

require 'connectDB.php';
try {
    // Truy vấn dữ liệu từ bảng "user"
    $stmt = $conn->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
    $stmt->execute([$username, $password]);

    // Lấy tất cả dòng dữ liệu từ kết quả truy vấn
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $conn = null;

    // Kiểm tra dữ liệu đăng nhập
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Kiểm tra thông tin đăng nhập
        if ($user) {
            // Đăng nhập thành công, tạo phiên làm việc và chuyển hướng đến trang chơi game
            $_SESSION["user"] = $user;
            header("Location: /");
            exit;
        } else {
            // Thông tin đăng nhập không hợp lệ, hiển thị thông báo lỗi
            $_SESSION["error"] = "Tên người dùng hoặc mật khẩu không đúng.";
            header("Location: login_form.php");
        }
    }
} catch (PDOException $e) {
    echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}
?>
