import { html } from '@polymer/lit-element'
import uiSeparator from '@foxford/ui/es/components/Separator/Separator.sass'

import { cn } from '../utils'
import style from '../atoms/separator.css'

const cls = classname => cn(
  classname,
  'separator',
  uiSeparator.root,
  uiSeparator['weight-1']
)

export const separator = (props = {}) => (html`
  <div class$='${cls(props.classname)}'></div>
`)

export { style }
