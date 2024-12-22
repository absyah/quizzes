"use client";

import { useSubscribeList } from "@/app/_hooks";
import QuizContent from "../_components/QuizContent";
import { useSubscribe } from "@/app/_hooks/useSubscribe";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ParticipantPoint } from "../_components/ParticipantPoint";

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const { data: quiz, isLoading } = useSubscribe("quizzes", { id: params.id });
  const { data: questions, isLoading: isLoadingQuestions } = useSubscribeList(
    "questions",
    {
      filters: [["eq", "quiz_id", params.id]],
    }
  );
  const supabase = createClient();
  const [currentParticipant, setCurrentParticipant] = useState<User | null>(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentParticipant(user);
    };

    fetchParticipant();
  }, [params.id]);

  const { data: currentSubmittedAnswers, isLoading: participantAnswersLoading } = useSubscribeList('participant_answers', {
    filters: [
      ["eq", "quiz_id", params.id],
      ["eq", "participant_id", currentParticipant?.id],
    ],
  });

  if (isLoading || isLoadingQuestions) {
    return <p>Loading...</p>;
  }

  if (!quiz) {
    return <p>Quiz not found</p>;
  }

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-2">{quiz.name}</h1>
        <p className="text-lg text-muted-foreground">{quiz.description}</p>
      </div>
      <div>
        <ParticipantPoint participantId={currentParticipant?.id} />
      </div>
    </div>
    <QuizContent questions={questions} quizId={params.id} submittedAnswers={currentSubmittedAnswers} />
  </div>
  );
}
