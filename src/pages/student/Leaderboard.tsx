import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeaderboardTable from "@/components/LeaderboardTable";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";

const Leaderboard = () => {
  const location = useLocation();
  const players = location.state?.players || [];
  const currentPlayerId = location.state?.playerId;
  const totalQuestions = location.state?.totalQuestions - 1;

  useEffect(() => {
    console.log(totalQuestions);
  }, [totalQuestions]);

  const sortedPlayers = [...players]
    .filter((p) => p.name !== "Instructor")
    .sort((a, b) => b.score - a.score);
  const playerIndex = sortedPlayers.findIndex((p) => p.id === currentPlayerId);
  const user = sortedPlayers[playerIndex];

  const userRank = playerIndex + 1;
  const userScore = user?.score || 0;
  const accuracy = user
    ? Math.round((userScore / 1000 / totalQuestions) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quiz Complete!
        </h1>
        <p className="text-gray-600">Here are the final results</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-blue-800">Your Rank</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600">#{userRank}</div>
            <div className="text-sm text-blue-500">
              out of {sortedPlayers.length} players
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-purple-800">
              Your Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {userScore.toLocaleString()}
            </div>
            <div className="text-sm text-purple-500">points earned</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-green-800">Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-sm text-green-500">correct answers</div>
          </CardContent>
        </Card>
      </div>

      <LeaderboardTable
        players={sortedPlayers}
        showFullStats={true}
        totalAnswers={totalQuestions}
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/student/join">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </Link>
        <Link to="/">
          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 hover:bg-gray-50"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mt-8 text-center">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Thanks for Playing!
            </h3>
            <p className="text-gray-600 text-sm">
              Share this quiz with your friends and see who can get the highest
              score!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
