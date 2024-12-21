import { createClient } from '@/utils/supabase/client'
import { Database, Tables, TablesInsert, TablesUpdate } from '../../supabase/types/schema'
import { PaginationParams, IdParams } from './types'
import { queryBuilder } from './utils'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * This service provide us a default error handler
 * @param table table name
 * @returns set of services
 */
export const getReadBase = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  table: T
) => {
  const supabase = createClient()

  const _getPreQuery = () => supabase.from(table)

  const list = async (
    pg: PaginationParams
  ): Promise<{
    data: Tables<T>[] | null
    count: number | null
    error: PostgrestError | null
  }> => {
    const {
      from = 0,
      to = from + 1,
      sort = { column: 'id' },
      filters = [],
      includeDeleted,
    } = pg
    const { column, ...rest } = sort
    const query = _getPreQuery().select('*', { count: 'exact' })
    if (!includeDeleted) {
      void query.is('deleted_at', null)
    }
    queryBuilder(query, filters)

    const res = await query.range(from, to).order(column, { ...rest })
    return res
  }

  const getOneById = async (idParams: IdParams<T>) => {
    const query = _getPreQuery().select()

    queryBuilder(
      query,
      Object.entries(idParams).map(([key, value]) => [
        'eq',
        key,
        value as NonNullable<unknown>,
      ])
    )

    const res = await query.single()
    return res
  }

  return {
    list,
    getOneById,
  }
}

/**
 * This service provide us a default error handler
 * @param table table name
 * @returns set of services
 */
export const getCRUDBase = <T extends keyof Database['public']['Tables']>(
  table: T
) => {
  const { list, getOneById } = getReadBase<T>(table)

  const supabase = createClient()

  const _getPreQuery = () => supabase.from(table)

  const createData = async (data: TablesInsert<T> | TablesInsert<T>[]) => {
    const res = await _getPreQuery().insert(data).select()
    return res
  }

  const upsertData = async (data: TablesInsert<T> | TablesInsert<T>[]) => {
    const res = await _getPreQuery().upsert(data)
    return res
  }

  const deleteById = async (idParams: IdParams<T>) => {
    const query = _getPreQuery()
      .update({ deleted_at: new Date().toISOString() })

    queryBuilder(
      query,
      Object.entries(idParams).map(([key, value]) => [
        'eq',
        key,
        value as NonNullable<unknown>,
      ])
    )

    const res = await query
    return res
  }

  const deleteByCondition = async (
    filters: PaginationParams['filters'],
    deleted_at = new Date().toISOString()
  ) => {
    const query = _getPreQuery()
      .update({ deleted_at })

    queryBuilder(query, filters)

    const res = await query
    return res
  }

  const updateById = async (idParams: IdParams<T>, data: TablesUpdate<T>) => {
    const query = _getPreQuery()
      .update(data)

    queryBuilder(
      query,
      Object.entries(idParams).map(([key, value]) => [
        'eq',
        key,
        value as NonNullable<unknown>,
      ])
    )

    const res = await query
    return res
  }

  return {
    list,
    getOneById,
    createData,
    deleteByCondition,
    deleteById,
    updateById,
    upsertData,
  }
}
