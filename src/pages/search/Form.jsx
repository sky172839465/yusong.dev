import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import * as z from 'zod'

import { useTags } from '@/apis/useTags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useI18N, { LANG } from '@/hooks/useI18N'
import useOmitQueryStringObject from '@/hooks/useOmitQueryStringObject'
import getOmitObject from '@/utils/getOmitObject'

import { DEFAULT_VALUES, FIELD } from './constants'
import getConvertedDefaultValues from './getConvertedDefaultValues'

const i18nMapping = {
  [LANG.EN]: {
    SEARCH_TITLE: 'Search page',
    SEARCH_DESCRIPTION: 'Search all site by Title, Description and Tags',
    [FIELD.TITLE]: 'Title',
    [FIELD.DESCRIPTION]: 'Description',
    [FIELD.TAGS]: 'Tags',
    ENTER_PLACEHOLDER: 'Enter',
    SELECT_PLACEHOLDER: 'Select',
    SEARCH_PLACEHOLDER: 'Search',
    RESET: 'Reset',
    SUBMIT: 'Submit',
    NOT_TAGS_FOUND: 'No results found.'
  },
  [LANG.ZH_TW]: {
    SEARCH_TITLE: '查詢頁',
    SEARCH_DESCRIPTION: '根據標題、描述或標籤查詢整個網站',
    [FIELD.TITLE]: '標題',
    [FIELD.DESCRIPTION]: '描述',
    [FIELD.TAGS]: '標籤',
    ENTER_PLACEHOLDER: '輸入',
    SELECT_PLACEHOLDER: '選擇',
    SEARCH_PLACEHOLDER: '查詢',
    RESET: '重置',
    SUBMIT: '送出',
    NOT_TAGS_FOUND: '查無資料。'
  }
}

const SearchForm = () => {
  const { label } = useI18N(i18nMapping)
  const { isLoading: isTagsLoading, data: tags = [] } = useTags()
  const formSchema = z.object({
    [FIELD.TITLE]: z.string(),
    [FIELD.DESCRIPTION]: z.string(),
    [FIELD.TAGS]: z.array(z.string())
  })
  const [, SetSearchParams] = useSearchParams()
  const qsObj = useOmitQueryStringObject()
  const { control, register, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: getConvertedDefaultValues(qsObj)
  })
  const tagsOptions = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])

  const onReset = () => {
    reset(DEFAULT_VALUES)
    SetSearchParams({})
  }

  const onSubmit = (data) => {
    const newFormValues = getOmitObject(data)
    SetSearchParams(newFormValues)
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>
          {label.SEARCH_TITLE}
        </CardTitle>
        <CardDescription>
          {label.SEARCH_DESCRIPTION}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
          <div>
            <Label htmlFor={FIELD.TITLE}>
              {label[FIELD.TITLE]}
            </Label>
            <Input
              id={FIELD.TITLE}
              placeholder={`${label.ENTER_PLACEHOLDER} ${label[FIELD.TITLE]}`}
              {...register(FIELD.TITLE, { required: true })}
            />
          </div>

          <div>
            <Label htmlFor={FIELD.DESCRIPTION}>
              {label[FIELD.DESCRIPTION]}
            </Label>
            <Input
              id={FIELD.DESCRIPTION}
              placeholder={`${label.ENTER_PLACEHOLDER} ${label[FIELD.DESCRIPTION]}`}
              {...register(FIELD.DESCRIPTION, { required: true })}
            />
          </div>

          <div>
            <Label>
              {label[FIELD.TAGS]}
            </Label>
            <Controller
              control={control}
              name={FIELD.TAGS}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' className='w-full justify-start' disabled={isTagsLoading}>
                      {field.value.length > 0 ? field.value.join(', ') : `${label.SELECT_PLACEHOLDER} ${label[FIELD.TAGS]}...`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-2'>
                    <Command>
                      <CommandInput placeholder={`${label.SEARCH_PLACEHOLDER} ${label[FIELD.TAGS]}`} />
                      <CommandList>
                        <CommandEmpty>
                          {label.NOT_TAGS_FOUND}
                        </CommandEmpty>
                        {tagsOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              const newValue = field.value.includes(option.value)
                                ? field.value.filter((v) => v !== option.value)
                                : [...field.value, option.value]
                              field.onChange(newValue)
                            }}
                          >
                            <Checkbox
                              checked={field.value.includes(option.value)}
                              className='mr-2'
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div className='mt-2 flex flex-row justify-between'>
            <Button type='button' onClick={onReset}>
              {label.RESET}
            </Button>
            <Button type='submit'>
              {label.SUBMIT}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SearchForm
