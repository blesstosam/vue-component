import Vue from 'vue';
import VueRouter from 'vue-router';
import Query from '../components/Query/Query';
import Mutation from '../components/Mutation/Mutation';
import Alert from '../components/Alert/index';
import Recovery from '../components/Recovery/index';

Vue.component('Query', Query);
Vue.component('Mutation', Mutation);
Vue.use(Alert);
Vue.use(VueRouter);
Vue.use(Recovery);

const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
  ],
});

router.beforeEach((to, from, next) => {
  // console.log(to, 'beforeEach');
  next();
});

var vm = new Vue({
  el: '#app',
  data: {
    recover: {
      name: 'sam',
      age: 18,
    },
  },
  mounted() {
    // this.$alert()
  },
  methods: {
    toFoo() {
      this.recover.name = '---';
      this.$router.push('/foo');
      // this.rPush('/foo')
    },
    toBar() {
      this.$router.push('/bar');
      this.recover.age = 2000;
      // this.rPush('/bar')
    },
    showAlert() {
      this.$alert({ title: '警告', content: '你好' });
      setTimeout(() => {
        Alert.error({ content: '你好1' });
      }, 1000);
    },

    req() {
      return this.getUser();
    },

    put() {
      return new Promise((resolve) => {
        var res = { code: 200, msg: 'ok', data: { name: 'blesstosam' } };
        setTimeout(() => {
          resolve(res);
        }, 1000);
      });
    },

    handleSucess(msg) {
      alert(msg);
    },
    handleError(msg) {
      alert(msg);
    },

    getUser() {
      return new Promise((resolve, reject) => {
        var res = { code: 200, msg: '1', data: { name: 'sam' } };
        setTimeout(() => {
          resolve(res);
          // reject({error: 'lll'})
        }, 500);
      });
    },
  },

  router,
});
