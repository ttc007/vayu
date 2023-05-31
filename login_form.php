<?php
    session_start();
    $error = null;
    if (isset($_SESSION["error"])) {
        $error = $_SESSION["error"];
        unset($_SESSION["error"]);
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cờ vây online</title>
    <link rel="icon" type="image/x-icon" href="asset/img/anh1.ico">

    <meta property="og:title" content="Vayu Game - Trải nghiệm cờ vây online độc đáo">
    <meta property="og:description" content="Vayu Game mang đến cho bạn trò chơi cờ vây trực tuyến độc đáo và hấp dẫn. Thử thách bản thân với các nước cờ chiến thuật, rèn luyện trí tuệ và thể hiện khả năng tư duy chiến lược của bạn. Hãy tham gia ngay để trở thành nhà vô địch cờ vây!">
    <meta property="og:image" content="asset/img/room_playing.png">
    <meta property="og:url" content="http://vayugovn.com">
    
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
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
            cursor:pointer;
            width:120px;
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
        .error-container {
            position:absolute;
            top: 140px;
            left:0px;
            width:100%;
        }
        .error-message {
            color: red;
            background-color: #ffe6e6;
            padding: 10px;
            border: 1px solid #ff9999;
            border-radius: 5px;
            margin-bottom: 10px;
            transition: opacity 1s ease-in-out;
            opacity: 1;
            text-align:center;
            margin: 0 auto;
            width: 85%;
        }

        .back-btn {
            position: absolute;
            top:15px;
            left: 15px;
            background: #ddd;
            padding: 4px 7px;
            border-radius: 5px;
            cursor: pointer;
        }

        .register-link {
            color: blue;
            cursor: pointer;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          /* Thêm các thuộc tính CSS khác để tạo hiệu ứng phù hợp */
        }

        .loading-overlay div {
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 30px 10px;
          border-radius: 5px;
          text-align:center;
        }
    </style>
</head>
<body>
    <div id="app">
        <input type="hidden" id="errorMessage" value="<?php echo $error; ?>">
        <login-component v-if="isLogin"
            :error_message="errorMessage"
            :success_message="successMessage"
            @view_register="viewRegister"
            @view_forgot="viewForgot"
        ></login-component>

        <register-component v-if="isRegister"
            @view_login="viewLogin"
            @register_success="registerSuccess"
        ></register-component>

        <forgot-component v-if="isForgot"
            @view_login="viewLogin"
            @register_success="registerSuccess"
        ></forgot-component>
    </div>
    <script src="asset/js/component/login/loginComponent_.js"></script>
    <script src="asset/js/component/login/registerComponent_.js"></script>
    <script src="asset/js/component/login/forgotComponent_.js"></script>
    <script type="text/javascript">
        const errorMessage = $("#errorMessage").val();
        new Vue({
            el: '#app',
            data: {
                errorMessage:errorMessage,
                successMessage:null,
                isLogin: true,
                isRegister:false,
                isForgot:false
            },
            mounted() {
                setTimeout(() => {
                    this.errorMessage = null;
                }, 2000);
            },
            methods: {
                viewRegister() {
                    this.isRegister = true;
                    this.isLogin = false;
                    this.forgit = false;
                },
                viewLogin() {
                    this.isLogin = true;
                    this.isRegister = false;
                    this.isForgot = false;
                },
                viewForgot() {
                    this.isLogin = false;
                    this.isRegister = false;
                    this.isForgot = true;
                },
                registerSuccess(successMessage) {
                    this.viewLogin();
                    this.successMessage = successMessage;

                    setTimeout(() => {
                        this.successMessage = null;
                    }, 5000);
                }
            }
        });
    </script>
</body>
</html>
