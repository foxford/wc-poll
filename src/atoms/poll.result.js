import { html, classString as cs } from '@polymer/lit-element'

import { cn } from '../utils'

export const result = (data) => {
  const value = isNaN(data.value * 1e2) ? '' : `${parseFloat(data.value * 1e2).toFixed(1)}%`
  const active = cs({ active: data.winner })
  const selected = cs({ selected: data.selected })

  return (html`
    <div class$='${cn('text', active, selected)}'>${data.label}</div>
    <div class$='${cn('aftertext', active, selected)}'>${value}</div>
  `)
}
