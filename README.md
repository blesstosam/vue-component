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

## Todo 封装的echarts地图等组件

## Todo 一个库用来链式传递路由query参数

## Todo storage 库

## Todo axios 封装的库
1. 增加传参数 如果不需要处理response 只需要判断code是否等于200 来 alert 一些信息
2. cache