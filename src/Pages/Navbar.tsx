import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../auth/AuthContext";
import { UserDropdown } from "../components/UserDropdown/UserDropdown";
import {
  X,
  Menu,
  User,
  LogOut,
  MapPin,
  Home,
  Mountain,
  Building2,
  Camera,
  Phone,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, loading, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Nature", icon: Mountain, path: "/nature" },
    { name: "Attractions", icon: Building2, path: "/attractions" },
    { name: "Virtual Tours", icon: Camera, path: "/virtual-tours" },
    { name: "Emergency Help", icon: Phone, path: "/emergency" },
  ];

  const handleSignIn = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* spacer to prevent jump */}
      <div className={isScrolled ? "h-16 md:h-20" : "h-0"} />

      <header className={
        `fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300
        ${isScrolled ? "" : "relative"}`
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500 group-hover:shadow-opacity-25 transition-all duration-300 group-hover:scale-105">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="font-display">
                <span className="text-xl font-bold text-gray-900 tracking-tight">Pakistani</span>
                <span className="text-sm font-medium text-green-600 ml-1">Panorama</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 transition-all duration-200 font-medium text-sm group 
                      ${isActive ? 'bg-green-50 text-green-600' : 'hover:text-green-600 hover:bg-green-50 hover:bg-opacity-80'}`
                    }
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-sans">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {!loading && (
                <div className="hidden sm:inline-flex">
                  {isAuthenticated && user ? (
                    <UserDropdown user={{ id: user._id, name: user.userName }} />
                  ) : (
                    <Button onClick={handleSignIn} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-medium font-sans shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                      Sign in
                    </Button>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 hover:bg-opacity-80 transition-all duration-200 font-medium font-sans group w-full text-left"
                  >
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                  </button>
                ))}
                <div className="pt-3 px-4">
                  {!loading && (
                    isAuthenticated && user ? (
                      <div className="flex flex-col space-y-2">
                        <button
                          className="w-full py-2 px-4 text-gray-700 rounded-full border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-300"
                          onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                        >
                          <User size={18} />
                          <span>Profile</span>
                        </button>
                        <button
                          className="w-full py-2 px-4 text-white bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center gap-2 transition duration-300"
                          onClick={handleLogout}
                        >
                          <LogOut size={18} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    ) : (
                      <Button onClick={handleSignIn} className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium font-sans shadow-lg">
                        Sign in
                      </Button>
                    )
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;