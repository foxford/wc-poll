import { html } from '@polymer/lit-element'

import ui from '@foxford/ui/es/components/Button/Button.sass'

import { cn } from '../utils'

import css from './button.css'

const buttonCls = cn(
  css.root,
  ui.root,
  ui.rounded,
  ui['fluid-m'],
  ui['height-52'],
  ui['theme-default'],
  ui['width-s'],
)

export const button = ({
  disabled,
  forEl,
  onclick,
  text = '',
}) => html`
  <button
    disabled=${disabled}
    class$=${!disabled ? buttonCls : cn(buttonCls, ui.disabled, css.disabled)}
    form=${forEl}
    on-click=${onclick}
  >${text}</button>
`
