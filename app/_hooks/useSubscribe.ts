import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Database, Tables } from '../_types/schema'
import { isReadyIdParams, isSameIds } from '@/utils/CRUD-base/utils'
import { IdParams } from '@/utils/CRUD-base/types'
import { useRead } from './useCRUD'
import { Filter, useSubscriptionQuery } from './useSubscriptionQuery'
import { useDeepCompareMemo } from './useDeepCompareMemo'

export interface UseSubscribeOptions {
  subscribeTables?: (keyof Database['public']['Tables'])[]
}

/**
 * Custom hook for handling data.
 * @param {string} table - table name
 * @param {IdParams<T>} idParams - Parameters for identification data
 * @param {UseSubscribeOptions} options - Parameters for pagination, subscribe, etc...
 */
export const useSubscribe = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  table: T,
  idParams: IdParams<T>,
  options?: UseSubscribeOptions
) => {
  const { subscribeTables = [table] } = options || {}

  // to avoid no need fetching, control fetching state in realtime
  const fetchingRef = useRef<boolean>(false)

  const [data, setData] = useState<Tables<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetcherError, setFetcherError] = useState<Error | null>(null)
  const { getOneById } = useRead<T>(table)

  const channelName = useMemo(() => {
    if (!isReadyIdParams(idParams)) {
      return table
    }
    return `${table}/${Object.entries(idParams)
      .map(([key, value]) => `${key}-${String(value)}`)
      .join('/')}`
  }, [idParams, table])

  const filter = useMemo<Filter>(
    () => ({
      tables: subscribeTables,
      event: '*',
      schema: '*',
      // as subscription's filter support only one condition, we could not use it
      // filter: `id=eq.${id}`,
    }),
    [subscribeTables]
  )

  const fetcher = useCallback(
    async (idParams: IdParams<T>) => {
      try {
        fetchingRef.current = true
        const { data } = await getOneById(idParams)
        setData(data)
      } catch (error) {
        if (error instanceof Error) {
          setFetcherError(error)
        }
        setFetcherError(new Error('Unknown error during fetching data'))
      } finally {
        setIsLoading(false)
        fetchingRef.current = false
      }
    },
    [getOneById]
  )

  const debounceFetcher = useCallback(
    async (idParams: IdParams<T>) => {
      if (!fetchingRef.current) {
        await fetcher(idParams)
      }
    },
    [fetcher]
  )

  // initial fetch
  useEffect(() => {
    if (!isReadyIdParams(idParams)) return
    void fetcher(idParams)

    // as "idParams" is object, when we set it normally in deps, infinite loop happens.
    // to avoid unexpected infinite loop, we memorized "idParams" and set it in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, useDeepCompareMemo(idParams)])

  const { error: subscriptionError } = useSubscriptionQuery(
    channelName,
    filter,
    {
      onInsert: (updatedTable, data) => {
        if (!isReadyIdParams(idParams)) return

        if (updatedTable === table && isSameIds(data as Tables<T>, idParams)) {
          setData(data as Tables<T>)
        } else if ((subscribeTables as string[]).includes(updatedTable)) {
          void debounceFetcher(idParams)
        }
      },
      onUpdate: (updatedTable, data) => {
        if (!isReadyIdParams(idParams)) return

        if (updatedTable === table && isSameIds(data as Tables<T>, idParams)) {
          setData(data as Tables<T>)
        } else if ((subscribeTables as string[]).includes(updatedTable)) {
          void debounceFetcher(idParams)
        }
      },
      onDelete: (updatedTable, data) => {
        if (!isReadyIdParams(idParams)) return

        if (
          updatedTable === table &&
          isSameIds(data as Partial<Tables<T>>, idParams)
        ) {
          setData(null)
        } else if ((subscribeTables as string[]).includes(updatedTable)) {
          void debounceFetcher(idParams)
        }
      },
    }
  )

  const error = useMemo(() => {
    return fetcherError || subscriptionError
  }, [fetcherError, subscriptionError])

  return { isLoading, error, data }
}
