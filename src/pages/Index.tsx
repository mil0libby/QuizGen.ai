
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PlusCircle, Brain, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QuizMaster AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create AI-powered quizzes instantly and engage your audience in real-time
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <Brain className="h-5 w-5" />
              <span>AI-Generated</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Zap className="h-5 w-5" />
              <span>Real-time</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-white/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Instructor</CardTitle>
              <CardDescription className="text-purple-100">
                Create and host AI-powered quizzes for your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/instructor/create">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  Create Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-white/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-blue-100">
                Join live quizzes and compete with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student/join">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Join Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
