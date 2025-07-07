import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
  difficulty?: string;
}

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswerSelect?: (answerIndex: number) => void;
  selectedAnswer?: number;
  showCorrectAnswer?: boolean;
  isInstructor?: boolean;
}

const QuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswerSelect,
  selectedAnswer,
  showCorrectAnswer = false,
  isInstructor = false,
}: QuestionCardProps) => {
  const optionColors = [
    "bg-red-500 hover:bg-red-600",
    "bg-blue-500 hover:bg-blue-600",
    "bg-yellow-500 hover:bg-yellow-600",
    "bg-green-500 hover:bg-green-600",
  ];

  const getOptionStyle = (index: number) => {
    if (showCorrectAnswer && question.correctAnswer === index) {
      return "bg-green-500 text-white border-green-600";
    }
    if (selectedAnswer === index) {
      return "bg-purple-500 text-white border-purple-600";
    }
    return optionColors[index] + " text-white";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">Question {currentQuestion}</Badge>
          {question.difficulty && (
            <Badge
              variant={question.difficulty === "Easy" ? "secondary" : "default"}
            >
              {question.difficulty}
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl text-gray-900">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswerSelect?.(index)}
              disabled={isInstructor || selectedAnswer !== undefined}
              className={`p-6 h-auto text-left justify-start text-wrap ${getOptionStyle(
                index
              )}`}
              variant="outline"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
