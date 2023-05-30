Vue.component('chat-component', {
  props: ['messages', 'room_id', 'user_name'],
  
  template: `
    <div class="chat">
      <div class="chat-messages">
        <ul>
          <li v-for="message in messagesArr" :key="message.id">
            <span class="message-sender" v-if="message.sender!=user_name">{{ message.sender }}:</span>
            <span class="message-sender" v-if="message.sender==user_name">Bạn:</span>
            <span class="message-content">{{ message.content }}</span>
          </li>
        </ul>
      </div>
      <div class="chat-input">
        <input type="text" v-model="newMessage" @keyup.enter="sendMessage" 
        placeholder="Nhập tin nhắn..." maxlength="50" >
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
  `,
  data() {
    return {
      newMessage: '',
      messagesArr:[]
    };
  },
  mounted() {
    if (this.messages != '') {
      this.messagesArr = JSON.parse(this.messages);
    }
  },
  watch: {
    messages(newVal, oldVal) {
      if (this.messages != '' && newVal != oldVal) {
        this.messagesArr = JSON.parse(this.messages);
      }
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage) {
        var roomId = this.room_id;
        var newMessage = this.newMessage;
        var user_name = this.user_name;
        var message = {'sender': user_name, 'content' : newMessage}
        if (!this.messagesArr) this.messagesArr = [];
        this.messagesArr.push(message);

        // Giới hạn messagesArr chỉ chứa 8 tin nhắn
        if (this.messagesArr.length >= 9) {
          this.messagesArr.shift(); // Xóa tin nhắn đầu tiên
        }
        
        var messages = JSON.stringify(this.messagesArr);
        socket.send(JSON.stringify({action : 'sendMessages', roomId: roomId, messages: messages}));

        // Xóa nội dung tin nhắn sau khi gửi
        this.newMessage = '';
      }
    }
  }
});
