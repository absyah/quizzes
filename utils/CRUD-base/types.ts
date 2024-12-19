import { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types'
import { Database, Tables } from '../../app/_types/schema'

export type FilterQuery = PostgrestFilterBuilder<
  Database['public'],
  Record<string, unknown>,
  unknown
>

export type FilterOperator = keyof Pick<
  PostgrestFilterBuilder<GenericSchema, Record<string, unknown>, unknown>,
  'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in'
>

export type FilterParams<T extends FilterOperator> = Parameters<
  PostgrestFilterBuilder<
    Database['public'],
    Record<string, unknown>,
    unknown
  >[T]
>

export type Filter<T extends FilterOperator> = [T, ...FilterParams<T>]

export interface PaginationParams {
  from?: number
  to?: number
  sort?: {
    column: string
    ascending?: boolean | undefined
    nullsFirst?: boolean | undefined
    foreignTable?: undefined
  }
  filters?: Filter<FilterOperator>[]
  includeDeleted?: boolean
}

export type IdParams<
  T extends keyof (Database['public']['Tables'] & Database['public']['Views']),
> = Partial<Tables<T>>
