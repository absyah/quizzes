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
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="flex flex-col gap-2 items-start">
          <h2 className="font-bold text-2xl mb-4">Available Quizzes</h2>
          <QuizList quizzes={quizzes} />
        </div>
      </div>
    </div>
  );
}
