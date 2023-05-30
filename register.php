<?php
session_start();
$username = $_POST["username"];
$password = $_POST["password"];
$email = $_POST["email"];
$repassword = $_POST["repassword"];
$name = $_POST["name"];

$_SESSION["register_data"] = [
    "username" => $username,
    "email" => $email,
    "name" => $name
];

require 'connectDB.php';
try {
    // Kiểm tra dữ liệu đăng nhập
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if ($password != $repassword) {
            $_SESSION["error"] = "Mật khẩu xác nhận không khớp.";
            header("Location: register_form.php");
            exit();
        }

        // Kiểm tra tên đăng nhập không chứa khoảng trắng
        if (strpos($username, ' ') !== false) {
            $_SESSION["error"] = "Tên đăng nhập không được chứa khoảng trắng.";
            header("Location: register_form.php");
            exit();
        }

        // Kiểm tra email đã tồn tại
        $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        if ($result) {
            $_SESSION["error"] = "Email đã tồn tại.";
            header("Location: register_form.php");
            exit();
        }

        // Kiểm tra tên đăng nhập đã tồn tại
        $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
        $stmt->execute([$username]);
        $result = $stmt->fetch();
        if ($result) {
            $_SESSION["error"] = "Tên đăng nhập đã tồn tại.";
            header("Location: register_form.php");
            exit();
        }

        // Kiểm tra tên đăng nhập đã tồn tại
        $stmt = $conn->prepare("SELECT * FROM user WHERE name = ?");
        $stmt->execute([$name]);
        $result = $stmt->fetch();
        if ($result) {
            $_SESSION["error"] = "Tên hiển thị đã tồn tại.";
            header("Location: register_form.php");
            exit();
        }

        // Thực hiện thêm người dùng vào cơ sở dữ liệu
        $stmt = $conn->prepare("INSERT INTO user (username, name, email, password) VALUES (?,?,?,?)");
        $stmt->execute([$username, $name, $email, $password]);

        $conn = null;

        $_SESSION["success"] = "Đăng kí thành công. Vui lòng đăng nhập.";
        header("Location: login_form.php");
        exit();
    }
} catch (PDOException $e) {
    echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}