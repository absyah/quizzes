import type { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/app/api/responseHandler";
import { createClient } from "@/utils/supabase/server";
import type { ParticipantAnswer } from "./types";

export const POST = async (request: NextRequest) => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const { quizId, userAnswers } = await request.json();

    if (!Array.isArray(userAnswers)) {
      return errorResponse("Invalid answers payload", 400);
    }

    // Filter out null values from the user answers array
    const answers = userAnswers.filter((answer: string | null) => answer !== null);

    if (answers.length === 0) {
      return errorResponse("No user answers submitted", 400);
    }

    // Fetch the question options for the provided answers
    const { data: questionOptions, error: questionOptionsError } = await supabase
      .from("question_options")
      .select("id, question_id, is_correct, text")
      .in("id", answers);

    if (questionOptionsError) {
      return errorResponse(questionOptionsError.message, 500);
    }

    // Extract question IDs and fetch the corresponding questions
    const questionIds = (questionOptions || []).map((option) => option.question_id);

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text")
      .in("id", questionIds);

    if (questionsError) {
      return errorResponse(questionsError.message, 500);
    }

    // Construct participant answers
    const participantAnswers: ParticipantAnswer[] = questionOptions.map((option: any) => {
      const question = questions.find((q: any) => q.id === option.question_id);
      if (!question) return null;

      const point = option.is_correct
        ? parseInt(process.env.NEXT_PUBLIC_CORRECT_ANSWER_POINTS!, 10)
        : 0;

      return {
        participant_id: user.id,
        quiz_id: quizId,
        question_id: option.question_id,
        question_option_id: option.id,
        question_text: question.text,
        answer_text: option.text,
        point,
        is_correct: option.is_correct,
      };
    }).filter(Boolean) as ParticipantAnswer[];

    // Bulk insert participant answers into the database
    const { error } = await supabase.from("participant_answers").insert(participantAnswers);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return successResponse({ message: "Quiz submitted successfully!" });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return errorResponse("An unexpected error occurred", 500);
  }
};
