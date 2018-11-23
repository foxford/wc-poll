import { html, classString as cs } from '@polymer/lit-element'

import { cn } from '../utils'
import css from '../organisms/poll.css'

export const result = (data) => {
  const value = isNaN(data.value * 1e2) ? '' : `${parseFloat(data.value * 1e2).toFixed(1)}%`
  const active = cs({ [css.active]: data.winner })
  const selected = cs({ [css.selected]: data.selected })

  return (html`
    <div class$='${cn(css.text, active, selected)}'>${data.label}</div>
    <div class$='${cn(css.aftertext, active, selected)}'>${value}</div>
  `)
}
