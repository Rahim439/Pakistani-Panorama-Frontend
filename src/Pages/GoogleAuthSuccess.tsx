import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const GoogleAuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          setError('Authentication token not found');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Call your API to get user details using the token
        const response = await fetch('/api/v1/users/current-user', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          // Login the user with the received data
          login(data.data);
          navigate('/', { replace: true });
        } else {
          setError(data.message || 'Failed to get user information');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error("Error in Google auth success page:", err);
        setError('Error connecting to server');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    fetchUserData();
  }, [login, navigate, location]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      {error ? (
        <div className="text-red-500 mb-4 text-center">
          <p>{error}</p>
          <p className="mt-2 text-gray-600">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Logging you in...</p>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthSuccess; 