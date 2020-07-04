# vue-component

some vue component written by myself

## Query （受到 Apollo query 组件的启发）

使用方法：

1. 将请求数据的接口作为函数传递进去
2. request 方法可以是异步请求但是要返回 promise，也可以是普通函数直接返回结果。（原理是内部会判断函数调用的结果是否是 primise 对象）

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

    <!-- 在slot里调用queryFn重新发起请求 定制error -->
    <template v-slot:error="{ queryFn , error}">
      <h1>
        <span>Error: {{error}}</span>
        <div @click="queryFn"><button>Retry</button></div>
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
        code: res.code,
        data: res.data,
        msg: res.msg
      }
    }
  }
</script>
```

## Mutation

使用方法：

1. 将 mutation 的接口作为函数传递进去
2. put 方法可以是异步请求但是要返回 promise，也可以是普通函数直接返回结果
3. 如果里面有 query 组件，要放在 slot 里，mutation 成功后会自动调用 query 的 req，重新获取数据

```js
<Mutation :put="put" @on-success="handleSucess" @on-error="handleError">
  <template v-slot:query>
    <Query :request="req">
      <template v-slot:default="{data}">
        <h1>name: {{data.name}}</h1>
      </template>
    </Query>
  </template>
  <template v-slot:action="{mutateFn, loading}">
    <span v-if="loading">modifying...</span>
    <button v-else @click="mutateFn">enter</button>
  </template>
</Mutation>
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
      tabIndex: 0;
    }
  },
};
```

## Line25D 2.5d 效果的折线图

![预览图](https://cdn.u1.huluxia.com/g4/M02/90/86/rBAAdl76lVqABkPfAAQhSmtEXYg877.png)

使用方法：传入元素容器，数据和配置即可，如下

```js
const chartData = {
  title: '图表标题',
  xLabel: 'x轴lable',
  yLabel: 'y轴lable',
  data: {
    datasets: [
      {
        label: '数据1',
        data: [
          { x: '2019-09-18 00:00:00', y: 50 },
          { x: '2019-09-18 01:00:00', y: 88 },
          { x: '2019-09-18 02:00:00', y: 350 },
          { x: '2019-09-18 03:00:00', y: 122 },
          { x: '2019-09-18 04:00:00', y: 212 },
          { x: '2019-09-18 05:00:00', y: 100 },
          { x: '2019-09-18 06:00:00', y: 200 },
          { x: '2019-09-18 07:00:00', y: 88 },
          { x: '2019-09-18 08:00:00', y: 360 },
          { x: '2019-09-18 09:00:00', y: 122 },
          { x: '2019-09-18 10:00:00', y: 212 },
          { x: '2019-09-18 11:00:00', y: 100 },
          { x: '2019-09-18 12:00:00', y: 100 },
          { x: '2019-09-18 13:00:00', y: 88 },
          { x: '2019-09-18 14:00:00', y: 350 },
          { x: '2019-09-18 15:00:00', y: 122 },
          { x: '2019-09-18 16:00:00', y: 212 },
          { x: '2019-09-18 17:00:00', y: 100 },
          { x: '2019-09-18 18:00:00', y: 88 },
          { x: '2019-09-18 19:00:00', y: 350 },
          { x: '2019-09-18 20:00:00', y: 122 },
          { x: '2019-09-18 21:00:00', y: 212 },
          { x: '2019-09-18 22:00:00', y: 100 },
          { x: '2019-09-18 23:00:00', y: 212 },
        ],
      },
      {
        label: '数据2',
        data: [
          { x: '2019-09-18 00:00:00', y: 0 },
          { x: '2019-09-18 01:00:00', y: 88 },
          { x: '2019-09-18 02:00:00', y: 350 },
          { x: '2019-09-18 03:00:00', y: 122 },
          { x: '2019-09-18 04:00:00', y: 212 },
          { x: '2019-09-18 05:00:00', y: 100 },
          { x: '2019-09-18 06:00:00', y: 100 },
          { x: '2019-09-18 07:00:00', y: 88 },
          { x: '2019-09-18 08:00:00', y: 350 },
          { x: '2019-09-18 09:00:00', y: 122 },
          { x: '2019-09-18 10:00:00', y: 212 },
          { x: '2019-09-18 11:00:00', y: 100 },
          { x: '2019-09-18 12:00:00', y: 200 },
          { x: '2019-09-18 13:00:00', y: 88 },
          { x: '2019-09-18 14:00:00', y: 350 },
          { x: '2019-09-18 15:00:00', y: 122 },
          { x: '2019-09-18 16:00:00', y: 212 },
          { x: '2019-09-18 17:00:00', y: 100 },
          { x: '2019-09-18 18:00:00', y: 88 },
          { x: '2019-09-18 19:00:00', y: 350 },
          { x: '2019-09-18 20:00:00', y: 122 },
          { x: '2019-09-18 21:00:00', y: 212 },
          { x: '2019-09-18 22:00:00', y: 100 },
          { x: '2019-09-18 23:00:00', y: 212 },
        ],
      },
    ],
  },
  options: {
    yTickCount: 5,
    timeFormat: 'YYYY/MM/DD HH:mm:ss',
    dotSize: 1.5,
  },
};
new Line25D(document.querySelector('.chart'), chartData);
```

## Todo 封装的 echarts 地图等组件

## Todo 用来链式传递路由 query 参数的组件
