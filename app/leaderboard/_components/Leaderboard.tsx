import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal } from "lucide-react";
import { Tables } from "@/supabase/types/schema";

interface LeaderboardProps {
  data: Tables<"participant_points">[];
}

export function Leaderboard({ data }: LeaderboardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-primary/20">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5">
            <TableHead className="w-16 text-center font-bold">Rank</TableHead>
            <TableHead className="font-bold">Participant</TableHead>
            <TableHead className="text-right font-bold">Total Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow
              key={entry.id}
              className={(entry.rank || 1) <= 3 ? "bg-primary/5" : ""}
            >
              <TableCell className="text-center font-medium">
                {entry.rank === 1 && (
                  <Trophy className="inline-block mr-1 text-yellow-500" />
                )}
                {entry.rank === 2 && (
                  <Medal className="inline-block mr-1 text-gray-400" />
                )}
                {entry.rank === 3 && (
                  <Medal className="inline-block mr-1 text-amber-600" />
                )}
                {entry.rank}
              </TableCell>
              <TableCell className="font-semibold">
                {entry.participant_name}
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-block bg-primary text-primary-foreground rounded-full px-3 py-1">
                  {entry.total_points}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="bg-primary/5 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Keep playing to improve your rank and earn more points!
        </p>
      </div>
    </div>
  );
}
