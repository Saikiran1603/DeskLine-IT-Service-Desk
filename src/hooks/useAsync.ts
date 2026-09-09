import { useCallback, useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/** Runs an async fetcher on mount (and whenever deps change), tracking loading/error/data. */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, isLoading: true, error: null })

  const run = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    fetcher()
      .then((data) => setState({ data, isLoading: false, error: null }))
      .catch((err: Error) => setState({ data: null, isLoading: false, error: err.message }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  return { ...state, refetch: run, setData: (data: T) => setState((s) => ({ ...s, data })) }
}
