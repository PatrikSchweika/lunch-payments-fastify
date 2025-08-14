import { useUsers } from './queries.ts'
import { UserTable } from './UserTable.tsx'
import { AddLunchRecordForm } from '../lunch-records/AddLunchRecordForm.tsx'
import { App } from 'antd'

export const UserPage = () => {
  const { data } = useUsers()
  const { message } = App.useApp()

  return (
    <>
      <UserTable users={data ?? []} />
      <AddLunchRecordForm
        users={data ?? []}
        onSubmit={data => message.success(JSON.stringify(data))}
      />
    </>
  )
}
