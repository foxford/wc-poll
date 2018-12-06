import { html } from '@polymer/lit-element'
import uiButton from '@foxford/ui/es/components/Button/Button.sass'

import { cn } from '../utils'
import style from '../atoms/button.css'

const buttonCls = cn(
  'button',
  uiButton.root,
  uiButton.rounded,
  uiButton['fluid-m'],
  uiButton['height-52'],
  uiButton['theme-default'],
  uiButton['width-s'],
)

export const button = ({
  disabled,
  forEl,
  onclick,
  text = '',
}) => (html`
  <button
    disabled='${disabled}'
    class$='${!disabled ? buttonCls : cn(buttonCls, 'disabled', uiButton.disabled)}'
    form$='${forEl}'
    on-click='${onclick}'
  >${text}</button>
`)

export { style }
