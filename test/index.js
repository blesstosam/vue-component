import Vue from 'vue'
import VueRouter from 'vue-router'
import { Query } from '../components/Query/Query'
import { registerAlert } from '../components/Alert/index'
import Recovery from '../components/Recovery/index'

Vue.component('Query', Query)
Vue.use(registerAlert)
Vue.use(Recovery)
Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, 'beforeEach')
  next()
})

var vm = new Vue({
  el: '#app',
  data: {
    recover: {
      name: 'sam',
      age: 18
    }

  },
  mounted() {
    // this.$alert()
  },
  methods: {
    toFoo() {
      this.recover.name = '---'
      this.$router.push('/foo')
      // this.rPush('/foo')
    },
    toBar() {
      this.$router.push('/bar')
      this.recover.age = 2000
      // this.rPush('/bar')
    },
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
  router
});