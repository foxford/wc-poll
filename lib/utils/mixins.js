import compose from 'ramda/es/compose'
import partialRight from 'ramda/es/partialRight'

const apply = argv => argv.map(([mixin, ...v]) => partialRight(mixin, v))

// mixins: Array<Tuple>
export const combineMixins = mixins => compose(...apply(mixins))

export const withPoll = (base, initialConfig = {}) => class extends base {
  constructor (props) {
    super(props)
    Object.keys(initialConfig).map((it) => {
      this[it] = initialConfig[it]

      return it
    })
  }
}
