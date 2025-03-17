import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty, omitBy } from 'lodash-es'
import queryString from 'query-string'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import * as z from 'zod'

import { useTags } from '@/apis/useTags'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useI18N, { LANG } from '@/hooks/useI18N'

// eslint-disable-next-line react-refresh/only-export-components
export const FIELD = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  TAGS: 'tags'
}

const i18nMapping = {
  [LANG.EN]: {
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

const defaultValues = {
  [FIELD.TITLE]: '',
  [FIELD.DESCRIPTION]: '',
  [FIELD.TAGS]: []
}

const getOmitFormValues = (formValues) => {
  return omitBy(formValues, (value) => {
    return isEmpty(value) || (Array.isArray(value) && value.every(isEmpty))
  })
}

const SearchForm = () => {
  const { label } = useI18N(i18nMapping)
  const { isLoading: isTagsLoading, data: tags = [] } = useTags()
  const formSchema = z.object({
    [FIELD.TITLE]: z.string(),
    [FIELD.DESCRIPTION]: z.string(),
    [FIELD.TAGS]: z.array(z.string())
  })
  const [searchParams, SetSearchParams] = useSearchParams()
  const { control, register, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: searchParams.size === 0
      ? defaultValues
      : getOmitFormValues(queryString.parse(searchParams.toString(), { arrayFormat: 'repeat' }))
  })
  const tagsOptions = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])

  const onReset = () => SetSearchParams({})

  const onSubmit = (data) => {
    const newFormValues = getOmitFormValues(data)
    SetSearchParams(newFormValues)
  }

  return (
    <Card className='mx-auto w-full'>
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
          <div className='flex flex-row justify-between'>
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
