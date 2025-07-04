import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Play } from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerateQuiz = async () => {
    if (!prompt || !questionCount || !timePerQuestion) return;

    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const res = await fetch("http://localhost:8080/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          numQuestions: parseInt(questionCount),
        }),
      });

      const data = await res.json();
      console.log("Quiz response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      if (!data.quiz || !Array.isArray(data.quiz)) {
        throw new Error("Invalid quiz format returned");
      }

      const quizWithMeta = data.quiz.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswerIndex,
        difficulty: "Easy", // Add actual difficulty later if needed
      }));

      setGeneratedQuestions(quizWithMeta);
    } catch (error: any) {
      console.error("Frontend error:", error.message || error);
      alert("Failed to generate quiz. Please check the console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = () => {
    navigate("/instructor/waiting-room", {
      state: { questions: generatedQuestions },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create AI Quiz
        </h1>
        <p className="text-gray-600">
          Generate engaging quizzes with AI assistance
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>Quiz Configuration</span>
            </CardTitle>
            <CardDescription>
              Describe your quiz topic and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Prompt
              </label>
              <Textarea
                placeholder="e.g., A quiz about World War 2 focusing on major events and key figures"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time per Question
              </label>
              <Select
                value={timePerQuestion}
                onValueChange={setTimePerQuestion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateQuiz}
              disabled={
                !prompt || !questionCount || !timePerQuestion || isGenerating
              }
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Quiz...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Quiz</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Preview</CardTitle>
            <CardDescription>
              Generated questions will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedQuestions.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedQuestions.map((q, index) => (
                      <TableRow key={q.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {q.question}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              q.difficulty === "Easy" ? "secondary" : "default"
                            }
                          >
                            {q.difficulty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  onClick={handleStartQuiz}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generate a quiz to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Create;
