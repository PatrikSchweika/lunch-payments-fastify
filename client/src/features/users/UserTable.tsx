import type { User } from 'contracts'
import { App, Table, type TableProps } from 'antd'
import { Link } from 'react-router'
import { DeleteOutlined } from '@ant-design/icons'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'
import { useMemo } from 'react'
import { useIsAdmin } from '../auth/queries.ts'
import { formatDate } from '../../utils/format.ts'

interface DataType {
  key: number
  name: string
  score: number
  archivedAt?: string
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
    archivedAt: user.archivedAt
  }))

  const { modal } = App.useApp()

  const isAdmin = useIsAdmin()

  const handleDelete = async (user: DataType) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: `Are you sure you want to archive user ${user.name}?`,
    })

    if (confirmed) {
      onDelete?.(user.key)
    }
  }

  const columns = useMemo(() => {
    const cols = [...DEFAULT_COLUMNS]

    if (isAdmin) {
      cols.push({
        title: 'Archived at',
        key: 'archivedAt',
        render: (_: unknown, record: DataType) => record.archivedAt ? formatDate(record.archivedAt) : '',
      })
    }

    if (onDelete) {
      cols.push({
        title: 'Actions',
        key: 'actions',
        render: (_: unknown, record: DataType) => (
          !record.archivedAt && <DeleteOutlined onClick={() => handleDelete(record)} />
        ),
      })
    }

    return cols
  }, [onDelete, isAdmin])

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
