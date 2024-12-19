import { useMemo } from 'react'
import { getCRUDBase, getReadBase } from '@/utils/CRUD-base'
import { Database } from '../_types/schema'

export const useCRUD = <T extends keyof Database['public']['Tables']>(
  table: T
) => {
  const {
    list,
    getOneById,
    createData,
    deleteByCondition,
    deleteById,
    updateById,
    upsertData,
  } = useMemo(() => getCRUDBase<T>(table), [table])

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

export const useRead = <
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
>(
  table: T
) => {
  const { list, getOneById } = useMemo(() => getReadBase<T>(table), [table])

  return {
    list,
    getOneById,
  }
}
