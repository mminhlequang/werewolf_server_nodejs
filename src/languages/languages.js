exports.translation = (key, code) => {
  if (!key) return "Key is null!"
  if (!code) code = 'en'
  const language = require(`./_${code}`)
  if (!(key in language.msg))
    return "Key is null!"
  return language.msg[key]
}