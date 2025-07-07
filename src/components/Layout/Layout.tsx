import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Pages/Navbar';
import Footer from '../Footer/Footer';
import { Analytics } from "@vercel/analytics/next"
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Analytics />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 