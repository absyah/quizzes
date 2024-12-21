"use client";

import { useSubscribeList } from "../_hooks/useSubscribeList";
import QuizList from "./_components/QuizList";

export default function Page() {
  const { data: quizzes, isLoading } = useSubscribeList("quizzes", {
    sort: {
      column: "created_at",
      ascending: true,
    },
    pageSize: 10,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex flex-col gap-20 max-w-5xl p-5">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      <QuizList quizzes={quizzes} />
    </main>
  );
}
