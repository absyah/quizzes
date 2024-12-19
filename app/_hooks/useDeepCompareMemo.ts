import { useMemo, useRef } from 'react'
import { dequal as deepEqual } from 'dequal'

export const useDeepCompareMemo = <T>(value: T) => {
  const ref = useRef<T>(value)
  const signalRef = useRef<number>(0)

  if (!deepEqual(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ref.current, [signalRef.current])
}
