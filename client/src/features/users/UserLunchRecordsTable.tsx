import { Table, type TableProps } from 'antd'
import type { User } from 'contracts/src/models/user.ts'
import type { LunchRecord } from 'contracts/src/models/lunch-record.ts'
import { formatDate } from '../../utils/format.ts'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface DataType {
  key: number
  payer: string
  consumers: string
  date: string
  description: string
  score: number
}

const DEFAULT_COLUMNS: TableProps<DataType>['columns'] = [
  {
    title: 'Payer',
    dataIndex: 'payer',
    key: 'payer',
  },
  {
    title: 'Consumers',
    dataIndex: 'consumers',
    key: 'consumers',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (_, data) => formatDate(data.date),
    sorter: (a, b) => dayjs(a.date).diff(dayjs(b.date), 'day'),
    defaultSortOrder: 'descend',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    sorter: (a, b) => a.score - b.score,
  },
]

interface UserLunchRecordsTableProps {
  user: User
  lunchRecords: LunchRecord[]
  users: User[]
  onDelete?: (lunchRecordId: LunchRecord['id']) => void
}

export const UserLunchRecordsTable = ({
  user,
  users,
  lunchRecords,
  onDelete,
}: UserLunchRecordsTableProps) => {
  const dataSource = lunchRecords.map(lunchRecord => ({
    key: lunchRecord.id,
    payer:
      users.find(user => user.id === lunchRecord.payerId)?.name ?? 'Unknown',
    consumers: users
      .filter(user => lunchRecord.consumerIds.includes(user.id))
      .map(user => user.name)
      .join(', '),
    score:
      lunchRecord.payerId === user.id ? lunchRecord.consumerIds.length : -1,
    date: lunchRecord.date,
    description: lunchRecord.description,
  }))

  const columns = !onDelete
    ? DEFAULT_COLUMNS
    : [
        ...DEFAULT_COLUMNS,
        {
          title: 'Actions',
          key: 'actions',
          render: (_: unknown, record: DataType) => (
            <DeleteOutlined onClick={() => onDelete(record.key)} />
          ),
        },
      ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      style={{ minWidth: '600px' }}
    />
  )
}
