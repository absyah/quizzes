"use client";

import { useSubscribeList } from "@/app/_hooks";
import QuizContent from "../_components/QuizContent";
import { useSubscribe } from "@/app/_hooks/useSubscribe";
import { useParams } from "next/navigation";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const { data: quiz, isLoading } = useSubscribe("quizzes", { id: params.id });
  const { data: questions, isLoading: isLoadingQuestions } = useSubscribeList(
    "questions",
    {
      filters: [["eq", "quiz_id", params.id]],
    }
  );

  if (isLoading || isLoadingQuestions) {
    return <p>Loading...</p>;
  }

  if (!quiz) {
    return <p>Quiz not found</p>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.name}</h1>
      <p className="text-lg mb-6">{quiz.description}</p>
      <QuizContent questions={questions} quizId={quiz.id}/>
    </main>
  );
}
