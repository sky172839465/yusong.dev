const fs = require('fs')

const routes = fs.readFileSync('../../src/data/routes.json', { encoding: 'utf-8' })
fs.writeFileSync('./src/routes.json', routes, { encoding: 'utf-8' })
