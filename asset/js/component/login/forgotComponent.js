Vue.component('forgot-component', {
  template: `
    <form class="login-form">
        <div class="avatar-container">
          <img src="asset/img/anh1.jpg" alt="Avatar" class="avatar">
        </div>

        <h2 class='title'>Quên mật khẩu</h2>

        <div class="error-container">
          <p class="error-message" v-if="errorMessage">{{errorMessage}}</p>
        </div>

        <?php endif; ?>

        <div class="center">
            <label for="email" style="width:60px;padding-left:55px">Email</label>
            <input type="email" v-model="email" style="width:215px" name="email">

            <a class="button" @click="forgot">Gửi yêu cầu</a>
            <a @click="viewLogin" class="back-btn"><img src="asset/img/back-arrow.png" width='20'></a>
        </div>

        <div v-if="isLoading" class="loading-overlay">
          <div>
            <h3>Chờ chút nhé!</h3>
            <p>Hệ thống đang gởi password đến email của bạn.</p>
          </div>
        </div>

    </form>
  `,
  data() {
    return {
      email: '',
      errorMessage: null,
      isLoading: false,
    };
  },
  methods: {
    viewLogin() {
      this.$emit('view_login');
    },
    forgot() {
      // Hiển thị popup chờ
      this.isLoading = true;

      // Ẩn thông báo lỗi
      this.errorMessage = null;

      if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Email không hợp lệ';
        this.isLoading = false; // Ẩn popup chờ
        return;
      }

      const _this = this;
      $.ajax({
        url: "/api/forgot.php",
        method: 'POST',
        data: {
          email: this.email
        },
        dataType: 'json',
        success: function(response) {
          if (response.success) {
            _this.$emit('register_success', response.success);
          } else {
            _this.errorMessage = response.error;
          }
        },
        complete: function() {
          // Ẩn popup chờ khi request hoàn tất (bao gồm cả thành công và lỗi)
          _this.isLoading = false;
        }
      });
    },
    validateEmail(email) {
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return regex.test(email);
    }
  }
});