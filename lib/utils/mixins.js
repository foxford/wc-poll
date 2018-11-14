import { html } from '@polymer/lit-element'
import { mixins } from '@netology-group/wc-utils'
import compose from 'ramda/es/compose'
import partialRight from 'ramda/es/partialRight'

// it: Array<mixed>
const apply = it => it.map(([mixin, ...v]) => partialRight(mixin, v))

// it: Array<Array<mixed>>
export const combineMixins = it => compose(...apply(it))

export const withPoll = (base, initialConfig = {}) => class extends base {
  constructor (props) {
    super(props)
    Object.keys(initialConfig).map((it) => {
      this[it] = initialConfig[it]

      return it
    })
  }
}

export const withStyle = mixins.withStyle(html)
export const withStyleLink = mixins.withStyleLink(html)
