import { dist } from './rollup.config'

export default ((entry = 'organisms/poll') => entry.split(',').map(it => dist(it)))(process.env.ENTRY)
