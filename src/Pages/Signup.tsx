import React, { useState } from "react";
import { RegistrationSchema } from "../Validation/Schemas/RegisterationSchema";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [registrationFormData, setRegistrationFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [registrationError, setRegistrationError] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangeOnRegistrationFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationFormData({
      ...registrationFormData,
      [event.target.name]: event.target.value,
    });
  };

  const checkRegistrationValidation = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = RegistrationSchema.safeParse(registrationFormData);
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setRegistrationError(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: registrationFormData.username,
          email: registrationFormData.email,
          password: registrationFormData.password,
          confirmPassword: registrationFormData.confirmPassword
        })
      });
      
      // For non-JSON responses
      if (!response.ok) {
        const errorText = await response.text();
        
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(errorText);
          // Place error message in appropriate field
          if (errorData.message.toLowerCase().includes('email')) {
            setRegistrationError({ email: [errorData.message] });
          } else if (errorData.message.toLowerCase().includes('username') || 
                     errorData.message.toLowerCase().includes('userName')) {
            setRegistrationError({ username: [errorData.message] });
          } else if (errorData.message.toLowerCase().includes('password')) {
            setRegistrationError({ password: [errorData.message] });
          } else {
            setRegistrationError({ general: [errorData.message] });
          }
        } catch (e) {
          // Parse plain text errors
          if (errorText.toLowerCase().includes('email')) {
            setRegistrationError({ email: [errorText] });
          } else if (errorText.toLowerCase().includes('username') || 
                     errorText.toLowerCase().includes('userName')) {
            setRegistrationError({ username: [errorText] });
          } else if (errorText.toLowerCase().includes('password')) {
            setRegistrationError({ password: [errorText] });
          } else {
            setRegistrationError({ general: [errorText] });
          }
        }
        setIsLoading(false);
        return;
      }
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        setRegistrationError({ general: ["Server returned invalid data"] });
        setIsLoading(false);
        return;
      }
      
      if (data.success) {
        setRegistrationError({});
        alert("Registration successful! You can now login.");
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        // Place error message in appropriate field based on content
        if (data.message.toLowerCase().includes('email')) {
          setRegistrationError({ email: [data.message] });
        } else if (data.message.toLowerCase().includes('username') || 
                   data.message.toLowerCase().includes('userName')) {
          setRegistrationError({ username: [data.message] });
        } else if (data.message.toLowerCase().includes('password')) {
          setRegistrationError({ password: [data.message] });
        } else {
          setRegistrationError({ general: [data.message] });
        }
      }
    } catch (error) {
      setRegistrationError({ general: ["Server error, please try again later"] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12 items-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="flex flex-col md:flex-row-reverse border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Form Section */}
        <div className="flex flex-col justify-center bg-white w-full md:w-1/2 p-6 md:p-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Account</h2>
            
            <div>
              <label htmlFor="username" className="text-gray-700 text-sm font-medium mb-1 block">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={registrationFormData.username}
                onChange={handleChangeOnRegistrationFormData}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full h-10"
                placeholder="Enter your username"
              />
              <div className="h-5 mt-1">
                {registrationError.username && (
                  <p className="text-red-500 text-xs">{registrationError.username[0]}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="text-gray-700 text-sm font-medium mb-1 block">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registrationFormData.email}
                onChange={handleChangeOnRegistrationFormData}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full h-10"
                placeholder="Enter your email"
              />
              <div className="h-5 mt-1">
                {registrationError.email && (
                  <p className="text-red-500 text-xs">{registrationError.email[0]}</p>
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
                  value={registrationFormData.password}
                  onChange={handleChangeOnRegistrationFormData}
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
                {registrationError.password && (
                  <p className="text-red-500 text-xs">{registrationError.password[0]}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium mb-1 block">Confirm Password:</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registrationFormData.confirmPassword}
                  onChange={handleChangeOnRegistrationFormData}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full h-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              <div className="h-5 mt-1">
                {registrationError.confirmPassword && (
                  <p className="text-red-500 text-xs">{registrationError.confirmPassword[0]}</p>
                )}
              </div>
            </div>
            
            {/* General error message for registration */}
            {registrationError.general && (
              <div className="h-5">
                <p className="text-red-500 text-xs">{registrationError.general[0]}</p>
              </div>
            )}
            
            <button
              onClick={checkRegistrationValidation}
              disabled={isLoading}
              className="mt-3 px-4 py-2 h-10 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 w-full font-medium"
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
            
            <p className="text-center text-xs mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-800">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Image/Welcome Section */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 bg-green-500">
          <h2 className="text-2xl font-semibold text-white text-center">
            Join Our Community!
          </h2>
          <p className="text-white mt-3 text-center text-sm">
            Create an account to explore the beauty of Pakistani Panorama
          </p>
          <Link to="/login">
            <button className="mt-6 px-5 py-2 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-100 transition duration-200 text-sm">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 