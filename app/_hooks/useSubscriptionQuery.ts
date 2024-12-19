import {
REALTIME_LISTEN_TYPES,
REALTIME_SUBSCRIBE_STATES,
REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
RealtimePostgresChangesFilter,
} from '@supabase/supabase-js'
import { useEffect, useState, useRef } from 'react'
import { GenericTable } from '@supabase/supabase-js/dist/main/lib/types'
import { createClient } from '@/utils/supabase/client'

const client = createClient()

type PosgresChangesFunction = (
table: string,
data: GenericTable['Row']
) => Promise<void> | void

export interface Callback {
onInsert?: PosgresChangesFunction
onUpdate?: PosgresChangesFunction
onDelete?: PosgresChangesFunction
}

export type Filter = Omit<
RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
'table'
> & { tables: string[] }

export const useSubscriptionQuery = (
channelName: string,
filter: Filter,
callback: Callback = {}
) => {
const [status, setStatus] = useState<`${REALTIME_SUBSCRIBE_STATES}`>()
const [error, setError] = useState<Error>()

const callbackRef = useRef<Callback>({})

useEffect(() => {
    callbackRef.current = callback
}, [callback])

useEffect(
    () => {
    const { tables, ...filterProps } = filter

    let channel = client.channel(channelName)

    for (const table of tables) {
        channel = channel.on<GenericTable['Row']>(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        { table, ...filterProps },
        (payload) => {
            switch (payload.eventType) {
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT:
                void callbackRef.current?.onInsert?.(table, payload.new)
                break
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE:
                void callbackRef.current?.onUpdate?.(table, payload.new)
                break
            case REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE:
                void callbackRef.current?.onDelete?.(table, payload.old)
                break
            default:
                break
            }
        }
        )
    }

    channel.subscribe((status, error) => {
        setStatus(status)
        setError(error)
    })

    return () => {
        void channel.unsubscribe()
    }
    },
    // as "filter" is object, when we passed non-memorized args, infinite loop happens.
    // to avoid unexpected infinite loop, we haven't set "filter" in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channelName]
)

return { status, error }
}
