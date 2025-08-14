import type { User } from 'contracts/src/models/user.ts'
import { Table } from 'antd'

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
]

interface UserTableProps {
  users: User[]
}

export const UserTable = ({ users }: UserTableProps) => {
  const dataSource = users.map(user => ({
    key: user.id,
    name: user.name,
    score: user.score,
  }))

  return (
    <Table
      columns={COLUMNS}
      dataSource={dataSource}
      bordered
      pagination={false}
      style={{ minWidth: '400px' }}
    />
  )
}
