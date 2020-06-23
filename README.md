# vue-component

some vue component written by myself

## Query （受到 Apollo query 组件的启发）

使用方法：只需要将请求数据的接口作为函数传递进去

```js
<template>
  <Query :request="req">
    <!-- 定制loading -->
    <template v-slot:loading>
      <div>loading...</div>
    </template>

    <!-- 定制无数据 -->
    <template v-slot:nodata>
      <h1>no data</h1>
    </template>

    <!-- 在slot里调用retryFn重新发起请求 定制error -->
    <template v-slot:error="{ retryFn , error}">
      <h1>
        <span>Error: {{error}}</span>
        <div @click="retryFn"><button>Retry</button></div>
      </h1>
    </template>

    <!-- 数据展示 -->
    <template v-slot:default="{data}">
      <h1>name: {{data.name}}</h1>
    </template>
  </Query>
</template>

<script>
  export default {
    async req() {
      const res = await getUser()
      return {
        originalRes: res,
        data: res.data
      }
    }
  }
</script>
```

## Spacer

使用方法：在外层元素为 display:flex，内部使用 spacer，可以将 spacer 右边的元素顶到最右边

```html
<template>
  <div style="display: flex>
    <div>left</div>
    <Spacer />
    <!-- 将right顶到最右边 -->
    <div>right</div>
  </div>
</template>
```

## Recovery.js 路由返回的时候保持页面的状态不改变

使用方法：将需要复原的数据放在 recover 对象里

```js
import Recovery from 'recovery';
// useQuery 为true 表示使用$route.query来保存数据
Vue.use(Recovery, { useQuery: true });

export default {
  data() {
    // 将需要复原的数据放在recover里
    recover: {
      tabIndex: 0
    }
  },
};
```

## Todo 封装的 echarts 地图等组件

## Todo 用来链式传递路由 query 参数的组件

## Todo storage 库

## Todo axios 封装的库

1. 增加传参数 如果不需要处理 response 只需要判断 code 是否等于 200 来 alert 一些信息
2. cache
