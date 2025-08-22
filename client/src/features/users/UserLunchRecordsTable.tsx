import { App, Table, type TableProps, Typography } from 'antd'
import type { User, LunchRecord } from 'contracts'
import { formatDate } from '../../utils/format.ts'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'

interface DataType {
  key: number
  payer: string
  consumers: string
  date: string
  archivedAt?: string
  description: string
  score: number
}

const DEFAULT_COLUMNS: TableProps<DataType>['columns'] = [
  {
    title: 'Payer - Consumers',
    key: 'payerAndConsumers',
    responsive: ['xs'],
    render: (_, data) => (
      <Typography>{data.payer} - {data.consumers}</Typography>
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
  onDelete?: (lunchRecordId: LunchRecord['id']) => void
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
    }
  })

  const { modal } = App.useApp()

  const handleDelete = async (lunchRecord: DataType) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: (
        <Typography>
          Are you sure you want to delete lunch record{' '}
          <strong>{lunchRecord.description}</strong> on{' '}
          {formatDate(lunchRecord.date)}?
        </Typography>
      ),
    })

    if (confirmed) {
      onDelete?.(lunchRecord.key)
    }
  }

  const columns = !onDelete
    ? DEFAULT_COLUMNS
    : [
        ...DEFAULT_COLUMNS,
        {
          title: 'Actions',
          key: 'actions',
          render: (_: unknown, record: DataType) => (
            !record.archivedAt && <DeleteOutlined onClick={() => handleDelete(record)} />
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
