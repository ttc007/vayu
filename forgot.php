<?php
session_start();

require 'vendor/autoload.php';
require 'connectDB.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$email = $_POST["email"];

// Kiểm tra email đã tồn tại
$stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
	$_SESSION["error"] = "Email không tồn tại.";
    header("Location: login_form.php");
    exit();
}

$password = $user['password'];
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
// Cấu hình thông tin email
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';  // Thay thế bằng địa chỉ SMTP của bạn
$mail->SMTPAuth = true;
$mail->Username = 'covayvayugo@gmail.com';  // Thay thế bằng email của bạn
$mail->Password = 'xxmftrortgdsbimq';  // Thay thế bằng mật khẩu của bạn
$mail->SMTPSecure = 'ssl'; // Mã hóa SSL
$mail->Port = 465; // Cổng kết nối SMTP là 465

// Thiết lập thông tin người gửi và email
$mail->setFrom('covayvayugo@gmail.com', 'Cờ vây VayugoVn');  // Thay thế bằng thông tin của bạn
$mail->addAddress($email);

// Thiết lập nội dung email
$mail->isHTML(true);
$mail->Subject = 'Yêu cầu đặt lại mật khẩu';
$mail->Body = 'Mật khẩu của bạn là: ' . $password;

// Gửi email
$mail->send();


$_SESSION["success"] = "Đã gởi mật khẩu. Vui lòng kiểm tra mail.";
header("Location: login_form.php");
exit();