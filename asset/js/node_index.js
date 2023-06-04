// Kết nối với socket server
// const socket = io('http://localhost:3000');

// Lắng nghe sự kiện 'connect' từ server
// socket.on('connect', () => {
// 	console.log('Đã kết nối với socket server');
// });

// // Gửi dữ liệu lên server
// socket.emit('clientEvent', 'Dữ liệu từ client');

new Vue({
    el: '#app',
    data: {
        errorMessage:null,
        successMessage:null,
        isLogin: true,
        isRegister:false,
        isForgot:false,
        userId:null
    },
    mounted() {
        setTimeout(() => {
            this.errorMessage = null;
        }, 2000);

        // Lắng nghe sự kiện 'loginResponse' từ server và hiển thị dữ liệu nhận được
		socket.on('loginResponse', (data) => {
			console.log('Nhận được dữ liệu từ server:', data);
		});
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