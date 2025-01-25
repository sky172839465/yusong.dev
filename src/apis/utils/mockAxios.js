import MockAdapter from 'axios-mock-adapter'
import { find, flow, get, keys, reduce } from 'lodash-es'

const mockServiceMap = import.meta.glob(['../*.mock.js'], { eager: true })
const mockServicePathMap = flow(
  () => import.meta.glob(['../*.js', '!../*.mock.js'], { eager: true }),
  serviceMap => reduce(serviceMap, (collect, service, filePath) => {
    const endpoint = get(service, 'endpoint')
    const method = get(service, 'method', 'get')
    collect[`${method}_${endpoint}`] = filePath.replace('.js', '.mock.js')
    return collect
  }, {})
)()
const mockServicePathMapKeys = keys(mockServicePathMap)
const getMockResponse = (config) => {
  const { url = '', method } = config
  
  const targetPath = find(mockServicePathMapKeys, key => `${method}_${url.split('?')[0]}`.startsWith(key))
  const mockApiPath = get(mockServicePathMap, [targetPath])
  const mocker = get(mockServiceMap, [mockApiPath, 'default'])
  if (!mocker) {
    return [500, { message: 'mockResponse not found' }]
  }

  return [200, mocker(config)]
}

const getMockAxios = (axiosInstance) => {
  const mockAdapter = new MockAdapter(axiosInstance, { delayResponse: 300 })
  mockAdapter.onAny().reply((config) => getMockResponse(config))
}

export default getMockAxios
