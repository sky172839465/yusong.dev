import axios from 'axios'
import { isEmpty } from 'lodash-es'
import { tryit } from 'radash'

export const MOCK_KEY = 'IS_MOCK'

const axiosInstance = axios.create({
  validateStatus: status => status < 500
})
const mockAxios = async () => {
  const mockValue = window.sessionStorage.getItem(MOCK_KEY)
  const isMock = isEmpty(mockValue) || mockValue.includes('true')
  if (!isMock) {
    return
  }

  const { default: getMockAxios } = await import('./mockAxios.js')
  getMockAxios(axiosInstance)
}

const getCustomAxios = () => async (config) => {
  await mockAxios()
  const [error, response] = await tryit(axiosInstance)(config)
  if (error) {
    console.log(error.toJSON())
    throw error
  }

  return response.data
}

export default getCustomAxios
