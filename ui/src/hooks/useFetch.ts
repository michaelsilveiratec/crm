import { useState, useCallback } from "preact/hooks";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export function useFetch<T>(defaultValue: T) {
  const [state, setState] = useState<FetchState<T>>({
    data: defaultValue,
    loading: false,
    error: "",
  });

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      setState((s: FetchState<T>) => ({ ...s, loading: true, error: "" }));
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const errData = await res
            .json()
            .catch(() => ({ error: `Erro ${res.status}` }));
          throw new Error(errData.error || `Erro ${res.status}`);
        }
        const data: T = await res.json();
        setState({ data, loading: false, error: "" });
        return data;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        setState((s: FetchState<T>) => ({ ...s, loading: false, error: msg }));
        return null;
      }
    },
    [],
  );

  return { ...state, execute };
}
