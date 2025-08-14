import {useParams} from "react-router";
import {useUsers} from "./queries.ts";
import {useUserLunchRecords} from "../lunch-records/queries.ts";
import {CenteredSpin} from "../../atoms/CenteredSpin.ts";
import {useMemo} from "react";

export const UserPage = () => {
    const { userId } = useParams()

    if (userId == null || isNaN(Number(userId))) {
        return null
    }

    return (
        <UserPageInner userId={Number(userId)} />
    )
}

interface UserPageInnerProps {
    userId: number
}

const UserPageInner = ({ userId }: UserPageInnerProps) => {
    const { data: users, isPending } = useUsers()
    const { data: userLunchRecords } = useUserLunchRecords(userId)

    console.log(users)

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
            { isPending && <CenteredSpin size="large" /> }
            { user && <div>User {user.name}</div> }
        </>



    )
}