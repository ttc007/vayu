<?php
$username = $_POST["username"];
$password = $_POST["password"];
$email = $_POST["email"];
$repassword = $_POST["repassword"];
$name = $_POST["name"];

require '../connectDB.php';

$response = ["error" => null];
try {
    // Kiểm tra dữ liệu đăng nhập
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if ($password != $repassword) {
            $response["error"] = "Mật khẩu xác nhận không khớp.";
        }

        // Kiểm tra tên đăng nhập không chứa khoảng trắng
        if (strpos($username, ' ') !== false) {
            $response["error"] = "Tên đăng nhập không được chứa khoảng trắng.";
        }

        if (!$response["error"]) {
            // Kiểm tra email đã tồn tại
            $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
            $stmt->execute([$email]);
            $result = $stmt->fetch();
            if ($result) {
                $response["error"] = "Email đã tồn tại.";
            }
        }
        
        if (!$response["error"]) {
            // Kiểm tra tên đăng nhập đã tồn tại
            $stmt = $conn->prepare("SELECT * FROM user WHERE username = ?");
            $stmt->execute([$username]);
            $result = $stmt->fetch();
            if ($result) {
                $response["error"] = "Tên đăng nhập đã tồn tại.";
            }
        }
        
        if (!$response["error"]) { 
            // Kiểm tra tên đăng nhập đã tồn tại
            $stmt = $conn->prepare("SELECT * FROM user WHERE name = ?");
            $stmt->execute([$name]);
            $result = $stmt->fetch();
            if ($result) {
                $response["error"] = "Tên hiển thị đã tồn tại.";
            }
        }
        

        if (!$response["error"]) { 
            // Thực hiện thêm người dùng vào cơ sở dữ liệu
            $stmt = $conn->prepare("INSERT INTO user (username, name, email, password) VALUES (?,?,?,?)");
            $stmt->execute([$username, $name, $email, $password]);


            $response["success"] = "Đăng kí thành công. Vui lòng đăng nhập.";
        }

        $conn = null;
        echo json_encode($response);
        
    }
} catch (PDOException $e) {
    echo "Lỗi kết nối cơ sở dữ liệu: " . $e->getMessage();
}