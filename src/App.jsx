

import Router from './components/Router'
import getRoutes from './components/Router/getRoutes'

const pages = import.meta.glob('./**/pages/**/index.jsx')
const loaders = import.meta.glob('./**/pages/**/index.loader.js')
const layouts = import.meta.glob('./**/pages/**/index.layout.jsx')
const posts = import.meta.glob(['./**/pages/**/*.md', '!./**/pages/**/*.draft.md'])
const dynamicRoutes = getRoutes(pages, loaders, layouts, posts, true)

function App() {
  return (
    <Router
      routes={dynamicRoutes}
      isAuthRoutes={false}
      isRootRoutes
    />
  )
}

export default App
