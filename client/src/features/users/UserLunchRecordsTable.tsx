import { Table, type TableProps } from 'antd'
import type { User } from 'contracts/src/models/user.ts'
import type { LunchRecord } from 'contracts/src/models/lunch-record.ts'
import { formatDate } from '../../utils/format.ts'

interface DataType {
  payer: string
  consumers: string
  date: string
  description: string
  score: number
}

const COLUMNS: TableProps<DataType>['columns'] = [
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
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
]

interface UserLunchRecordsTableProps {
  user: User
  lunchRecords: LunchRecord[]
  users: User[]
}

export const UserLunchRecordsTable = ({
  user,
  users,
  lunchRecords,
}: UserLunchRecordsTableProps) => {
  const dataSource = lunchRecords.map(lunchRecord => ({
    payer:
      users.find(user => user.id === lunchRecord.payerId)?.name ?? 'Unknown',
    consumers: users
      .filter(user => lunchRecord.consumerIds.includes(user.id))
      .map(user => user.name)
      .join(', '),
    score:
      lunchRecord.payerId === user.id ? lunchRecord.consumerIds.length : -1,
    date: formatDate(lunchRecord.date),
    description: lunchRecord.description,
  }))

  return (
    <Table
      columns={COLUMNS}
      dataSource={dataSource}
      bordered
      pagination={false}
      style={{ minWidth: '600px' }}
    />
  )
}
