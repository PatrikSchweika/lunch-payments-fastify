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
    render: (_, user) => <Link to={`/users/${user.key}`}>{user.name}</Link>,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    sorter: (a, b) => a.score - b.score,
    defaultSortOrder: 'descend',
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
