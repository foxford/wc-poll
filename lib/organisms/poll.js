import { html, LitElement, classString as cs } from '@polymer/lit-element'
import enh from '@fxf/ui/src/enhancers/PadMarg/PadMarg.sass'

import pollImage from '../images/poll.svg'
import { radio } from '../atoms/radio'
import { checkbox } from '../atoms/checkbox'
import { button } from '../atoms/button'
import { progress } from '../atoms/progress'

import { cn } from '../utils'

import css from './poll.css'

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

  _onVariantChange () {
    this.selected = true
  }

  _onPollComplete (e) {
    e.preventDefault()
    const { currentTarget: form } = e
    const fd = new FormData(form)

    const data = this.list.reduce(
      (acc, it) => ~acc[1].indexOf(it.name)
        ? acc
        : fd.get(it.name)
          ? [acc[0].concat(fd.get(it.name)), acc[1].concat(it.name)]
          : acc,
      [[], []]
    )

    if (data[0].length) {
      this.complete = true
      this._aggregateResult(...data)
    }
  }

  _aggregateResult (values, names) {
    this.total = this.total + 1

    names.map((it, i) => {
      const name = it
      const value = values[i]

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
      <div class$=${cn(css.variant, enh['margin-bottom-12'])} on-change=${this._boundVariantChange}>
        ${variantEl(data)}
      </div>
    `
  }

  _renderResult (data) {
    // eslint-disable-next-line no-param-reassign
    data = { ...data, value: data.count / this.total }

    // eslint-disable-next-line no-param-reassign
    data.value = data.weight / 1e2 || data.value

    const _result = (_data, _css) => html`
      <div class$=${cs({ [cn(_css.text)]: true, [_css.active]: data.winner })}>${_data.label}</div>
      <div class$=${cn(_css.aftertext)}>${parseFloat(_data.value * 1e2).toFixed(1)}%</div>
    `

    return progress({
      classname: cn(css.result, enh['margin-bottom-12']),
      children: _result(data, css),
      width: data.value * 1e2,
    })
  }

  _render ({
    text, list = [], selected, users, total,
  }) {
    if (list.length) {
      // calculate most popular answer
      const max = list.reduce((acc, next) => next.count > acc ? next.count : acc, 0)

      // eslint-disable-next-line no-param-reassign
      list = list.map(it => it.count !== max ? it : { ...it, winner: true })
    }

    const _button = button({
      text: this.complete ? `Проголосовало ${total} из ${users.length}` : 'Проголосовать',
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
