"use client";

import { useState } from "react";
import { QuestionItem } from "./QuestionItem";
import { Button } from "@/components/ui/button";
import { Tables } from "@/supabase/types/schema";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface QuizContentProps {
  questions: Tables<"questions">[];
  quizId: string;
}

export default function QuizContent({ questions, quizId }: QuizContentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  );

  const router = useRouter();
  const { toast } = useToast();

  const handleSelectOption = (optionId: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = optionId;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/answers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizId, userAnswers }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Failed to submit the quiz. Please try again.",
        });
        return;
      }

      console.log('Quiz submitted successfully:', result);
      toast({
        title: "Quiz Submitted",
        description: "Your quiz has been submitted successfully!",
      });
      router.push('/leaderboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      <QuestionItem
        key={currentQuestion.id}
        question={currentQuestion}
        selectedOption={userAnswers[currentQuestionIndex]}
        onSelectOption={handleSelectOption}
      />
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        {isLastQuestion ? (
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        ) : (
          <Button variant="outline" onClick={handleNextQuestion}>Next</Button>
        )}
      </div>
    </div>
  );
}

