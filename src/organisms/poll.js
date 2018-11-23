import { html, LitElement } from '@polymer/lit-element'
import enh from '@foxford/ui/es/enhancers/PadMarg/PadMarg.sass'

import { button } from '../atoms/button'
import { checkbox } from '../atoms/checkbox'
import { cn, getAll as _getAll } from '../utils'
import { progress } from '../atoms/progress'
import { radio } from '../atoms/radio'
import pollImage from '../images/poll.svg'

import { group } from '../atoms/poll.group'
import { result } from '../atoms/poll.result'

import * as mixins from '../utils/mixins'

import css from './poll.css'

export { mixins }

export class PollElement extends LitElement {
  static get properties () {
    return {
      complete: Boolean,
      list: Array,
      multiple: Boolean,
      text: String,
      users: Array,
      total: Number,
      selected: Boolean,
    }
  }

  constructor (props) {
    super(props)

    this.users = []
    this.selected = false
    this.list = []
    this.result = {
      total: 0,
      list: [],
    }

    this._boundVariantChange = this._onVariantChange.bind(this)
    this._boundRenderVariant = this._renderVariant.bind(this)
    this._boundRenderResult = this._renderResult.bind(this)
    this._boundPollComplete = this._onPollComplete.bind(this)
  }

  _queryElement (selector) {
    return this.shadowRoot ? this.shadowRoot.querySelector(selector) : undefined
  }

  __processFormData (fd) {
    const getAll = _getAll(fd)

    return this.list.reduce(
      (acc, it) => ~acc[1].indexOf(it.name)
        ? acc
        : fd.get(it.name)
          ? [acc[0].concat(getAll(it.name)), acc[1].concat(it.name)]
          : acc,
      [[], []]
    )
  }

  _onVariantChange () {
    this.selected = true

    const form = this._queryElement('form')
    const data = this.__processFormData(new FormData(form))

    this.dispatchEvent(new CustomEvent('poll-variant-change', { detail: { data } }))
  }

  _onPollComplete (e) {
    e.preventDefault()

    const { currentTarget: form } = e
    const data = this.__processFormData(new FormData(form))

    if (data[0].length) {
      this.complete = true
      this._aggregateResult(...data)
    }
  }

  _aggregateResult (values, names) {
    this.total = this.total + values.length

    values.map((it) => {
      const value = it
      const name = names[0]

      this.list = this.list.map((that) => {
        const exist = that.value === value && that.name === name

        // eslint-disable-next-line object-curly-newline
        return !exist ? that : { ...that, count: that.count + 1, selected: true }
      })

      return it
    })

    this.dispatchEvent(new CustomEvent('poll-result-aggregate', { detail: { result: this.result } }))
  }

  _renderVariant (data) {
    const variantEl = this.multiple ? checkbox : radio

    return html`
      <div class$=${cn(enh['margin-bottom-12'])} on-change=${this._boundVariantChange}>
        ${variantEl(data)}
      </div>
    `
  }

  _renderResult (data) {
    // eslint-disable-next-line no-param-reassign
    data = { ...data, value: data.count / this.total }

    // eslint-disable-next-line no-param-reassign
    data.value = data.weight / 1e2 || data.value

    return progress({
      active: data.winner,
      children: result(data),
      classname: cn(enh['margin-bottom-12']),
      selected: data.selected,
      width: data.value * 1e2,
    })
  }

  _render ({
    children, text, list = [], selected, users = [], total,
  }) {
    if (list.length) {
      // calculate most popular answer
      const max = list.reduce((acc, next) => next.count > acc ? next.count : acc, 0)

      // eslint-disable-next-line no-param-reassign
      list = list.map(it => it.count !== max ? it : { ...it, winner: true })
    }

    const _button = button({
      text: this.complete ? `Ответило ${total} из ${users.length}` : 'Ответить',
      disabled: !this.complete ? !selected : true,
    })

    const poll = !this.complete
      ? group({
        onsubmit: this._boundPollComplete,
        children: [list.map(this._boundRenderVariant), _button],
      })
      : group({
        children: [list.map(this._boundRenderResult), _button],
      })

    return html`
      <div class$=${css.root}>
        <img class$=${css.image} src$=${pollImage} />
        <section class$=${css.content}>
          <div class$=${css.question}>${text}</div>
          ${poll}
        </section>
        ${children}
      </div>
    `
  }
}
