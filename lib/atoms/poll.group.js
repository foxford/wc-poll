import { html } from '@polymer/lit-element'

import css from '../organisms/poll.css'

export const group = ({
  children,
  onsubmit,
}) => html`
  <div class$=${css.group}>
    <form on-submit=${onsubmit}>
      ${children}
    </form>
  </div>
`
