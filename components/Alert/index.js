import Vue from 'vue';
import { Alert } from './Alert';

const AlertCtor = Vue.extend(Alert);

// 单例模式 防止出现多个alert
let instanceCache;
function alert({ title, content }) {
  if (!instanceCache) {
    instanceCache = new AlertCtor({
      propsData: {
        title,
        content,
      },
    }).$mount();
    document.body.prepend(instanceCache.$el);
  } else {
    instanceCache.title = title;
    instanceCache.content = content;
  }
  instanceCache.open();
}

export default {
  install(Vue) {
    Vue.prototype.$alert = alert;
  },
  success(props) {
    return alert({ title: 'success', ...props });
  },
  error(props) {
    return alert({ title: 'error', ...props });
  },
};
