const Query = {
  name: 'Query',

  props: {
    // if call request automiclly
    autoReq: {
      type: Boolean,
      default: true,
    },
    // () => Promise<{ originalRes: AjaxResponse; data: any }>
    request: {
      required: true,
      validator: (p) => typeof p === 'function',
    },
  },

  data() {
    return {
      loading: false,
      // { code: number; msg: string } | null
      error: null,
      // {[k: string]: string } | Array<{ [k: string]: string }> | null =
      data: null,
    };
  },

  created() {
    if (this.autoReq) {
      this.innnerReq();
    }
  },

  computed: {
    showNodata() {
      return this.isNil(this.data) && !this.loading && !this.error;
    },
    showError() {
      return this.error && !this.loading;
    },
  },

  methods: {
    innnerReq() {
      this.loading = true;
      console.log(this.request);
      this.request().then((res) => {
        this.loading = false;
        if (res.originalRes.code === 200) {
          // this.data can be previous data
          this.data = res.data;
        } else {
          this.error = {
            code: res.originalRes.code,
            msg: res.originalRes.msg,
          };
        }
      });
    },
    retry() {
      this.innnerReq();
      this.$emit('on-retry');
    },
    isNil(val) {
      return val === null || val === undefined;
    },
  },

  render(h) {
    const returnData = {
      data: this.data,
      loading: this.loading,
      error: this.error,
      showNodata: this.showNodata,
      showError: this.showError,
    };
    if (this.loading) {
      return this.$scopedSlots.loading
        ? h('div', this.$scopedSlots.loading(returnData))
        : h('div', '加载中...');
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
    return this.$scopedSlots.default
      ? this.$scopedSlots.default(returnData)
      : h('div', JSON.stringify(this.data));
  },

  getDefaultErrorVNode(h) {
    return h('div', [
      h('span', this.error.msg),
      h(
        'span',
        {
          style: { color: '#1890ff', cursor: 'pointer' },
          on: {
            click: () => {
              this.retry();
            },
          },
        },
        '请点击重试！'
      ),
    ]);
  },

  getDefaultNodataVNode() {
    return h('div', { style: { color: '#ccc' } }, '暂无数据!');
  },
};

export { Query };
