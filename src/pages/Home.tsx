<<<<<<< Updated upstream
import { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> Stashed changes
import { Outlet } from 'react-router-dom';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';

<<<<<<< Updated upstream
// Type Definitions
=======
// Type definitions
>>>>>>> Stashed changes
interface SelectedApp {
  id: number;
  name: string;
  logo: string;
  description: string;
<<<<<<< Updated upstream
  [key: string]: any;
=======
>>>>>>> Stashed changes
}

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
<<<<<<< Updated upstream
    const storedSelectedApp: string | null = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed: SelectedApp = JSON.parse(storedSelectedApp);
=======
    const storedSelectedApp = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed = JSON.parse(storedSelectedApp) as SelectedApp;
>>>>>>> Stashed changes
        setSelectedApp(parsed);
      } catch (error) {
        console.error('Error parsing stored selected app:', error);
        // Set Digital Shelf IQ as default if parsing fails
<<<<<<< Updated upstream
        const defaultApp: SelectedApp = {
=======
        setSelectedApp({
>>>>>>> Stashed changes
          id: 1,
          name: 'Digital Shelf IQ',
          logo: '/app_logos/icon.png',
          description: 'Product visibility analytics'
<<<<<<< Updated upstream
        };
        setSelectedApp(defaultApp);
      }
    } else {
      const defaultApp: SelectedApp = {
=======
        });
      }
    } else {
      setSelectedApp({
>>>>>>> Stashed changes
        id: 1,
        name: 'Digital Shelf IQ',
        logo: '/app_logos/icon.png',
        description: 'Product visibility analytics'
<<<<<<< Updated upstream
      };
      setSelectedApp(defaultApp);
=======
      });
>>>>>>> Stashed changes
    }
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  return (
    <>
      <style>{`
        /* Hide scrollbar for WebKit browsers */
        .scrollable::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollable {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <div className="flex h-screen overflow-hidden bg-peach transition-colors duration-300">
        {selectedApp && (
          <>
<<<<<<< Updated upstream
            <Sidebar
              isOpen={isSidebarOpen}
              selectedApp={selectedApp}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
=======
            <Sidebar isOpen={isSidebarOpen} selectedApp={selectedApp} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
>>>>>>> Stashed changes
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar
                isSidebarOpen={isSidebarOpen}
                isLoggedIn={isLoggedIn}
                setIsSidebarOpen={setIsSidebarOpen}
                selectedApp={selectedApp}
                setSelectedApp={setSelectedApp}
              />
              <div className="p-0">
                {isLoggedIn && <Breadcrumbs />}
              </div>
              <div ref={mainRef} className="flex-1 overflow-auto p-0 scrollable">
                <Outlet />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
