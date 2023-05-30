<?php
    session_start();
    $register_data = isset($_SESSION["register_data"]) ? $_SESSION["register_data"] : [];
    unset($_SESSION["register_data"]);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cờ vây online</title>
    <link rel="icon" type="image/x-icon" href="asset/img/anh1.ico">
    <style type="text/css">
        .login-form input {
          margin-bottom: 10px;
          padding: 5px;
          width: 200px;
        }

        form {
          width: 400px;
          margin: 0 auto;
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          padding: 20px;
          margin-top: 150px;
          border-radius: 5px;
          position: relative;
        }

        label {
          font-weight: bold;
          font-size: 1em;
          text-align: left;
          width:140px;
          display:block;
          float:left;
        }

        .title {
            text-align: center;
            margin-bottom:25px;
            margin-top:10px;
        }

        .button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            display: block;
            margin: 5px auto;
            border: none;
            border-radius: 5px;
        }

        .avatar-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 2px solid #ddd;
        }

        .form-footer {
            text-align: center;
            margin-top: 30px;
        }
        .padding-left {
            padding-left:20px;
        }

        a {
          text-decoration: none;
        }

        .register-link {
            position: absolute;
            top:15px;
            left: 15px;
            background: #ddd;
            padding: 4px 7px;
            border-radius: 5px;
        }

        .error-message {
            color: red;
            background-color: #ffe6e6;
            padding: 10px;
            border: 1px solid #ff9999;
            border-radius: 5px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <form action="register.php" method="post" class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Đăng kí</h2>

        <?php if (isset($_SESSION["error"])) : ?>
            <p class="error-message"><?php echo $_SESSION["error"]; ?></p>
            <?php unset($_SESSION["error"]); ?>
        <?php endif; ?>
        <div class="padding-left">
            <label for="username">Tên đăng nhập</label>
            <input type="text" id="username" name="username" required maxlength='30' 
                value="<?php echo isset($register_data['username']) ? $register_data['username'] : ''; ?>"><br>
            
            <label for="password">Mật khẩu</label>
            <input type="password" id="password" name="password" required minlength="6"><br>

            <label for="repassword">Xác nhận mật khẩu</label>
            <input type="password" id="repassword" name="repassword" required minlength="6"><br>

            <label for="name">Tên hiển thị</label>
            <input type="text" id="name" name="name" required maxlength='20'
                value="<?php echo isset($register_data['name']) ? $register_data['name'] : ''; ?>"><br>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required
                value="<?php echo isset($register_data['email']) ? $register_data['email'] : ''; ?>"><br>

            <button class="button">Đăng kí</button>
            <a href="login_form.php" class="register-link"><img src="asset/img/back-arrow.png" width='20'></a>
        </div>
    </form>
</body>
</html>
