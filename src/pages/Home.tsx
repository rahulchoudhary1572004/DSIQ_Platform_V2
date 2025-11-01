import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { gsap } from 'gsap';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';

// Type Definitions
interface SelectedApp {
  id: number;
  name: string;
  logo: string;
  description: string;
  [key: string]: any;
}

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<SelectedApp | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSelectedApp: string | null = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed: SelectedApp = JSON.parse(storedSelectedApp);
        setSelectedApp(parsed);
      } catch (error) {
        console.error('Error parsing stored selected app:', error);
        // Set Digital Shelf IQ as default if parsing fails
        const defaultApp: SelectedApp = {
          id: 1,
          name: 'Digital Shelf IQ',
          logo: '/app_logos/icon.png',
          description: 'Product visibility analytics'
        };
        setSelectedApp(defaultApp);
      }
    } else {
      const defaultApp: SelectedApp = {
        id: 1,
        name: 'Digital Shelf IQ',
        logo: '/app_logos/icon.png',
        description: 'Product visibility analytics'
      };
      setSelectedApp(defaultApp);
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
            <Sidebar
              isOpen={isSidebarOpen}
              selectedApp={selectedApp}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
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
