<?php
    session_start();
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
          width: 430px;
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
          width:60px;
          display:block;
          float:left;
          padding-top: 12px;
          padding-left: 10px;
        }

        .title {
            text-align: center;
            margin-bottom:25px;
            margin-top:15px;
        }

        .button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            margin: 5px auto;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .avatar-container {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
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
        .center {
            padding:20px 10px;
        }

        a {
          text-decoration: none;
        }

        .success-message {
            color: green;
            font-weight: bold;
            display: flex;
            align-items: center;
            padding-left: 22px;
        }

        .success-message::before {
            content: "\2714";
            margin-right: 5px;
        }

        .error-message {
            color: red;
            background-color: #ffe6e6;
            padding: 10px;
            border: 1px solid #ff9999;
            border-radius: 5px;
            margin-bottom: 10px;
        }

        .register-link {
            position: absolute;
            top:15px;
            left: 15px;
            background: #ddd;
            padding: 4px 7px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <form action="forgot.php" method="post" class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Quên mật khẩu</h2>

        <?php if (isset($_SESSION["error"])) : ?>
            <p class="error-message"><?php echo $_SESSION["error"]; ?></p>
            <?php unset($_SESSION["error"]); ?>
        <?php endif; ?>

        <div class="center">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>

            <button class="button">Gửi yêu cầu</button>
            <a href="login_form.php" class="register-link"><img src="asset/img/back-arrow.png" width='20'></a>
        </div>
    </form>
</body>
</html>
