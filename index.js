import Vue from 'vue'
import { Query } from './components/Query/Query'

Vue.component('Query', Query)

var vm = new Vue({
  el: '#app',
  data: {
    msg: '1',
  },
  methods: {
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