import { useSessionStorage } from '@react-hooks-library/core'
import { isEmpty } from 'lodash-es'
import { sleep } from 'radash'
import { FormProvider, useForm } from 'react-hook-form'

import { useCreateJsonPlaceholderPost } from '../../apis/createJsonPlaceholderPost'
import { useUpdateJsonPlaceholderPost } from '../../apis/updateJsonPlaceholderPost'
import { MOCK_KEY } from '../../apis/utils/axios'

const defaultValues = {
  apiType: 'post',
  title: 'foo',
  content: 'bar',
  userId: '10'
}

const PostPutApi = () => {
  const [mockValue, setMockValue] = useSessionStorage(MOCK_KEY)
  const { trigger: createPost, data: postData = {} } = useCreateJsonPlaceholderPost()
  const { trigger: updatePost, data: putData = {} } = useUpdateJsonPlaceholderPost({ id: 3 })
  const methods = useForm({ defaultValues })
  const apiType = methods.watch('apiType')
  const isChecked = isEmpty(mockValue) || mockValue === 'true'

  const onChange = async (e) => {
    const isChecked = e.target.checked
    setMockValue(`${isChecked}`)
    await sleep(200)
    window.location.reload()
  }

  const onSubmit = (data) => {
    const { apiType: dataApiType, ...restData } = data
    console.log(data)
    if (dataApiType === 'post') {
      createPost(restData)
      return
    }

    updatePost(restData)
  }

  return (
    <div className='flex h-[calc(100dvh-5rem)] flex-col space-y-2'>
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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className='space-y-2'>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>
                API type
              </span>
            </div>
            <select {...methods.register('apiType')} className='select select-bordered'>
              <option disabled selected>
                Pick one
              </option>
              <option value='post'>
                POST
              </option>
              <option value='put'>
                PUT
              </option>
            </select>
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>
                Title
              </span>
            </div>
            <input {...methods.register('title')} className='input input-bordered w-full max-w-xs' />
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>
                Content
              </span>
            </div>
            <input {...methods.register('content')} className='input input-bordered w-full max-w-xs' />
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>
                UserId
              </span>
            </div>
            <input {...methods.register('userId')} className='input input-bordered w-full max-w-xs' />
          </label>
          <button className='btn' type='submit'>
            Submit
          </button>
        </form>
      </FormProvider>
      <div className='mockup-code grow'>
        <div className='max-h-[50dvh] overflow-y-scroll'>
          {JSON.stringify(apiType === 'post' ? postData : putData, null, 2).split('\n').map((row, index) => {
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

export default PostPutApi
