import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const socket = io("http://localhost:8080");

const Join = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Success handler
    socket.on("join-success", () => {
      toast({
        title: "Successfully Joined!",
        description: `Welcome ${playerName}! Get ready to play.`,
      });
      navigate("/student/quiz", {
        state: { playerName, gameCode },
      });
    });

    // Error handler
    socket.on("join-error", (msg: string) => {
      toast({
        title: "Join Error",
        description: msg,
        variant: "destructive",
      });
      setIsJoining(false);
    });

    return () => {
      socket.off("join-success");
      socket.off("join-error");
    };
  }, [playerName, gameCode, navigate, toast]);

  const handleJoinQuiz = () => {
    if (!gameCode || !playerName) {
      toast({
        title: "Missing Information",
        description: "Please enter both game code and your name.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    socket.emit("join-game", {
      gameCode: gameCode.toUpperCase(),
      name: playerName,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Quiz</h1>
          <p className="text-gray-600">
            Enter the game code to join the live quiz
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
            <CardDescription>
              Get the game code from your instructor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Game Code
              </label>
              <Input
                placeholder="Enter 6-digit game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Hint: Try "ABC123" for demo
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-lg"
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleJoinQuiz}
              disabled={!gameCode || !playerName || isJoining}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              size="lg"
            >
              {isJoining ? (
                "Joining..."
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-5 w-5" />
                  <span>Join Quiz</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">How to Join:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Get the game code from your instructor</li>
              <li>2. Enter your name (this will be shown on leaderboard)</li>
              <li>3. Click "Join Quiz" to enter the game</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
