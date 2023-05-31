Vue.component('register-component', {
  data() {
    return {
      username: '',
      password: '',
      repassword: '',
      name: '',
      email: '',
      errorMessage: null,
    };
  },
  template: `
    <form class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Đăng kí</h2>

        <div class="error-container">
          <p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
        </div>

        <div class="padding-left">
            <label for="username">Tên đăng nhập</label>
            <input type="text" id="username" name="username" v-model="username"  
                title="Tên đăng nhập từ 6 đến 20 ký tự, chỉ chứa chữ cái và số"><br>

            <label for="password">Mật khẩu</label>
            <input type="password" id="password" name="password" v-model="password" 
                title="Mật khẩu từ 6 đến 20 ký tự"><br>

            <label for="repassword">Xác nhận mật khẩu</label>
            <input type="password" id="repassword" name="repassword" v-model="repassword" 
                 title="Mật khẩu từ 6 đến 20 ký tự"><br>

            <label for="name">Tên hiển thị</label>
            <input type="text" id="name" name="name" v-model="name" 
                title="Tên hiển thị từ 6 đến 20 ký tự, chỉ chứa chữ cái và khoảng trắng"><br>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" v-model="email"  
                title="Email có chứa @ và .com hay gì đó"><br>

            <a class="button" @click="register">Đăng kí</a>
            <a @click="viewLogin" class="back-btn"><img src="asset/img/back-arrow.png" width='20'></a>
        </div>
    </form>
  `,
  methods: {
    viewLogin() {
      this.$emit('view_login');
    },
    registerSucces(success) {
        this.$emit('register_success', success);
    },
    register() {
        setTimeout(() => {
            this.errorMessage = null;
        }, 2000);

        if (!this.validateUsername(this.username)) {
            this.errorMessage = 'Tên đăng nhập từ 6 đến 20 ký tự, chỉ chứa chữ cái và số';
            return;
        }

        if (this.repassword.length < 6 || this.repassword.length > 20) {
            this.errorMessage = 'Mật khẩu phải có từ 6 đến 20 ký tự.';
            return;
        }

        if (this.password !== this.repassword) {
            this.errorMessage = 'Mật khẩu và Xác nhận mật khẩu không khớp.';
            return;
        }

        if (!this.validateName(this.name)) {
            this.errorMessage = 'Tên hiển thị từ 6 đến 20 ký tự tiếng Việt và khoảng trắng, ';
            return;
        }

        if (!this.validateEmail(this.email)) {
            this.errorMessage = 'Email không hợp lệ';
            return;
        }

        const _this = this;
        $.ajax({
            url: "/api/register.php",
            method: 'POST',
            data: {
            username: this.username,
            password: this.password,
            repassword: this.repassword,
            name: this.name,
            email: this.email
            },
            dataType:'json',
            success: function(response) {
                if(response.error) {
                    _this.errorMessage = response.error;
                } else {
                    _this.$emit('register_success', response.success);
                }
            },
        });
    },
    validateUsername(username) {
        const regex = /^[A-Za-z0-9]{6,20}$/;
        return regex.test(username);
    },
    validateName(name) {
        const regex = /^[a-zA-Z\sÀ-Ỹà-ỹĐđ]{6,20}$/;
        return regex.test(name);
    },
    validateEmail(email) {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return regex.test(email);
    },
  }
});
