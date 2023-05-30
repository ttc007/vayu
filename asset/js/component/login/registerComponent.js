Vue.component('register-component', {
  props: ['error_message'],
  
  template: `
    <form action="register.php" method="post" class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Đăng kí</h2>

            <p class="error-message">{{error_message}}</p>
        <div class="padding-left">
            <label for="username">Tên đăng nhập</label>
            <input type="text" id="username" name="username" required maxlength='30' minlength="6"><br>
            
            <label for="password">Mật khẩu</label>
            <input type="password" id="password" name="password" required minlength="6"><br>

            <label for="repassword">Xác nhận mật khẩu</label>
            <input type="password" id="repassword" name="repassword" required minlength="6"><br>

            <label for="name">Tên hiển thị</label>
            <input type="text" id="name" name="name" required maxlength='20' minlength="6"><br>

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required><br>

            <button class="button">Đăng kí</button>
            <a href="login_form.php" class="register-link"><img src="asset/img/back-arrow.png" width='20'></a>
        </div>
    </form>
  `,
  methods: {
    
  }
});