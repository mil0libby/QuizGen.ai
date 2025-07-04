
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              QuizMaster AI
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {location.pathname !== "/" && (
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
