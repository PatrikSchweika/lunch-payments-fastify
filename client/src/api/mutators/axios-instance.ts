import Axios, {type AxiosError, type AxiosRequestConfig} from 'axios';
import {API_CLIENT} from "../../setup/api-client.ts";

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = API_CLIENT({ ...config, cancelToken: source.token }).then(
        ({ data }) => data,
    );

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
    };

    return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;