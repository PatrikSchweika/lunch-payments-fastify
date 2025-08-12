import { useForm } from 'react-hook-form'
import {
  USER_CREATE_SCHEMA,
  type UserCreate,
} from 'contracts/src/models/user.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input } from 'antd'
import { FormItem } from 'react-hook-form-antd'

interface CreateUserFormProps {
  onSubmit: (data: UserCreate) => void
}

export const CreateUserForm = ({ onSubmit }: CreateUserFormProps) => {
  const { handleSubmit, control } = useForm<UserCreate>({
    resolver: zodResolver(USER_CREATE_SCHEMA),
  })

  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      <FormItem control={control} name={'name'}>
        <Input />
      </FormItem>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}
