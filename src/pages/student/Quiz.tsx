
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "@/components/QuestionCard";
import TimerBar from "@/components/TimerBar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    
    // Calculate score based on correctness and time
    const currentQuestion = mockQuestions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1000); // Base score for correct answer
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(undefined);
      setHasAnswered(false);
    } else {
      navigate("/student/leaderboard");
    }
  };

  // Auto-advance to next question after showing answer
  useEffect(() => {
    if (hasAnswered) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAnswered, currentQuestionIndex]);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Live Quiz</h1>
          <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-0">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-800">{score.toLocaleString()}</div>
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
            key={currentQuestionIndex}
          />
          
          <QuestionCard
            question={currentQuestion}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
          />
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Answer Submitted!</h2>
              <p className="text-green-700">
                {selectedAnswer === currentQuestion.correctAnswer 
                  ? "Correct! Well done!" 
                  : "Incorrect. The correct answer was: " + currentQuestion.options[currentQuestion.correctAnswer]
                }
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Next question starting soon...</span>
              </div>
            </CardContent>
          </Card>

          <QuestionCard
            question={currentQuestion}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            selectedAnswer={selectedAnswer}
            showCorrectAnswer={true}
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
