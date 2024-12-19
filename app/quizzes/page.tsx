'use client'

import { useSubscribeList } from '../_hooks/useSubscribeList'

export default function Page() {
  const { data: quizzes, isLoading } =
    useSubscribeList('quizzes', {
      sort: {
        column: 'created_at',
        ascending: true,
      },
      pageSize: 10,
    })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return <>
    <pre>{JSON.stringify(quizzes, null, 2)}</pre>
  </>
}
