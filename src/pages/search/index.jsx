import { Form, FormProvider, useForm, useWatch } from 'react-hook-form'

import { useArticles } from '../../apis/useArticles'

const defaultValues = { title: 'Lazy' }

const Result = () => {
  const { title } = useWatch('title')
  const { isLoading, data } = useArticles(title)

  return (
    <div className='mockup-code grow bg-foreground text-background'>
      <div className='h-full overflow-y-scroll'>
        {isLoading && (
          <pre>
            <code>
              loading frontMatters
            </code>
          </pre>
        )}
        {!isLoading && JSON.stringify(data, null, 2).split('\n').map((row, index) => {
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
  )
}

const Demo = () => {
  const methods = useForm({ defaultValues })

  return (
    <div className='flex h-[calc(100dvh-11rem)] flex-col gap-2'>
      <FormProvider {...methods}>
        <Form>
          <div className='form-control'>
            <input
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full text-slate-900'
              {...methods.register('title')}
            />
          </div>
        </Form>
        <Result />
      </FormProvider>
    </div>
  )
}

export default Demo