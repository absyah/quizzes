'use client'

import { useState } from 'react'
import { QuestionItem } from './QuestionItem'
import { Button } from "@/components/ui/button"
import { Tables } from '@/supabase/types/schema'

interface QuizContentProps {
  questions: Tables<'questions'>[]
}

export default function QuizContent({ questions }: QuizContentProps) {
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  )

  const handleSelectOption = (questionIndex: number, optionId: string) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[questionIndex] = optionId
    setUserAnswers(newUserAnswers)
  }

  const handleSubmit = () => {
    // TODO: Implement quiz submission logic
    console.log('User answers:', userAnswers)
  }

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          selectedOption={userAnswers[index]}
          onSelectOption={(optionId) => handleSelectOption(index, optionId)}
        />
      ))}
      <Button onClick={handleSubmit} className="mt-8">
        Submit Quiz
      </Button>
    </div>
  )
}

