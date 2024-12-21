import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Database, Tables } from '../../supabase/types/schema'
import { isSameIds } from '@/utils/CRUD-base/utils'
import { IdParams, PaginationParams } from '@/utils/CRUD-base/types'
import { useSubscriptionQuery } from './useSubscriptionQuery'
import { useRead } from './useCRUD'
import { useDeepCompareMemo } from './useDeepCompareMemo'

const PAGE = 1
const PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 10000 // this follows max supabase API payload size, configured in `max_rows` config.toml

export type UseSubscribeListOptions<
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
> = Pick<PaginationParams, 'filters' | 'includeDeleted' | 'sort'> & {
  page?: number
  pageSize?: number
  comparedIds?: (keyof IdParams<T>)[]
  subscribeTables?: (keyof Database['public']['Tables'])[]
  key?: string
  isLoadingWhenRefetch?: boolean
}

/**
 * Custom hook for handling list data.
 * @param {string} table - table name
 * @param {UseSubscribeListOptions<T>} options - Parameters for pagination, subscribe, etc...
 */
export const useSubscribeList = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  table: T,
  options?: UseSubscribeListOptions<T>
) => {
  const {
    page = PAGE,
    pageSize = PAGE_SIZE,
    sort,
    filters = [],
    includeDeleted = false,
    comparedIds = [],
    subscribeTables = [table],
    key,
    isLoadingWhenRefetch,
  } = options || {}

  // to avoid no need fetching, control fetching state in realtime
  const fetchingRef = useRef<boolean>(false)

  const [data, setData] = useState<Tables<T>[]>([])
  const [fetcherError, setFetcherError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(page)
  const { list } = useRead<T>(table)
  /**
   * Function to set the current page.
   * @param {number} newPage - The new page value.
   */
  const setPage = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  const fetcher = useCallback(
    async (_page: number) => {
      if (isLoadingWhenRefetch) {
        setIsLoading(true)
        setData([])
      }
      try {
        fetchingRef.current = true

        // Calculate start and end indices for the current page
        const from = (_page - 1) * pageSize
        const to = _page * pageSize - 1
        const { data, count, error } = await list({
          from,
          to,
          sort: {
            column: sort?.column || 'id',
            ascending: sort?.ascending,
          },
          filters,
          includeDeleted,
        })

        if (error) {
          setFetcherError(new Error(error.message))
        }

        // Math max to avoid page count 0
        const pageCount = Math.max(1, Math.ceil((count || 0) / pageSize))

        // handle if the current page is greater than the total pages
        // this means the last index is out of range
        if (_page > pageCount) {
          // retry with the last page
          setCurrentPage(pageCount)
        }

        setData(data ?? [])
        setTotalPages(pageCount)
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
    // as "sort" is object, when we passed non-memorized args, infinite loop happens.
    // to avoid unexpected infinite loop, we haven't set deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useDeepCompareMemo(filters), includeDeleted]
  )

  const debounceFetcher = useCallback(
    async (_page: number) => {
      if (!fetchingRef.current) {
        await fetcher(_page)
      }
    },
    [fetcher]
  )

  // initial fetch
  useEffect(() => {
    void fetcher(currentPage)
  }, [currentPage, fetcher])

  const { error: subscriptionError } = useSubscriptionQuery(
    key ? `${table}-${key}` : table,
    { tables: subscribeTables, event: '*', schema: '*' },
    {
      onInsert: () => {
        void debounceFetcher(currentPage)
      },
      onUpdate: (updatedTable, data) => {
        const shouldReplaceData =
          updatedTable === table &&
          includeDeleted &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any)?.deleted_at &&
          comparedIds.length > 0

        if (shouldReplaceData) {
          const idParams = comparedIds.reduce<IdParams<T>>(
            (obj, comparedId) => {
              obj[comparedId] = (data as Tables<T>)[comparedId]
              return obj
            },
            {}
          )

          setData((prev) =>
            prev.map((item) =>
              isSameIds(item, idParams) ? (data as Tables<T>) : item
            )
          )
        } else {
          void debounceFetcher(currentPage)
        }
      },
      onDelete: () => {
        void debounceFetcher(currentPage)
      },
    }
  )

  const error = useMemo(() => {
    return fetcherError || subscriptionError
  }, [fetcherError, subscriptionError])

  const refetch = useCallback(async () => {
    await fetcher(currentPage)
  }, [currentPage, fetcher])

  return {
    data,
    error,
    isLoading,
    totalPages,
    currentPage,
    setPage,
    refetch,
  }
}
