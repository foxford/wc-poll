import { html, LitElement, classString as cs } from '@polymer/lit-element'
import enh from '@fxf/ui/src/enhancers/PadMarg/PadMarg.sass'

import pollImage from '../images/poll.svg'
import { radio } from '../atoms/radio'
import { checkbox } from '../atoms/checkbox'
import { button } from '../atoms/button'
import { progress } from '../atoms/progress'

import { cn } from '../utils'

import css from './poll.css'

const _getAll = formdata => (predicate) => {
  let i = 0
  const result = []

  formdata.forEach((v, k) => {
    if (typeof predicate === 'function') {
      result.push(predicate(v, k, i++))
    } else if (k === predicate) {
      result.push(v)
    }
  })

  return result
}

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
      edit: Boolean,
      permissions: String,
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

    values.map((it, i) => {
      const value = it
      const name = names[0]

      this.list = this.list.map((that) => {
        const exist = that.value === value && that.name === name

        return !exist ? that : { ...that, count: that.count + 1 }
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

    const _result = (_data, _css) => {
      const value = isNaN(_data.value * 1e2) ? '' : `${parseFloat(_data.value * 1e2).toFixed(1)}%`

      return html`
        <div class$=${cs({ [cn(_css.text)]: true, [_css.active]: data.winner })}>${_data.label}</div>
        <div class$=${cn(_css.aftertext)}>${value}</div>
      `
    }

    return progress({
      classname: cn(enh['margin-bottom-12']),
      children: _result(data, css),
      width: data.value * 1e2,
    })
  }

  _renderActions () {
    return undefined
  }

  _render ({
    text, list = [], selected, users = [], total,
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
      ? html`
      <div class$=${css.group}>
        <form on-submit=${this._boundPollComplete}>
          ${list.map(this._boundRenderVariant)}
          ${_button}
        </form>
      </div>
    `
      : html`
      <div class$=${css.group}>
        ${list.map(this._boundRenderResult)}
        ${_button}
      </div>
    `

    return html`
      <div class$=${css.root}>
        <img class$=${css.image} src$=${pollImage} />
        <section class$=${css.content}>
          <div class$=${css.question}>${text}</div>
          ${poll}
        </section>
        ${this._renderActions()}
      </div>
    `
  }
}

export const Poll = PollElement

// TODO: should move lit-element to common chunk.
// included separately does not work correct for mixins
export const withStyleLink = (base, link) => class extends base {
  __renderStyleLink () {
    return html`<link href$="${link}" rel="stylesheet" type="text/css" />`
  }

  _render (props) {
    return html`
    ${this.__renderStyleLink()}
    ${super._render(props)}
  `
  }
}

export const _withStyle = (_html = html) => (base, ...styles) => class extends base {
  _renderStyles (...argv) { // eslint-disable-line class-methods-use-this
    return _html`<style>${argv.join(' ')}</style>`
  }

  _render (props) {
    return _html`
      ${this._renderStyles(...styles)}
      ${super._render(props)}
    `
  }
}
