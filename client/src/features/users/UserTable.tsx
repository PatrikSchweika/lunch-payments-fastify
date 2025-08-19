import type { User } from 'contracts'
import { App, Table, type TableProps } from 'antd'
import { Link } from 'react-router'
import { DeleteOutlined } from '@ant-design/icons'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'

interface DataType {
  key: number
  name: string
  score: number
}

const DEFAULT_COLUMNS: TableProps<DataType>['columns'] = [
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
  onDelete?: (userId: number) => void
}

export const UserTable = ({ users, onDelete }: UserTableProps) => {
  const dataSource = users.map(user => ({
    key: user.id,
    name: user.name,
    score: user.score,
  }))

  const { modal } = App.useApp()

  const handleDelete = async (user: DataType) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: `Are you sure you want to archive user ${user.name}?`,
    })

    if (confirmed) {
      onDelete?.(user.key)
    }
  }

  const columns = !onDelete
    ? DEFAULT_COLUMNS
    : [
        ...DEFAULT_COLUMNS,
        {
          title: 'Actions',
          key: 'actions',
          render: (_: unknown, user: DataType) => (
            <DeleteOutlined title="Delete" onClick={() => handleDelete(user)} />
          ),
        },
      ]

  const breakpoints = useBreakpoint()

  return (
    <Table
      size={breakpoints['md'] ? 'large' : 'small'}
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
    />
  )
}
