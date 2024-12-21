import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tables } from "@/supabase/types/schema"

interface QuizCardProps {
  quiz: Tables<'quizzes'>
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{quiz.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{quiz.description}</p>
        <p className="mt-2 text-sm font-semibold">{10} questions</p>
      </CardContent>
    </Card>
  )
}
