import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import TimerBar from "@/components/TimerBar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";
import socket from "@/lib/socket";

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameCode = location.state?.gameCode; // Make sure gameCode is passed when navigating here
  const time = location.state?.time;

  useEffect(() => {
    console.log(time, "seconds per question");
  }, [time]);

  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // For progress display

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1000);
    }

    if (gameCode) {
      socket.emit("submit-answer", {
        gameCode,
        isCorrect,
      });
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
    }
  };

  const handleNewQuestion = (question: any) => {
    setCurrentQuestion(question);
    setSelectedAnswer(undefined);
    setHasAnswered(false);
    setQuestionNumber((prev) => prev + 1);
  };

  useEffect(() => {
    const handleQuizComplete = ({ players }: { players: any[] }) => {
      if (!players || players.length === 0) return;

      // Delay navigation briefly to allow any animations to complete
      setTimeout(() => {
        navigate("/student/leaderboard", {
          state: {
            players,
            playerId: socket.id,
            totalQuestions: questionNumber,
          },
        });
      }, 1000); // 1-second delay (optional)
    };

    socket.on("quiz-complete", handleQuizComplete);

    return () => {
      socket.off("quiz-complete", handleQuizComplete);
    };
  }, [navigate, questionNumber]);

  useEffect(() => {
    socket.on("new-question", handleNewQuestion);

    return () => {
      socket.off("new-question", handleNewQuestion);
    };
  }, []);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">
          Waiting for instructor to start the quiz...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Live Quiz</h1>
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-800">
                  {score.toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">Points</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {!hasAnswered ? (
        <div className="space-y-6">
          <TimerBar
            duration={time}
            onTimeUp={handleTimeUp}
            key={currentQuestion.id}
          />

          <QuestionCard
            question={currentQuestion}
            currentQuestion={questionNumber}
            totalQuestions={undefined}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
          />
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Answer Submitted!
              </h2>
              <p className="text-green-700">
                {selectedAnswer === currentQuestion.correctAnswer
                  ? "Correct! Well done!"
                  : "Incorrect. The correct answer was: " +
                    currentQuestion.options[currentQuestion.correctAnswer]}
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Waiting for next question...</span>
              </div>
            </CardContent>
          </Card>

          <QuestionCard
            question={currentQuestion}
            currentQuestion={questionNumber}
            totalQuestions={undefined}
            selectedAnswer={selectedAnswer}
            showCorrectAnswer={true}
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
