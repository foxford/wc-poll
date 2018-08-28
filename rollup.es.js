import { es } from './rollup.config'

export default ((entry = 'organisms/poll') => entry.split(',').map(es))(process.env.ENTRY)
