export default function install(Vue, opt = { useQuery: true }) {
  // Array<Recovery>
  // when do not useQuery=false use recoveryArr to store recover data
  let recoveryArr = []
  Vue.mixin({
    created() {
      // root vue
      // avoid the component init by Vue.extend =>
      // Object.getPrototypeOf(this).constructor === Vue
      if (this.$root === this && Object.getPrototypeOf(this).constructor === Vue) {
        if (!this.$router) {
          throw new Error('You need use vue-router first!')
        }

        let _self = this
        let proto = Object.getPrototypeOf(this.$router)
        const originalPush = proto.push

        // override push method
        proto.push = function (...args) {
          if (process.env.NODE_ENV === 'development') {
            console.info('Recovery Plugin - push: ', args.toString())
          }

          if (!_self.$data.recover) {
            return originalPush.apply(this, args)
          }

          if (_self.$data.recover) {
            // use query when refresh page can recover data
            if (opt.useQuery) {
              const _q = Object.assign({}, _self.$data.recover)

              // to void redundant navigation to current location
              _q.timestamp = new Date().getTime()

              return _self.$router.replace({ path: _self.$route.path, query: _q }).then(() => {
                originalPush.apply(this, args)
              })
            } else {
              // when refresh page data lose
              const _p = Object.assign({}, _self.$data.recover)
              recoveryArr.push(_p)
              return originalPush.apply(this, args)
            }
          }
        }
      }
    },
    beforeMount() {
      //recover copy url query values;
      if (this.$data.recover) {
        let _v = this.$data.recover

        let _q = opt.useQuery ? this.$route.query : recoveryArr.length ? recoveryArr.pop() : {}

        Object.keys(_v).forEach(function (_k) {
          if (_q[_k] && _v[_k] != undefined) {
            var _t = _q[_k]
            switch (_q[_k]) {
              case 'true':
                _t = Boolean(1)
                break
              case 'false':
                _t = Boolean(0)
                break
              default:
                if (!isNaN(_q[_k])) {
                  _t = Number(_q[_k])
                }
                break
            }
            _v[_k] = _t
          }
        })
      }
    },
  })
}
