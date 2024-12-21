import Link from "next/link";
import { QuizCard } from "./QuizCard";
import { Tables } from "@/supabase/types/schema";

interface QuizListProps {
  quizzes: Tables<"quizzes">[];
}

export default function QuizList({ quizzes }: QuizListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quizzes/${quiz.id}`}>
          <QuizCard quiz={quiz} />
        </Link>
      ))}
    </div>
  );
}
