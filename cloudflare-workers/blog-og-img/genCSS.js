const fs = require('fs')

const cssStr = fs.readFileSync('src/generated.css', { encoding: 'utf-8' }).replace(/`/g, '\'')
fs.writeFileSync('src/generated.js', `export default \`${cssStr}\``, { encoding: 'utf-8' })
