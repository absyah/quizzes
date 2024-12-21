import { Database, Tables } from '../../supabase/types/schema'
import { Filter, FilterOperator, IdParams, FilterQuery } from './types'

export const queryBuilder = <T extends FilterOperator>(
  query: FilterQuery,
  filters: Filter<T>[] = []
) => {
  filters.forEach(([operator, ...params]) => {
    // @ts-expect-error FIXME
    query[operator](...params)
  })
}

export const isSameIds = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  data: Partial<Tables<T>>,
  idParams: IdParams<T>
) => {
  const result = Object.entries(idParams).every(([key, value]) => {
    return data[key as keyof Tables<T>] === value
  })
  return result
}

export const isReadyIdParams = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  idParams: IdParams<T>
) => {
  if (Object.keys(idParams).length === 0) {
    return false
  }

  const result = Object.entries(idParams).every(([, value]) => {
    return value !== undefined
  })

  return result
}
