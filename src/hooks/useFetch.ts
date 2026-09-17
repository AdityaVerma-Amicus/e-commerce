import { useEffect, useState } from "react";

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result: T = await response.json();

                setData(result);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return {
        data,
        loading,
        error,
    };
}

export default useFetch;