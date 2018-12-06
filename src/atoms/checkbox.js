import { html } from '@polymer/lit-element'

import { cn } from '../utils'
import style from '../atoms/checkbox.css'

export const checkbox = ({
  checked,
  children,
  classname,
  label = '',
  name = '',
  value = '',
}) => (html`
  <label class='checkbox root size-medium' for='${label}'>
    <input
      checked$='${checked}'
      class$='${cn('input', classname)}'
      id='${label}'
      name='${name}'
      value='${value}'
      type='checkbox'
    />
    ${(label || children) && html`<span class='label'>${label || children}</span>`}
  </label>
`)

export { style }
