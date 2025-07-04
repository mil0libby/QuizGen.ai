import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import TimerBar from "@/components/TimerBar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";
import socket from "@/lib/socket";

const Quiz = () => {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0); // Just to show progress

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1000);
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
    }
  };

  const handleAutoAdvance = () => {
    // In real-time setup, the instructor controls next question
    // So we only reset state and wait for next `new-question`
    setSelectedAnswer(undefined);
    setHasAnswered(false);
  };

  useEffect(() => {
    socket.on("new-question", (question) => {
      console.log("new question");
      setCurrentQuestion(question);
      handleAutoAdvance();
      setQuestionNumber((prev) => prev + 1);
    });

    return () => {
      socket.off("new-question");
    };
  }, []);

  // Auto advance after answer reveal delay
  useEffect(() => {
    if (hasAnswered) {
      const timer = setTimeout(() => {
        setHasAnswered(false);
        setSelectedAnswer(undefined);
        // Wait for next "new-question" from instructor
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAnswered]);

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
            duration={30}
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
                <span className="text-sm">Next question starting soon...</span>
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
