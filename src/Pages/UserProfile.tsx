import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/v1/users/profile', {
          method: 'GET',
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError("Failed to fetch user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default UserProfile; 