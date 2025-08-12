import { useForm } from 'react-hook-form'
import {
  LUNCH_RECORD_CREATE_SCHEMA,
  type LunchRecordCreate,
} from 'contracts/src/models/lunch-record.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from 'contracts/src/models/user.ts'
import { AutoComplete, Button, DatePicker, Form, Input, Transfer } from 'antd'
import { FormItem } from 'react-hook-form-antd'
import type { TransferKey } from 'antd/es/transfer/interface'

interface AddLunchRecordFormProps {
  users: User[]
  onSubmit: (data: LunchRecordCreate) => void
}

export const AddLunchRecordForm = ({
  users,
  onSubmit,
}: AddLunchRecordFormProps) => {
  const { handleSubmit, control, watch, setValue } = useForm<LunchRecordCreate>(
    {
      resolver: zodResolver(LUNCH_RECORD_CREATE_SCHEMA),
    },
  )

  const payerId = watch('payerId')
  const consumerIds = watch('consumerIds')

  const payer = users.find(user => user.id === payerId)

  const handleChangeConsumers = (targetKeys: TransferKey[]) => {
    const consumerIds = targetKeys.map(key => key as number)
    setValue('consumerIds', consumerIds)
  }

  const handleSelectPayer = (user: User) => {
    setValue('payerId', user.id)
  }

  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      <FormItem control={control} name={'date'}>
        <DatePicker placeholder="Date" />
      </FormItem>
      <FormItem control={control} name={'description'}>
        <Input placeholder="Description" />
      </FormItem>

      <Form.Item>
        <AutoComplete
          placeholder="Payer"
          value={payer}
          options={users}
          optionRender={user => user.data.name}
          onSelect={handleSelectPayer}
          // onChange={(val, option) => console.log(option)}
          filterOption={(inputValue, user) =>
            user != null &&
            user.name.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Form.Item>

      <Transfer
        dataSource={users}
        showSearch
        filterOption={(input, user) =>
          user.name.toLowerCase().includes(input.toLowerCase())
        }
        rowKey={user => user.id}
        targetKeys={consumerIds}
        oneWay
        onChange={handleChangeConsumers}
        render={user => user.name}
      />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}
