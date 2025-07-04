
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InstructorCreate from "./pages/instructor/Create";
import InstructorWaitingRoom from "./pages/instructor/WaitingRoom";
import InstructorHost from "./pages/instructor/Host";
import StudentJoin from "./pages/student/Join";
import StudentQuiz from "./pages/student/Quiz";
import StudentLeaderboard from "./pages/student/Leaderboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/instructor/create" element={<InstructorCreate />} />
            <Route path="/instructor/waiting-room" element={<InstructorWaitingRoom />} />
            <Route path="/instructor/host" element={<InstructorHost />} />
            <Route path="/student/join" element={<StudentJoin />} />
            <Route path="/student/quiz" element={<StudentQuiz />} />
            <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
