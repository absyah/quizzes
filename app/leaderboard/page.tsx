"use client";

import { useSubscribeList } from "../_hooks/useSubscribeList";
import { Leaderboard } from "./_components/Leaderboard";

export default function Home() {
  const { data: leaderboardData, isLoading } = useSubscribeList(
    "participant_points",
    {
      subscribeTables: ["participants", "participant_answers"],
      sort: { column: "rank", ascending: true },
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-center text-primary">
        Leaderboard
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Compete, climb the ranks, and become the Quiz Master!
      </p>
      <Leaderboard data={leaderboardData} />
    </main>
  );
}
