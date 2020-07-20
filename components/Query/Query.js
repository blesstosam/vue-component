const DELAY_LOADING_TIME = 200;

const Query = {
  name: 'Query',

  props: {
    // if call request automiclly
    autoReq: {
      type: Boolean,
      default: true,
    },
    // type: () => Promise<AjaxResponse>
    request: {
      required: true,
      validator: (p) => typeof p === 'function',
    },
  },

  data() {
    return {
      loading: false,
      delaying: false,
      // type: { code: number; msg: string } | null
      error: null,
      // type: {[k: string]: string } | Array<{ [k: string]: string }> | null
      data: null,
      resolved: false,  // if the promise resolved
    };
  },

  created() {
    if (this.autoReq) {
      this.innerReq();
    }
  },

  computed: {
    showNodata() {
      return this.isNil(this.data) && !this.loading && !this.error && !this.delaying;
    },
    showError() {
      return this.error && !this.loading;
    },
  },

  methods: {
    innerReq() {
      this.resolved = false
      // delay 200ms to show loading
      this.delaying = true;
      this.timer = setTimeout(() => {
        this.loading = true;
        this.delaying = false;
      }, DELAY_LOADING_TIME);
      const response = this.request();
      // if the request is async then use then to recieve the data
      if (Object.prototype.toString.call(response) === '[object Promise]') {
        // todo need use catch to handle error???
        response.then((res) => {
          this.resolved = true
          this.loading = false;
          this.timer && window.clearTimeout(this.timer)
          this.handleResponse(res);
        });
      } else {
        this.resolved = true
        this.loading = false;
        this.timer && window.clearTimeout(this.timer)
        this.handleResponse(response);
      }
    },

    handleResponse(res) {
      if (res.code === 200) {
        this.data = res.data;
      } else {
        this.error = {
          code: res.code,
          msg: res.msg,
        };
      }
    },

    isNil(val) {
      return val === null || val === undefined;
    },

    getDefaultErrorVNode(h) {
      return h('div', [
        h('span', this.error.msg),
        h(
          'span',
          {
            style: { color: '#1890ff', cursor: 'pointer' },
            on: {
              click: this.innerReq,
            },
          },
          '请点击重试！'
        ),
      ]);
    },

    getDefaultNodataVNode(h) {
      return h('div', { style: { color: '#ccc' } }, '暂无数据!');
    },

    getLoadingVNode(h) {
      return h('div', '加载中...');
    },
  },

  render(h) {
    const returnData = {
      data: this.data,
      loading: this.loading,
      error: this.error,
      showNodata: this.showNodata,
      showError: this.showError,
      // expose the inner request fn to parent component
      queryFn: this.innerReq,
    };
    if (this.loading) {
      return this.$scopedSlots.loading
        ? h('div', this.$scopedSlots.loading(returnData))
        : this.getLoadingVNode(h);
    }
    if (this.showError) {
      return this.$scopedSlots.error
        ? this.$scopedSlots.error(returnData)
        : this.getDefaultErrorVNode(h);
    }
    if (this.showNodata) {
      return this.$scopedSlots.nodata
        ? this.$scopedSlots.nodata(returnData)
        : this.getDefaultNodataVNode(h);
    }
    if (this.resolved) {
      return this.$scopedSlots.default
      ? this.$scopedSlots.default(returnData)
      : h('div', JSON.stringify(this.data));
    }
    return h()
  }
};

export default Query;
