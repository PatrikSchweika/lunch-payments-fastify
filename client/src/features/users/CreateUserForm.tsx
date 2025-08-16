import { useForm } from 'react-hook-form'
import {
  USER_CREATE_SCHEMA,
  type UserCreate,
} from 'contracts/src/models/user.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Typography } from 'antd'
import { FormItem } from 'react-hook-form-antd'

interface CreateUserFormProps {
  onSubmit: (data: UserCreate) => void
}

export const CreateUserForm = ({ onSubmit }: CreateUserFormProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<UserCreate>({
    resolver: zodResolver(USER_CREATE_SCHEMA),
  })

  const onSubmitInner = (data: UserCreate) => {
    onSubmit(data)
    reset()
  }

  return (
    <Form onFinish={handleSubmit(onSubmitInner)}>
      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        Create user
      </Typography.Title>

      <FormItem control={control} name={'name'}>
        <Input placeholder="Name" />
      </FormItem>
      <Form.Item>
        <Button
          type="primary"
          disabled={isSubmitting}
          htmlType="submit"
          style={{ width: '100%' }}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}
