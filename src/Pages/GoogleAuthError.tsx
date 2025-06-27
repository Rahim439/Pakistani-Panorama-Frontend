import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GoogleAuthError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Google Authentication Failed</h2>
        <p className="text-gray-600 mb-4">
          We couldn't authenticate you with Google. Please try again or use another login method.
        </p>
        <Link 
          to="/login" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Back to Login
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Redirecting to login page automatically...
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthError; 