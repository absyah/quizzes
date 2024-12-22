import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/supabase/types/schema";

interface QuizCardProps {
  quiz: Tables<"quizzes">;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 w-[640px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{quiz.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{quiz.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">{quiz.number_of_questions} questions</span>
        </div>
      </CardContent>
    </Card>
  )
}
