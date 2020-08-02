const Mutation = {
  name: 'Mutation',

  props: {
    // type: () => Promise<AjaxResponse>
    put: {
      required: true,
      validator: (p) => typeof p === 'function',
    },
  },

  data() {
    return {
      loading: false,
      // type: { code: number; msg: string } | null
      error: null,
    };
  },

  computed: {
    showError() {
      return this.error && !this.loading;
    },
  },

  methods: {
    innerPut() {
      this.loading = true;
      const response = this.put();
      // if the response is promise then use then to recieve data
      if (Object.prototype.toString.call(response) === '[object Promise]') {
        response
          .then((res) => {
            this.loading = false;
            this.handleResponse(res);
          })
          .catch((err) => {
            this.error = err;
            this.$emit('on-error', this.error.msg || JSON.stringify(this.error));
            console.error(`Request in Mutation component error: ${JSON.stringify(err)}`)
          });
      } else {
        this.loading = false;
        this.handleResponse(response);
      }
    },

    handleResponse(res) {
      if (res.code === 200) {
        this.$emit('on-success', res.msg);
        // if has query component slot request data again
        this.$children.forEach((component) => {
          if (component.$options.name === 'Query' && component.innerReq) {
            component.innerReq();
          }
        });
      } else {
        this.error = {
          code: res.code,
          msg: res.msg,
        };
        this.$emit('on-error', this.error.msg);
      }
    },

    getDefaultErrorVNode(h) {
      return h('div', [
        h('span', this.error.msg),
        h(
          'span',
          {
            style: { color: '#1890ff', cursor: 'pointer' },
            on: {
              click: this.innerPut,
            },
          },
          '请点击重试！'
        ),
      ]);
    },
  },

  render(h) {
    const acceptsSlot = ['query', 'action'];
    const returnData = {
      loading: this.loading,
      error: this.error,
      showError: this.showError,
      // expose the inner request fn to parent component
      mutateFn: this.innerPut,
    };

    if (this.showError) {
      return this.$scopedSlots.error
        ? this.$scopedSlots.error(returnData)
        : this.getDefaultErrorVNode(h);
    }
    // render all slot by order
    return h(
      'div',
      Object.keys(this.$scopedSlots)
        .filter((key) => acceptsSlot.indexOf(key) > -1)
        .map((key) => {
          return this.$scopedSlots[key](returnData);
        })
    );
  },
};

export default Mutation;
