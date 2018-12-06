import { html } from '@polymer/lit-element'
import uiCheckbox from '@foxford/ui/es/components/Checkbox/Checkbox.sass'

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
  <label class$='${cn('checkbox', uiCheckbox.root, uiCheckbox['size-medium'])}' for='${label}'>
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
