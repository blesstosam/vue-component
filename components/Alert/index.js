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
    document.body.appendChild(instanceCache.$el);
  } else {
    instanceCache.title = title;
    instanceCache.content = content;
  }
  instanceCache.open()
}

export function registerAlert() {
  Vue.prototype.$alert = alert;
}
