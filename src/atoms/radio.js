import { html } from '@polymer/lit-element'
import uiRadio from '@foxford/ui/es/components/Radio/Radio.sass'

import { cn } from '../utils'
import style from '../atoms/radio.css'
import { radio as radiosvg, radioChecked as chkradiosvg } from '../images'

export const radio = ({
  checked,
  classname,
  children,
  label = '',
  name = '',
  value = '',
}) => (html`
  <label class$='${cn('radio', uiRadio.root, uiRadio['size-medium'])}' for='${label}'>
    <input
      checked$='${checked}'
      class$='${cn('input', uiRadio.input, classname)}'
      id='${label}'
      name='${name}'
      type='radio'
      value$='${value}'
    />
    ${radiosvg}
    ${chkradiosvg}
    ${(label || children) && html`<span class$='${cn('label', uiRadio.label)}'>${label || children}</span>`}
  </label>
`)

export { style }
