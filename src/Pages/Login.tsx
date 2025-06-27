import React, { useState } from "react";
import { LoginSchema } from "../Validation/Schemas/LoginSchema";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "../components/LoginWithGoogle/GoogleLoginButton";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loginError, setLoginError] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeOnLoginFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const checkLoginValidation = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = LoginSchema.safeParse(loginFormData);
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setLoginError(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Sending login request...');
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginFormData.email,
          password: loginFormData.password
        })
      });
      
      // Handle non-JSON responses
      if (!response.ok) {
        const errorText = await response.text();
        
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(errorText);
          // Determine if it's an email or password error
          if (errorData.message.toLowerCase().includes('email') || 
              errorData.message.toLowerCase().includes('user not found')) {
            setLoginError({ email: [errorData.message] });
          } else if (errorData.message.toLowerCase().includes('password')) {
            setLoginError({ password: [errorData.message] });
          } else {
            setLoginError({ email: [errorData.message] });
          }
        } catch (e) {
          // If not JSON, analyze text content to determine field
          if (errorText.toLowerCase().includes('email') || 
              errorText.toLowerCase().includes('user not found')) {
            setLoginError({ email: [errorText] });
          } else if (errorText.toLowerCase().includes('password')) {
            setLoginError({ password: [errorText] });
          } else {
            setLoginError({ email: [errorText] });
          }
        }
        setIsLoading(false);
        return;
      }
      
      const text = await response.text();
      if (!text) {
        setLoginError({ email: ["Server returned an empty response"] });
        setIsLoading(false);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setLoginError({ email: ["Server returned invalid data"] });
        setIsLoading(false);
        return;
      }
      
      if (data.success) {
        setLoginError({});
        login(data.data.user);
        navigate('/'); // Redirect to home page after successful login
      } else {
        // Check message content to determine which field to display error under
        if (data.message.toLowerCase().includes('email') || 
            data.message.toLowerCase().includes('user not found')) {
          setLoginError({ email: [data.message] });
        } else if (data.message.toLowerCase().includes('password')) {
          setLoginError({ password: [data.message] });
        } else {
          // Default to email field for general errors
          setLoginError({ email: [data.message] });
        }
      }
    } catch (error) {
      setLoginError({ email: ["Server error, please try again later"] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12 items-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="flex flex-col md:flex-row border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Form Section */}
        <div className="flex flex-col justify-center bg-white w-full md:w-1/2 p-6 md:p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h2>
            
            <div>
              <label htmlFor="email" className="text-gray-700 text-sm font-medium mb-1 block">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginFormData.email}
                onChange={handleChangeOnLoginFormData}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full h-10"
                placeholder="Enter your email"
              />
              <div className="h-5 mt-1">
                {loginError.email && (
                  <p className="text-red-500 text-xs">{loginError.email[0]}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="text-gray-700 text-sm font-medium mb-1 block">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleChangeOnLoginFormData}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full h-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              <div className="h-5 mt-1">
                {loginError.password && (
                  <p className="text-red-500 text-xs">{loginError.password[0]}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-800">
                Forgot Password?
              </Link>
            </div>
            
            <button
              onClick={checkLoginValidation}
              disabled={isLoading}
              className="px-4 py-2 h-10 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 w-full font-medium"
            >
              {isLoading ? "Processing..." : "Login"}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <GoogleLoginButton />
            
            <p className="text-center text-xs mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-800">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Image/Welcome Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 bg-green-500">
          <h2 className="text-2xl font-semibold text-white text-center">
            Welcome Back!
          </h2>
          <p className="text-white mt-3 text-center text-sm">
            Sign in to continue your journey with Pakistani Panorama
          </p>
          <Link to="/signup">
            <button className="mt-6 px-5 py-2 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-100 transition duration-200 text-sm">
              Register Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 