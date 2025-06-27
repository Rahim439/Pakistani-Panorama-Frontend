// src/components/UserDropdown/UserDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Settings, LogOut, ChevronDown, MapPin } from "lucide-react";

interface User {
  id: string;
  name: string;
}

interface UserDropdownProps {
  user: User;
}

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const navigateToProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pr-3 pl-1.5 py-1.5 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all duration-300 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white shadow-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-4.5 h-4.5"
          >
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-gray-700 font-medium text-sm">{user.name}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 group-hover:text-green-600 transition-all duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-100 overflow-hidden animate-fadeIn">
          {/* User info header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="font-medium text-gray-800">Hello, {user.name}!</p>
            <p className="text-xs text-gray-500 mt-0.5">Welcome to Pakistani Panorama</p>
          </div>
          
          <div className="py-1">
            <button
              onClick={navigateToProfile}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserIcon size={16} className="mr-3 text-gray-500" />
              <span>Your Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} className="mr-3 text-gray-500" />
              <span>Settings</span>
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="mr-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};