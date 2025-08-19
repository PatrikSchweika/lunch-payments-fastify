import { Controller, useForm } from 'react-hook-form'
import {
  LUNCH_RECORD_CREATE_SCHEMA,
  type LunchRecordCreate,
  type User,
} from 'contracts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, DatePicker, Form, Input, Select, Typography } from 'antd'
import { FormItem } from 'react-hook-form-antd'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { DATE_FORMAT } from '../../utils/format.ts'

interface AddLunchRecordFormProps {
  users: User[]
  onSubmit: (data: LunchRecordCreate) => void
}

export const AddLunchRecordForm = ({
  users,
  onSubmit,
}: AddLunchRecordFormProps) => {
  'use no memo'

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LunchRecordCreate>({
    resolver: zodResolver(LUNCH_RECORD_CREATE_SCHEMA),
    defaultValues: {
      date: dayjs().toISOString(),
      consumerIds: [],
    },
  })

  const onSubmitInner = useCallback(
    (data: LunchRecordCreate) => {
      onSubmit(data)
      reset()
    },
    [onSubmit, reset],
  )

  const payerId = watch('payerId')

  const payerOptions = useMemo(
    () =>
      users
        .map(user => ({
          value: user.id,
          label: user.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [users],
  )

  const consumerOptions = useMemo(
    () => payerOptions.filter(option => option.value !== payerId),
    [payerOptions, payerId],
  )

  return (
    <Form onFinish={handleSubmit(onSubmitInner)}>
      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        Add Lunch Record
      </Typography.Title>
      <Form.Item
        validateStatus={errors.date && 'error'}
        help={errors.date?.message}
      >
        <Controller
          control={control}
          name={'date'}
          render={({ field }) => (
            <DatePicker
              placeholder="Date"
              style={{ width: '100%' }}
              allowClear={false}
              format={DATE_FORMAT}
              value={field.value ? dayjs(field.value) : null}
              onChange={date => field.onChange(date.toISOString())}
              disabledDate={date => date.isAfter(dayjs())}
              disabled={field.disabled}
              onBlur={field.onBlur}
            />
          )}
        />
      </Form.Item>

      <FormItem control={control} name={'description'}>
        <Input.TextArea placeholder="Description" autoSize />
      </FormItem>

      <Form.Item
        validateStatus={errors.payerId && 'error'}
        help={errors.payerId?.message}
      >
        <Controller
          control={control}
          name={'payerId'}
          render={({ field }) => (
            <Select
              showSearch
              placeholder="Payer"
              optionFilterProp="label"
              value={field.value}
              options={payerOptions}
              disabled={field.disabled}
              onBlur={field.onBlur}
              onSelect={user => field.onChange(user)}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        validateStatus={errors.consumerIds && 'error'}
        help={errors.consumerIds?.message}
      >
        <Controller
          control={control}
          name={'consumerIds'}
          disabled={payerId == null}
          render={({ field }) => (
            <Select
              showSearch
              allowClear
              placeholder="Consumers"
              optionFilterProp="label"
              mode="multiple"
              value={field.value}
              options={consumerOptions}
              disabled={field.disabled}
              onBlur={field.onBlur}
              onChange={consumerIds => field.onChange(consumerIds)}
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}
