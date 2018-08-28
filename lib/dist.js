
import pcss from '../es/poll.css'
import { PollElement, mixins } from '../es/poll'

export { mixins }

export const Poll = mixins.withStyle(PollElement, pcss)
