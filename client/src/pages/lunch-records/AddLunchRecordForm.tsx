import { Controller, useForm } from 'react-hook-form'
import {
  LUNCH_RECORD_CREATE_SCHEMA,
  type LunchRecordCreate,
} from 'contracts/src/models/lunch-record.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from 'contracts/src/models/user.ts'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Transfer,
  Typography,
} from 'antd'
import { FormItem } from 'react-hook-form-antd'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'

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
    formState: { errors },
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
      users.map(user => ({
        value: user.id,
        label: user.name,
      })),
    [users],
  )

  // const consumerOptions = useMemo(
  //   () => payerOptions.filter(option => option.value !== payerId),
  //   [payerOptions, payerId],
  // )

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
              value={field.value ? dayjs(field.value) : null}
              onChange={date => field.onChange(date.toISOString())}
              disabledDate={date => date.isAfter(dayjs())}
              disabled={field.disabled}
              onBlur={field.onBlur}
              allowClear={false}
            />
          )}
        ></Controller>
      </Form.Item>

      <FormItem control={control} name={'description'}>
        <Input placeholder="Description" />
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
              optionFilterProp={'label'}
              value={
                field.value
                  ? {
                      value: field.value,
                      label: users.find(user => user.id === field.value)?.name,
                    }
                  : null
              }
              labelInValue
              options={payerOptions}
              disabled={field.disabled}
              onBlur={field.onBlur}
              onSelect={user => field.onChange(user.value)}
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
          render={({ field }) => (
            // <Select
            //     showSearch
            //     placeholder="Consumers"
            //     optionFilterProp={"label"}
            //     mode={"multiple"}
            //     value={field.value.map(consumerId => ({ value: consumerId, label: consumerOptions.find(option => option.value === consumerId)?.label }))}
            //     labelInValue
            //     options={consumerOptions}
            //     disabled={field.disabled}
            //     onBlur={field.onBlur}
            //     onSelect={(user) => field.onChange(user.value)}
            // />
            <Transfer
              listStyle={{ minHeight: '400px' }}
              showSearch
              oneWay
              dataSource={users.filter(user => user.id !== payerId)}
              filterOption={(input, user) =>
                user.name.toLowerCase().includes(input.toLowerCase())
              }
              rowKey={user => user.id}
              targetKeys={field.value}
              disabled={field.disabled}
              onChange={values => field.onChange(values)}
              render={user => user.name}
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}
