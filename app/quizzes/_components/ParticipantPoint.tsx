"use client";

import { useSubscribeList } from "@/app/_hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface ParticipantPointProps {
  participantId?: string;
}

export function ParticipantPoint({ participantId }: ParticipantPointProps) {
  const { data: participantPoints, isLoading } = useSubscribeList(
    "participant_points",
    {
      filters: [["eq", "id", participantId]],
      subscribeTables: ["participant_answers"],
      page: 1,
      pageSize: 1,
    }
  );

  const participantPoint = participantPoints[0];
  const totalPoint = participantPoint?.total_points || 0;

  if (isLoading) {
    return <div className="h-20 bg-muted animate-pulse rounded-lg"></div>;
  }

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Your Total Score</CardTitle>
        <Trophy className="h-4 w-4 text-muted" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalPoint} points</div>
      </CardContent>
    </Card>
  );
}
