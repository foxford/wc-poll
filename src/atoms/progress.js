import { html, classString as cs } from '@polymer/lit-element'
import uiProgress from '@foxford/ui/es/components/Progress/Progress.sass'

import { cn } from '../utils'
import style from '../atoms/progress.css'

export const progress = ({
  active,
  classname,
  children,
  selected,
  width,
}) => (html`
  <div class$='${cn('progress', uiProgress.root, classname, cs({ active, selected }))}'>
    ${children}
    <div class$='${cn('bar', uiProgress.bar)}' style$='width: ${width}%;'></div>
  </div>
`)

export { style }
