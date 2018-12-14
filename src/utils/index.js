export const cn = (...argv) => argv.join(' ').trim()

export const getAll = formdata => (predicate) => {
  let i = 0
  const result = []

  formdata.forEach((v, k) => {
    if (typeof predicate === 'function') {
      result.push(predicate(v, k, i++))
    } else if (k === predicate) {
      result.push(v)
    }
  })

  return result
}
