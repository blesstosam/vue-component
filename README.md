# vue-component
some vue component written by myself


## Query （受到 Apollo query 组件的启发）
使用方法 只需要将请求数据的接口作为函数传递进去
```js
<template>
<Query :request="req">
  <template v-slot:loading="{ loading }">
    <span v-if="loading">loading...</span>
  </template>
  <template v-slot:default="{ data }">
    <div>
      {{data}}
    </div>
  </template>
</Query>
</template>

<script>
  export default {
    async req() {
      const res = await getList()
      return {
        originalRes: res,
        data: res.data
      }
    }
  }
</script>
```

## Spacer 用法参考 Vuetify 的 Spacer