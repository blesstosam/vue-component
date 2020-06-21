import Vue from 'vue'
import { Query } from './components/Query/Query'
import { registerAlert } from './components/Alert/index'

Vue.component('Query', Query)
Vue.use(registerAlert)

var vm = new Vue({
  el: '#app',
  data: {
    msg: '---',
  },
  mounted() {
    // this.$alert()
  },
  methods: {
    showAlert() {
      this.$alert({title: '警告', content: '你好'})
      // setTimeout(() => {
      //   this.$alert({title: '警告1', content: '你好1'})
      // }, 1000)
    },

    req() {
      return this.getUser();
    },

    getUser() {
      return new Promise((resolve) => {
        var res = { code: 2100, msg: '1', data: { name: '1' } };
        setTimeout(() => {
          resolve({
            originalRes: res,
            data: res.data,
          });
        }, 1000);
      });
    },
  },
});