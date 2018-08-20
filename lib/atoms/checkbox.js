import { html } from '@polymer/lit-element'

import { cn } from '../utils'

export const checkbox = ({
  classname,
  children,
  name = '',
  label = '',
  checked,
}) => html`
    <label class="root size-medium" for$=${label}>
      <input
        checked$=${checked}
        class$=${cn('input', classname)}
        id$=${label}
        name$=${name}
        type="checkbox"
      />
      ${(label || children) && html`<span class="label">${label || children}</span>`}
    </label>
  `
