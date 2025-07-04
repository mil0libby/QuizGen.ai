
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuestionCard from "@/components/QuestionCard";
import TimerBar from "@/components/TimerBar";
import LeaderboardTable from "@/components/LeaderboardTable";
import { ChevronRight, Users } from "lucide-react";

const Host = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameCode] = useState("ABC123");

  const mockQuestions = [
    {
      id: 1,
      question: "Which event is considered the beginning of World War 2?",
      options: ["Pearl Harbor Attack", "Invasion of Poland", "Battle of Britain", "D-Day Landings"],
      correctAnswer: 1,
      difficulty: "Easy"
    },
    {
      id: 2,
      question: "Who was the leader of Nazi Germany during World War 2?",
      options: ["Heinrich Himmler", "Hermann Göring", "Adolf Hitler", "Joseph Goebbels"],
      correctAnswer: 2,
      difficulty: "Easy"
    },
    {
      id: 3,
      question: "In which year did World War 2 end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      difficulty: "Medium"
    }
  ];

  const mockPlayers = [
    { id: 1, name: "Alice", score: 2850, correctAnswers: 3, totalAnswers: 3 },
    { id: 2, name: "Bob", score: 2340, correctAnswers: 2, totalAnswers: 3 },
    { id: 3, name: "Charlie", score: 1890, correctAnswers: 2, totalAnswers: 3 },
    { id: 4, name: "Diana", score: 1450, correctAnswers: 1, totalAnswers: 3 },
    { id: 5, name: "Eve", score: 980, correctAnswers: 1, totalAnswers: 3 }
  ];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowLeaderboard(false);
    } else {
      setShowLeaderboard(true);
    }
  };

  const handleTimeUp = () => {
    setShowLeaderboard(true);
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;

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
                  <div className="text-2xl font-bold text-blue-800">{mockPlayers.length}</div>
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
            key={currentQuestionIndex} // Reset timer for each question
          />
          
          <QuestionCard
            question={currentQuestion}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            isInstructor={true}
            showCorrectAnswer={false}
          />

          <div className="text-center">
            <Button 
              onClick={handleNextQuestion}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
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
              {isLastQuestion ? "Final Results" : `Question ${currentQuestionIndex + 1} Results`}
            </h2>
            <p className="text-gray-600">
              {isLastQuestion ? "Congratulations to all players!" : "Current standings after this question"}
            </p>
          </div>

          <LeaderboardTable players={mockPlayers} showFullStats={isLastQuestion} />

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
