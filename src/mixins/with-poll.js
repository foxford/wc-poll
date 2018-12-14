export const withPoll = function withPoll () {
  return (base, initialConfig = {}) => class extends base {
    constructor (props) {
      super(props)
      Object.keys(initialConfig).map((it) => {
        this[it] = initialConfig[it]

        return it
      })
    }
  }
}
