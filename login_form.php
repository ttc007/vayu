<?php
    session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cờ vây online</title>
    <link rel="icon" type="image/x-icon" href="asset/img/anh1.ico">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
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
    </style>
</head>
<body>
    <div id="app">
        <login-component v-if="isLogin"
        :error_message="errorMessage"
        :success_message="successMessage"
        ></login-component>

        <register-component v-if="isRegister"
        :error_message="errorMessage"
        :success_message="successMessage"
        ></register-component>
    </div>
    <script src="asset/js/component/login/loginComponent.js"></script>
    <script type="text/javascript">
        new Vue({
            el: '#app',
            data: {
                errorMessage:null,
                successMessage:null,
                isLogin: true,
                isRegister:false,
                isForgot:false
            },
            methods
        });
    </script>
</body>
</html>
