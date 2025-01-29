const fs = require('fs')

const svgData = fs.readFileSync('./src/favicon.svg', { encoding: 'utf-8' })
fs.writeFileSync('./src/favicon.js', `const svg = \`data:image/svg+xml,${svgData}\`\nexport default svg`, { encoding: 'utf-8' })
