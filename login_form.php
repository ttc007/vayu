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
    <meta property="og:image" content="http://vayugovn.com/asset/img/room_playing.png">
    <meta property="og:url" content="http://vayugovn.com">

    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="asset/css/login.css">
    
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
    <script src="asset/js/component/login/loginComponent.js"></script>
    <script src="asset/js/component/login/registerComponent.js"></script>
    <script src="asset/js/component/login/forgotComponent.js"></script>
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
