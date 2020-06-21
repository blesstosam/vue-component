const Alert = {
  name: 'Alert',

  props: {
    title: {
      type: String,
      defalut: '',
    },
    content: {
      type: String,
      defalut: '',
    },
    showIcon: {
      type: Boolean,
      defalut: false,
    },
  },

  data() {
    return {
      show: false,
    };
  },

  methods: {
    _close() {
      this.show = false;
    },
    open() {
      this.show = true;
    },
  },

  render(h) {
    if (!this.show) return null;
    return h(
      'div',
      {
        style: {
          color: 'rgba(197,48,48,1)',
          position: 'relative',
          padding: '.75rem 1rem',
          border: '1px solid rgba(252,129,129,1)',
          borderRadius: '0.25rem',
          backgroundColor: 'rgba(255,245,245,1)',
        },
      },
      [
        h('strong', this.title),
        h('span', this.content),
        h(
          'span',
          {
            style: {
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              padding: '.75rem 1rem',
            },
            on: {
              click: this._close,
            },
          },
          [
            h(
              'svg',
              {
                style: {
                  width: '1.5rem',
                  height: '1.5rem',
                  color: 'rgba(245,101,101,1)',
                  fill: 'currentColor',
                  cursor: 'pointer'
                },
                attrs: {
                  xmlns: 'http://www.w3.org/2000/svg',
                  viewBox: '0 0 20 20',
                },
              },
              [
                h('path', {
                  attrs: {
                    d:
                      'M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z',
                  },
                }),
              ]
            ),
          ]
        ),
      ]
    );
  },
};

export { Alert };
