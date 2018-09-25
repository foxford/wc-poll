import { html } from '@polymer/lit-element'

import { cn } from '../utils'
import css from '../atoms/checkbox.css'

export const checkbox = ({
  checked,
  children,
  classname,
  label = '',
  name = '',
  value = '',
}) => (html`
  <label class$='${`root size-medium ${css.root}`}' for$='${label}'>
    <input
      checked$='${checked}'
      class$='${cn('input', classname)}'
      id$='${label}'
      name$='${name}'
      value='${value}'
      type='checkbox'
    />
    ${(label || children) && html`<span class='label'>${label || children}</span>`}
  </label>
`)
