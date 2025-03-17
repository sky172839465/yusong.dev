import { preloadRoutes } from '@/apis/useRoutes'
import { preloadTags } from '@/apis/useTags'

const searchLoader = () => {
  const tags = preloadTags()
  const routes = preloadRoutes(null, {})
  return {
    tags,
    routes
  }
}

export default searchLoader
