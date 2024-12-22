import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tables } from "@/supabase/types/schema";
import { useSubscribeList, useSubscribe } from "@/app/_hooks";
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionItemProps {
  question: Tables<"questions">;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  submittedAnswer?: Tables<"participant_answers">;
}

export function QuestionItem({
  question,
  selectedOption,
  onSelectOption,
  submittedAnswer
}: QuestionItemProps) {
  const { data: questionOptions, isLoading } = useSubscribeList(
    "question_options",
    {
      filters: [["eq", "question_id", question.id]],
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      {submittedAnswer ? (
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Your answer:</p>
          <div className={`p-3 rounded-md ${
            submittedAnswer.is_correct
              ? "bg-green-100 border border-green-300"
              : "bg-red-100 border border-red-300"
          }`}>
            <div className="flex items-center">
              {submittedAnswer.is_correct ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">
                {submittedAnswer.answer_text}
              </span>
            </div>
            <p className="mt-2 text-sm">
              {submittedAnswer.is_correct
                ? "Correct! Well done."
                : "Incorrect. Keep practicing!"}
            </p>
          </div>
        </div>
      ) : (
        <RadioGroup
          value={selectedOption || undefined}
          onValueChange={onSelectOption}
        >
          {(questionOptions || []).map((option: Tables<"question_options">) => (
            <div key={option.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}
