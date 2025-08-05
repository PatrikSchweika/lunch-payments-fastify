import {useForm} from "react-hook-form";
import {USER_CREATE_SCHEMA, type UserCreate} from "contracts/src/models/user.ts";
import {zodResolver} from "@hookform/resolvers/zod";


interface CreateUserFormProps {
    onSubmit: (data: UserCreate) => void;
}

export const CreateUserForm = ({ onSubmit }: CreateUserFormProps) => {
    const { register, handleSubmit } = useForm<UserCreate>({ resolver: zodResolver(USER_CREATE_SCHEMA) })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name')} type="text" name="name" />
            <button type="submit">Create</button>
        </form>
    )

}
