import { html, classString as cs } from '@polymer/lit-element'
import ui from '@foxford/ui/es/components/Progress/Progress.sass'

import { cn } from '../utils'
import css from '../atoms/progress.css'

export const progress = ({
  active,
  classname,
  children,
  selected,
  width,
}) => (html`
  <div class$='${cn(css.root, ui.root, classname, cs({ [css.active]: active, [css.selected]: selected }))}'>
    ${children}
    <div class$='${cn(css.bar, ui.bar)}' style='width: ${width}%;'></div>
  </div>
`)

