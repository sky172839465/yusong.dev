const fs = require('fs')

const svgData = fs.readFileSync('../../public/favicon.svg', { encoding: 'utf-8' })
fs.writeFileSync('./src/favicon.js', `const svg = \`data:image/svg+xml,${svgData}\`.replace(/\\n/g, '')\nexport default svg`, { encoding: 'utf-8' })
