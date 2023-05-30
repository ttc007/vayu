Vue.component('popup-component', {
  props: [
      'title', 'message'
    ],
  template: `
    <div class="popup">
      <div class="popup-content">
        <h2 class="title">{{title}}</h2>
        <p>{{message}}</p>
        <div class="btn-container">
          <button class="btn-ok" @click="okClick">Đồng ý</button>
          <button class="btn-close" @click="closePopup">Đóng</button>
        </div>
      </div>
    </div>
  `,
  methods: {
    okClick() {
      this.$emit('ok_click');
    },
    closePopup() {
      this.$emit('close_popup');
    }
  }
});