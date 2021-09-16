const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  const name = key.replace('.plugin', '').replace(/(\.\/|\.js)/g, '')
  modules[name] = files(key).default
})

export default modules
