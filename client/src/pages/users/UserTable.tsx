import type { User } from 'contracts/src/models/user.ts'
import { Table, type TableProps } from 'antd'
import { Link } from 'react-router'

interface DataType {
  key: number
  name: string
  score: number
}

const COLUMNS: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_, user) => <Link to={`/user/${user.key}`}>{user.name}</Link>,
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
