import { html } from '@polymer/lit-element'
import * as u from '@netology-group/wc-utils/lib/utils'
import * as _ from '@netology-group/wc-utils'

import { withPoll } from './mixins/with-poll'
import Poll from './organisms/poll'

const mixins = u.bindMixins(html)({
  ..._,
  withPoll,
})

const utils = {
  combineMixins: u.combineMixins,
  registerCustomElement: u.registerCustomElement,
}

export { Poll, utils, mixins }
