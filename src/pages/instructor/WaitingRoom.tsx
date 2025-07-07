import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Play, Copy, Check } from "lucide-react";
import socket from "@/lib/socket"; // adjust path if needed

const WaitingRoom = () => {
  const navigate = useNavigate();
  const [gameCode] = useState("ABC555"); // Make sure this matches your backend/game code flow
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Get questions passed from Create
  const questions = location.state?.questions;
  const time = location.state?.time;

  if (!questions) {
    // No questions? Redirect back to create or handle error
    navigate("/create");
    return null;
  }

  useEffect(() => {
    // Join the game room as Instructor
    socket.emit("join-game", { gameCode, name: "Instructor" });

    // Listen for player list updates from the server
    socket.on("players-updated", (players) => {
      setPlayers(players);
    });

    // Cleanup on unmount
    return () => {
      socket.off("players-updated");
    };
  }, [gameCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy");
    }
  };

  const handleStartQuiz = () => {
    socket.emit("start-game", { gameCode, time });

    console.log("game starting");
    navigate("/instructor/host", {
      state: { questions: questions, time: time },
    });
    setTimeout(() => {
      socket.emit("send-question", {
        gameCode,
        question: questions[0],
      });
    }, 1000); // 1 second delay to give students time to mount
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Waiting for Players
        </h1>
        <p className="text-gray-600">Share the game code with your students</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800">
              Game Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-purple-600 tracking-wider">
              {gameCode}
            </div>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl text-green-800">
              <Users className="h-6 w-6" />
              <span>Players Joined</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-green-600">
              {players.length - 1}
            </div>
            <div className="space-y-2">
              {players.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {players
                    .filter((player) => {
                      return player.name != "Instructor";
                    })
                    .slice(0, 8)
                    .map((player) => (
                      <Badge
                        key={player.id}
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {player.name}
                      </Badge>
                    ))}
                  {players.length > 8 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      +{players.length - 8} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={handleStartQuiz}
          disabled={players.length - 1 === 0}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xl px-8 py-4"
        >
          <Play className="h-6 w-6 mr-3" />
          Start Quiz ({players.length - 1} players)
        </Button>
        {players.length === 0 && (
          <p className="text-gray-500 mt-2">
            Waiting for at least 1 player to join...
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 font-medium">
              Students can join at:{" "}
              <span className="font-bold">yourapp.com/student/join</span>
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Or they can scan the QR code (feature coming soon)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaitingRoom;
