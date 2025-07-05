import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuestionCard from "@/components/QuestionCard";
import TimerBar from "@/components/TimerBar";
import LeaderboardTable from "@/components/LeaderboardTable";
import { ChevronRight, Users } from "lucide-react";
import socket from "@/lib/socket";

const Host = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No Quiz Questions Found</h2>
        <p className="mb-6">Please create a quiz first.</p>
        <Button onClick={() => navigate("/create")}>Go to Create Quiz</Button>
      </div>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameCode] = useState("ABC555");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Send first question on mount
    socket.emit("send-question", {
      gameCode,
      question: questions[0],
    });

    // Listen for player updates
    const handlePlayersUpdated = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    socket.on("players-updated", handlePlayersUpdated);

    return () => {
      socket.off("players-updated", handlePlayersUpdated);
    };
  }, [gameCode, questions]);

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questions.length) {
      socket.emit("send-question", {
        gameCode,
        question: questions[nextIndex],
      });
      setCurrentQuestionIndex(nextIndex);
      setShowLeaderboard(false);
    } else {
      setShowLeaderboard(true);
    }
  };

  const handleTimeUp = () => {
    handleNextQuestion();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Live Quiz Host</h1>
          <div className="flex items-center space-x-4">
            <Card className="bg-purple-100 border-purple-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    Game Code: <span className="font-bold">{gameCode}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-100 border-blue-200">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">
                    {players.length}
                  </div>
                  <div className="text-sm text-blue-600">Players</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {!showLeaderboard ? (
        <div className="space-y-6">
          <TimerBar
            duration={30}
            onTimeUp={handleTimeUp}
            key={currentQuestionIndex}
          />

          <QuestionCard
            question={currentQuestion}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            isInstructor={true}
            showCorrectAnswer={false}
          />

          <div className="text-center">
            <Button
              onClick={handleNextQuestion}
              size="lg"
              disabled={showLeaderboard}
              className={`bg-gradient-to-r ${
                isLastQuestion
                  ? "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  : "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              }`}
            >
              <ChevronRight className="h-5 w-5 mr-2" />
              {isLastQuestion ? "Show Final Results" : "Next Question"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLastQuestion
                ? "Final Results"
                : `Question ${currentQuestionIndex + 1} Results`}
            </h2>
            <p className="text-gray-600">
              {isLastQuestion
                ? "Congratulations to all players!"
                : "Current standings after this question"}
            </p>
          </div>

          <LeaderboardTable
            players={players} // Your real players array from socket
            showFullStats={isLastQuestion}
            totalAnswers={questions.length} // total questions count
          />

          {!isLastQuestion && (
            <div className="text-center">
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <ChevronRight className="h-5 w-5 mr-2" />
                Continue to Next Question
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Host;
