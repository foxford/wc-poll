import { html } from '@polymer/lit-element'

export const group = ({
  children,
  onsubmit,
}) => (html`
  <div class='group'>
    <form on-submit='${onsubmit}'>
      ${children}
    </form>
  </div>
`)
