import { Table, type TableProps, Typography } from 'antd'
import type { User, LunchRecord } from 'contracts'
import { formatDate } from '../../utils/format.ts'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'

interface DataType {
  key: number
  payer: string
  consumers: string
  score: number
  date: string
  description: string

  lunchRecord: LunchRecord
}

const DEFAULT_COLUMNS: TableProps<DataType>['columns'] = [
  {
    title: 'Payer - Consumers',
    key: 'payerAndConsumers',
    responsive: ['xs'],
    render: (_, data) => (
      <Typography>
        {data.payer} - {data.consumers}
      </Typography>
    ),
  },
  {
    title: 'Payer',
    dataIndex: 'payer',
    key: 'payer',
    responsive: ['sm'],
  },
  {
    title: 'Consumers',
    dataIndex: 'consumers',
    key: 'consumers',
    responsive: ['sm'],
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
  onDelete?: (lunchRecordId: LunchRecord) => void
}

export const UserLunchRecordsTable = ({
  user,
  users,
  lunchRecords,
  onDelete,
}: UserLunchRecordsTableProps) => {
  const dataSource = lunchRecords.map(lunchRecord => {
    const payer =
      users.find(user => user.id === lunchRecord.payerId)?.name ?? 'Unknown'

    const consumers = users
      .filter(user => lunchRecord.consumerIds.includes(user.id))
      .map(user => user.name)
      .join(', ')

    return {
      key: lunchRecord.id,
      payer,
      consumers,
      score:
        lunchRecord.payerId === user.id ? lunchRecord.consumerIds.length : -1,
      date: lunchRecord.date,
      description: lunchRecord.description,
      lunchRecord,
    }
  })

  const columns = !onDelete
    ? DEFAULT_COLUMNS
    : [
        ...DEFAULT_COLUMNS,
        {
          title: 'Actions',
          key: 'actions',
          render: (_: unknown, record: DataType) => (
            <DeleteOutlined
              title="Delete"
              onClick={() => onDelete(record.lunchRecord)}
            />
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
