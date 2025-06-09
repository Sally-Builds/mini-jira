import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, User, CheckSquare } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="glass-card border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold gradient-text">
                TaskFlow
              </h1>
            </div>

            {user && (
              <div className="flex flex-row sm:items-center justify-end sm:space-x-4 gap-2 sm:gap-0">
                <div className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/50 rounded-lg order-1 sm:order-none overflow-hidden">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="h-[34px] sm:h-9 bg-white/50 hover:bg-white/70 border-white/30 px-2 sm:px-3 order-2 sm:order-none"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
