import {useCallback, useEffect, useRef, useState} from "react";
import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import type {CreateResumeUploadResponse} from "../../types/resumeUploads";

interface UseAxiosReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    get: (config?: AxiosRequestConfig) => Promise<void>;
    getById: (id: string, config?: AxiosRequestConfig) => Promise<any | undefined>;
    create: (body: any, config?: AxiosRequestConfig) => Promise<any | undefined>;
    update: (id: number | string, body: any, config?: AxiosRequestConfig) => Promise<void>;
    remove: (id: number | string, config?: AxiosRequestConfig) => Promise<void>;
    refetch: () => Promise<void>;
}

export function useAxiosCrud<T = any>(
    url: string,
    autoFetch: boolean = true,
    config: AxiosRequestConfig = {}
): UseAxiosReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<string | null>(null);

    // keep stable references to url/config
    const urlRef = useRef(url);
    const configRef = useRef(config);

    // GET
    const get = useCallback(
        async (extraConfig: AxiosRequestConfig = {}) => {
            setLoading(true);
            setError(null);

            try {
                const response: AxiosResponse<T> = await axios.get(urlRef.current, {
                    ...configRef.current,
                    ...extraConfig,
                });
                setData(response.data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
        [] // ✅ stable, won't cause infinite loop
    );
    // GET By ID
    const getById = useCallback(
        async (id: string, config: AxiosRequestConfig = {}): Promise<any | null> => {
            setLoading(true);
            setError(null);
            console.log('`${urlRef.current}/${id}`', `${urlRef.current}/${id}`)

            try {
                const response: AxiosResponse<T> = await axios.get(`${urlRef.current}/${id}`, {
                    ...configRef.current,
                    ...config,
                });
                setData(response.data);
                return response.data
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
        [] // ✅ stable, won't cause infinite loop
    );

    // CREATE (POST)
    const create = useCallback(
        async (body: any, extraConfig: AxiosRequestConfig = {}): Promise<CreateResumeUploadResponse | undefined> => {
            try {
                const response = await axios.post(urlRef.current, body, {...configRef.current, ...extraConfig});
                if (autoFetch) {
                    await get();
                }
                return response.data
            } catch (err: any) {
                setError(err.message || "Create failed");
            }
        },
        [get]
    );

    // UPDATE (PUT)
    const update = useCallback(
        async (id: number | string, body: any, extraConfig: AxiosRequestConfig = {}) => {
            try {
                await axios.put(`${urlRef.current}/${id}`, body, {...configRef.current, ...extraConfig});
                get();
            } catch (err: any) {
                setError(err.message || "Update failed");
            }
        },
        [get]
    );

    // DELETE
    const remove = useCallback(
        async (id: number | string, extraConfig: AxiosRequestConfig = {}) => {
            try {
                await axios.delete(`${urlRef.current}/${id}`, {...configRef.current, ...extraConfig});
                get();
            } catch (err: any) {
                setError(err.message || "Delete failed");
            }
        },
        [get]
    );

    // refetch is alias for get
    const refetch = useCallback(() => get(), [get]);

    // run only once if autoFetch = true
    useEffect(() => {
        if (autoFetch) get();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFetch]); // ✅ get removed, avoids loop

    return {data, loading, error, get, getById, create, update, remove, refetch};
}
