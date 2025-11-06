import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'investor':
        return '/investor';
      case 'startup':
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-ayush-green" />
          <span className="font-bold text-xl">AYUSH Portal</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link to="/about" className="text-sm font-medium hover:text-ayush-green transition-colors">
            About
          </Link>
          
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to={getDashboardLink()}>Dashboard</Link>
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/auth-selection">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth-selection">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}