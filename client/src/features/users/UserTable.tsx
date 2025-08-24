import type { User } from 'contracts'
import { Table, type TableProps } from 'antd'
import { Link } from 'react-router'
import { DeleteOutlined } from '@ant-design/icons'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'
import { formatDate } from '../../utils/format.ts'

const DEFAULT_COLUMNS: TableProps<User>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, user) => (
      <Link to={`/users/${user.id}`}>{name}</Link>
    ),
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
  onArchive?: (user: User) => void
  archivedUsers?: boolean
}

const getColumns = (
  onArchive: UserTableProps['onArchive'],
  archivedUsers: UserTableProps['archivedUsers'],
): TableProps<User>['columns'] => {
  const columns = [...DEFAULT_COLUMNS]

  if (archivedUsers) {
    columns.push({
      title: 'Archived at',
      dataIndex: 'archivedAt',
      key: 'archivedAt',
      render: (archivedAt?: string) =>
        archivedAt ? formatDate(archivedAt) : '',
    })
  }

  if (!archivedUsers && onArchive) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, user: User) => (
        <DeleteOutlined title="Archive" onClick={() => onArchive?.(user)} />
      ),
    })
  }

  return columns
}

export const UserTable = ({
  users,
  onArchive,
  archivedUsers,
}: UserTableProps) => {
  const columns = getColumns(onArchive, archivedUsers)

  const breakpoints = useBreakpoint()

  return (
    <Table
      size={breakpoints['md'] ? 'large' : 'small'}
      columns={columns}
      dataSource={users}
      bordered
      rowKey={user => user.id}
      pagination={false}
    />
  )
}
