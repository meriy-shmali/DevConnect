
import './App.css'
import Home from '../Home/Home';
import React, { useState } from 'react';
import Header from './components/Header';
import PostCard from './components/PostCard';
import NotificationSidebar from './components/NotificationSidebar';
import ChangePasswordForm from './components/ChangePasswordForm';
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <>
     <div className="min-h-screen bg-gray-100 font-sans">
      <Header onNotificationClick={toggleSidebar} />
      <main className="flex-grow">
      {/* <ChangePasswordForm/>*/}
        {/*
        <div className="flex-grow min-h-[calc(100vh-64px)] overflow-y-auto p-4 lg:p-8">
          <PostCard />
        </div>*/}
        {/*
        <NotificationSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        */}
      </main>
    </div>
    </>
  )
}

export default App
