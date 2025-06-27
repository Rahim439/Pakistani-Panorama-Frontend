import { Routes, Route } from 'react-router-dom'; // Import Routes and Route for routing
import SearchBar from './components/SearchBar/Searchbar';
import HotelSearch from './components/HotelSearch/HotelSearch';
import ChatBot from './components/Chatbot/Chatbot';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import UserProfile from './Pages/UserProfile';
import PageNotFound from './Pages/PageNotFound';
import GoogleAuthSuccess from './Pages/GoogleAuthSuccess';
import GoogleAuthError from './Pages/GoogleAuthError';
import Emergency from './Pages/Emergency';
import VirtualTour from './Pages/VirtualTour';
import Homepage from './Pages/Homepage';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Loader from './components/Loader/Loader';
import NaturePage from './Pages/NaturePage';
import Attractions from './Pages/Attractions';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="font-sans">
      <Routes>
        {/* Google Auth Routes - These need to be outside the Layout */}
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        <Route path="/auth/google/error" element={<GoogleAuthError />} />
        
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          {/* Home and General Routes */}
          <Route index element={<Homepage />} />
          
          {/* Navigation Menu Routes */}
          <Route path="/nature" element={<NaturePage />} />
          {/* Will be replaced with Destinations component when created */}
          <Route path="/virtual-tours" element={<VirtualTour />} /> {/* Will be replaced with VirtualTours component when created */}
          <Route path="/attractions" element={<Attractions />} /> {/* Will be replaced with Attractions component when created */}
          <Route path="/bookings" element={<Features/>} /> {/* Will be replaced with Bookings component when created */}
          <Route path="/emergency" element={<Emergency />} /> {/* Will be replaced with Emergency component when created */}
          
          {/* Other General Routes */}
          <Route path="/lahore" element={<SearchBar />} />
          <Route path="/things-to-do" element={<SearchBar />} />
          <Route path="/restaurants" element={<SearchBar />} />
          <Route path="/flights" element={<SearchBar />} />
          
          {/* Auth Routes - Now inside the Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/hotels" 
            element={
              <ProtectedRoute>
                <HotelSearch />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Support Routes from Footer */}
          <Route path="/help" element={<SearchBar />} /> {/* Will be replaced with Help component when created */}
          <Route path="/faq" element={<SearchBar />} /> {/* Will be replaced with FAQ component when created */}
          <Route path="/contact" element={<SearchBar />} /> {/* Will be replaced with Contact component when created */}
          
          {/* This catch-all route should be the very last route */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ChatBot/>
    </div>
  );
};

export default App;