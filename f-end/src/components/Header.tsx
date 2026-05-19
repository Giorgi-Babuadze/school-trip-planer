import { Bus, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { href: "#destinations", label: "Destinations" },
    { href: "#services", label: "Services" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#contact", label: "Contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const id = href.replace("#", "");
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePlanTrip = () => {
    if (user?.role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/plan-trip');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-display font-bold text-foreground">SchoolTrip</span>
              <span className="text-lg font-display font-bold text-gradient">.ge</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button & User Info */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/chatbot')}>
                  Chat Bot
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (user?.role === 'admin') {
                      navigate('/dashboard');
                    } else {
                      navigate('/my-trips');
                    }
                  }}
                >
                  {user?.role === 'admin' ? 'Dashboard' : 'My Trips'}
                </Button>
                <span className="text-muted-foreground">Welcome, <span className="font-semibold text-foreground">{user?.name}</span></span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="hero" size="lg" onClick={handlePlanTrip}>
                  Plan Your Trip
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted-foreground hover:text-foreground font-medium py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => { navigate('/chatbot'); setIsMenuOpen(false); }}
                  >
                    Chat Bot
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      if (user?.role === 'admin') {
                        navigate('/dashboard');
                      } else {
                        navigate('/my-trips');
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    {user?.role === 'admin' ? 'Dashboard' : 'My Trips'}
                  </Button>
                  <div className="py-2 text-muted-foreground">
                    Welcome, <span className="font-semibold text-foreground">{user?.name}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                    Login
                  </Button>
                  <Button variant="hero" className="w-full" onClick={() => { handlePlanTrip(); setIsMenuOpen(false); }}>
                    Plan Your Trip
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;