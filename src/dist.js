
import pcss from '../es/organisms/poll.css'
import { PollElement, mixins } from '../es/organisms/poll'

export { mixins }

export const Poll = mixins.withStyle(PollElement, pcss)
