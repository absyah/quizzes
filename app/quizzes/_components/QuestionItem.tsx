import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tables } from '@/supabase/types/schema'
import { useSubscribeList } from "@/app/_hooks"

interface QuestionItemProps {
  question: Tables<'questions'>
  selectedOption: string | null
  onSelectOption: (optionId: string) => void
}

export function QuestionItem({ question, selectedOption, onSelectOption }: QuestionItemProps) {
  const { data: questionOptions, isLoading } = useSubscribeList(
    'question_options',
    {
      filters: [['eq', 'question_id', question.id]]
    }
  )

  if (isLoading) {
      return <p>Loading...</p>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <RadioGroup value={selectedOption || undefined} onValueChange={onSelectOption}>
        {(questionOptions||[]).map((option: Tables<'question_options'>) => (
          <div key={option.id} className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
