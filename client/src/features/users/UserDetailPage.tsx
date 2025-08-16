import { useParams } from 'react-router'
import { useUsers } from './queries.ts'
import {
  useDeleteLunchRecord,
  useUserLunchRecords,
} from '../lunch-records/queries.ts'
import { CenteredSpin } from '../../atoms/CenteredSpin.ts'
import { useMemo } from 'react'
import { UserLunchRecordsTable } from './UserLunchRecordsTable.tsx'
import { Flex, Typography } from 'antd'
import { useIsAdmin } from '../auth/queries.ts'

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
  const { data: users, isPending } = useUsers()
  const { data: userLunchRecords } = useUserLunchRecords(userId)

  const isAdmin = useIsAdmin()
  const { mutate: deleteLunchRecord } = useDeleteLunchRecord()

  const user = useMemo(() => {
    if (!users) {
      return null
    }

    return users.find(user => user.id === userId)
  }, [users, userId])

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
            onDelete={isAdmin ? deleteLunchRecord : undefined}
          />
        </Flex>
      )}
    </>
  )
}
