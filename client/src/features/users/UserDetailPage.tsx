import { useParams } from 'react-router'
import { useUsers } from './queries.ts'
import {
  useDeleteLunchRecord,
  useUserLunchRecords,
} from '../lunch-records/queries.ts'
import { CenteredSpin } from '../../atoms/CenteredSpin.ts'
import { UserLunchRecordsTable } from './UserLunchRecordsTable.tsx'
import { App, Flex, Typography } from 'antd'
import { useIsAdmin } from '../auth/queries.ts'
import { formatDate } from '../../utils/format.ts'
import type { LunchRecord } from 'contracts'

export const UserDetailPage = () => {
  const { userId } = useParams()

  if (userId == null || isNaN(Number(userId))) {
    return null
  }

  return <UserPageInner userId={Number(userId)} />
}

interface UserPageInnerProps {
  userId: number
}

const UserPageInner = ({ userId }: UserPageInnerProps) => {
  const { modal } = App.useApp()

  const { data: users, isPending } = useUsers('all')
  const { data: userLunchRecords } = useUserLunchRecords(userId)

  const isAdmin = useIsAdmin()
  const { mutate: deleteLunchRecord } = useDeleteLunchRecord()

  const user = users?.find(user => user.id === userId)

  const handleLunchRecordDelete = async (lunchRecord: LunchRecord) => {
    const confirmed = await modal.confirm({
      title: 'Delete confirmation',
      content: (
        <Typography>
          Are you sure you want to delete lunch record{' '}
          <strong>{lunchRecord.description}</strong> on{' '}
          <strong>{formatDate(lunchRecord.date)}</strong>?
        </Typography>
      ),
    })

    if (confirmed) {
      deleteLunchRecord(lunchRecord.id)
    }
  }

  if (!user && !isPending) {
    return <div>User {userId} not found</div>
  }

  return (
    <>
      {isPending && <CenteredSpin size="large" />}
      {user && (
        <Flex vertical>
          <Typography.Title level={3}>
            Lunch records - {user.name}
          </Typography.Title>
          <UserLunchRecordsTable
            user={user}
            lunchRecords={userLunchRecords ?? []}
            users={users ?? []}
            onDelete={isAdmin ? handleLunchRecordDelete : undefined}
          />
        </Flex>
      )}
    </>
  )
}
