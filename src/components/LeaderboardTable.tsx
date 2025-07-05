import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface Player {
  id: string; // socket id is a string
  name: string;
  score: number;
  // Removed correctAnswers and totalAnswers since calculated on client
}

interface LeaderboardTableProps {
  players: Player[];
  showFullStats?: boolean;
  totalAnswers?: number; // total questions count from host
}

const LeaderboardTable = ({
  players,
  showFullStats = false,
  totalAnswers = 0,
}: LeaderboardTableProps) => {
  const filteredPlayers = players.filter(
    (player) => player.name !== "Instructor"
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              {showFullStats && (
                <>
                  <TableHead className="text-right">Correct</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => {
              const rank = index + 1;
              const correctAnswers = player.score / 1000;
              const accuracy =
                totalAnswers > 0
                  ? Math.round((correctAnswers / totalAnswers) * 100)
                  : 0;

              return (
                <TableRow key={player.id} className={getRankStyle(rank)}>
                  <TableCell className="flex items-center justify-center">
                    {getRankIcon(rank)}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{player.name}</span>
                      {rank <= 3 && (
                        <Badge variant="secondary" className="text-xs">
                          Top {rank}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {player.score.toLocaleString()}
                  </TableCell>
                  {showFullStats && (
                    <>
                      <TableCell className="text-right">
                        {correctAnswers}/{totalAnswers}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            accuracy >= 80
                              ? "default"
                              : accuracy >= 60
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {accuracy}%
                        </Badge>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
