export type ParticipantAnswer = {
  participant_id: string;
  quiz_id: string;
  question_id: string;
  question_option_id: string;
  question_text: string;
  answer_text: string;
  point: number;
  is_correct: boolean;
};