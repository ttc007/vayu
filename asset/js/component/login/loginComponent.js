Vue.component('login-component', {
  props: ['error_message', 'success_message'],
  
  template: `
    <form action="login.php" method="post" class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Đăng nhập</h2>
          <div class="error-container">
            <p class="error-message" v-if='error_message'>{{error_message}}</p>
            <p class="success-message" v-if='success_message'>{{success_message}}</p>
          </div>
        <?php endif; ?>
        <div class="padding-left">
            <label for="username">Tên người dùng</label>
            <input type="text" id="username" name="username" required><br>

            <label for="password">Mật khẩu</label>
            <input type="password" id="password" name="password" required><br>

            <label></label><button class="button">Đăng nhập</button>
        </div>

        <div class="form-footer">
            <a @click="viewForgot" class="register-link">Quên mật khẩu?</a> | 
            <a @click="viewRegister" class="register-link">Đăng ký</a>
        </div>
    </form>
  `,
  methods: {
    viewRegister() {
      this.$emit('view_register');
    },
    viewForgot() {
      this.$emit('view_forgot');
    }
  }
});