import { html } from '@polymer/lit-element'
import uiButton from '@foxford/ui/es/components/Button/Button.sass'
import uiPadMarg from '@foxford/ui/es/enhancers/PadMarg/PadMarg.sass'

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
  <div class$='${uiPadMarg['margin-top-12']}'>
    <button
      disabled='${disabled}'
      class$='${!disabled ? buttonCls : cn(buttonCls, 'disabled', uiButton.disabled)}'
      form$='${forEl}'
      on-click='${onclick}'
    >${text}</button>
  </div>
`)

export { style }
