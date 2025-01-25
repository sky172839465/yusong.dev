import { useSessionStorage } from '@react-hooks-library/core'
import { isEmpty } from 'lodash-es'
import { sleep } from 'radash'

import { useJsonPlaceholderUser } from '../../apis/fetchJsonPlaceholderUser'
import { MOCK_KEY } from '../../apis/utils/axios'

const GetApi = () => {
  const [mockValue, setMockValue] = useSessionStorage(MOCK_KEY)
  const { data = {} } = useJsonPlaceholderUser({ mockValue })
  const isChecked = isEmpty(mockValue) || mockValue === 'true'

  const onChange = async (e) => {
    const isChecked = e.target.checked
    setMockValue(`${isChecked}`)
    await sleep(200)
    window.location.reload()
  }

  return (
    <div className='flex h-[calc(100dvh-5rem)] flex-col'>
      <div className='form-control'>
        <label className='label cursor-pointer justify-start'>
          <input
            type='checkbox'
            checked={isChecked}
            className='checkbox'
            onChange={onChange}
          />
          <span className='label-text pl-2'>
            Use mock api
          </span>
        </label>
      </div>
      <div className='mockup-code grow'>
        <div className='h-full overflow-y-scroll'>
          {JSON.stringify(data, null, 2).split('\n').map((row, index) => {
            return (
              <pre key={index}>
                <code>
                  {row}
                </code>
              </pre>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GetApi
