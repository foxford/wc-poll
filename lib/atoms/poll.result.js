import { html, classString as cs } from '@polymer/lit-element'

import { cn } from '../utils'
import css from '../organisms/poll.css'

export const result = (data) => {
  const value = isNaN(data.value * 1e2) ? '' : `${parseFloat(data.value * 1e2).toFixed(1)}%`

  return html`
    <div class$=${cs({ [cn(css.text)]: true, [css.active]: data.winner })}>${data.label}</div>
    <div class$=${cn(css.aftertext)}>${value}</div>
  `
}
