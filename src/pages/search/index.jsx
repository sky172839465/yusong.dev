import { Form, FormProvider, useForm, useWatch } from 'react-hook-form'

import { Input } from '@/components/ui/input'

import { useArticles } from '../../apis/useArticles'

const defaultValues = { title: 'Lazy' }

const Result = () => {
  const { title } = useWatch('title')
  const { isLoading, data } = useArticles(title)

  return (
    <div className='grow rounded-md bg-foreground p-2 text-background'>
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
          <Input
            type='text'
            placeholder='Type here'
            className='w-full'
            {...methods.register('title')}
          />
        </Form>
        <Result />
      </FormProvider>
    </div>
  )
}

export default Demo