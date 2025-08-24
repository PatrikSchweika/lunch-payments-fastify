import { Table, type TableProps, Typography } from 'antd'
import type { User, LunchRecord } from 'contracts'
import { formatDate } from '../../utils/format.ts'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint'

interface DataType {
  payer?: User
  consumers: Array<User>
  score: number

  lunchRecord: LunchRecord
}

const DEFAULT_COLUMNS: TableProps<DataType>['columns'] = [
  {
    title: 'Payer - Consumers',
    key: 'payerAndConsumers',
    responsive: ['xs'],
    render: (_, data) => (
      <Typography>
        {data.payer?.name ?? 'Unknown'} -{' '}
        {data.consumers.map(user => user.name).join(', ')}
      </Typography>
    ),
  },
  {
    title: 'Payer',
    dataIndex: 'payer',
    key: 'payer',
    responsive: ['sm'],
    render: (payer?: User) => payer?.name ?? 'Unknown',
  },
  {
    title: 'Consumers',
    dataIndex: 'consumers',
    key: 'consumers',
    responsive: ['sm'],
    render: (consumers: User[]) => consumers.map(user => user.name).join(', '),
  },
  {
    title: 'Description',
    dataIndex: ['lunchRecord', 'description'],
    key: 'description',
  },
  {
    title: 'Date',
    dataIndex: ['lunchRecord', 'date'],
    key: 'date',
    render: (date: string) => formatDate(date),
    sorter: (a, b) =>
      dayjs(a.lunchRecord.date).diff(dayjs(b.lunchRecord.date), 'day'),
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
  users: User[]
  lunchRecords: LunchRecord[]
  onDelete?: (lunchRecordId: LunchRecord) => void
}

const getColumns = (onDelete: UserLunchRecordsTableProps['onDelete']) => {
  const columns = [...DEFAULT_COLUMNS]

  if (onDelete) {
    columns.push({
      title: 'Actions',
      dataIndex: 'lunchRecord',
      key: 'actions',
      render: (lunchRecord: LunchRecord) => (
        <DeleteOutlined title="Delete" onClick={() => onDelete(lunchRecord)} />
      ),
    })
  }

  return columns
}

const getDataSource = (
  user: User,
  users: User[],
  lunchRecords: LunchRecord[],
) => {
  return lunchRecords.map(lunchRecord => {
    const payer = users.find(user => user.id === lunchRecord.payerId)

    const consumers = users.filter(user =>
      lunchRecord.consumerIds.includes(user.id),
    )

    const score =
      lunchRecord.payerId === user.id ? lunchRecord.consumerIds.length : -1

    return {
      payer,
      consumers,
      score,
      lunchRecord,
    }
  })
}

export const UserLunchRecordsTable = ({
  user,
  users,
  lunchRecords,
  onDelete,
}: UserLunchRecordsTableProps) => {
  const dataSource = getDataSource(user, users, lunchRecords)

  const columns = getColumns(onDelete)

  const breakpoints = useBreakpoint()

  return (
    <Table
      size={breakpoints['md'] ? 'large' : 'small'}
      columns={columns}
      dataSource={dataSource}
      bordered
      rowKey={record => record.lunchRecord.id}
      pagination={false}
    />
  )
}
