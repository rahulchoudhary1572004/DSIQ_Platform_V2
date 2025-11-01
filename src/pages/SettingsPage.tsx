import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Users, History, Database, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { fetchRoles } from '../redux/slices/rolesSlice';
import UsersList from '../components/SettingPage/UsersList';
import DataExport from '../components/SettingPage/DataExport';
import ActivityLogs from '../components/SettingPage/ActivityLogs';
import CreateRoles from '../components/SettingPage/CreateRoles';
import PrivacyPreferences from '../components/SettingPage/PrivacyPreferences';
import BackupRestore from '../components/SettingPage/BackupRestore';
import WelcomeScreen from '../components/SettingPage/WelcomeScreen';
import RolesManagement from '../components/SettingPage/RolesManagement';
import Navbar from '../components/Navbar';
import '@progress/kendo-theme-default/dist/all.css';

// Type Definitions
interface Role {
  id: string;
  name: string;
  [key: string]: any;
}

interface ExpandedSections {
  'user-management': boolean;
  'activity-history': boolean;
  'data-management': boolean;
}

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  archiveFilter: string;
}

interface AuthState {
  isLoggedIn: boolean;
}

interface RootState {
  roles: RolesState;
  auth: AuthState;
}

type SubSection = 'users' | 'roles' | 'activity-logs' | 'data-export' | 'privacy-preferences' | 'backup-restore' | '';
type MainSection = 'user-management' | 'activity-history' | 'data-management' | '';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { roles, loading: loadingRoles, error: rolesError, archiveFilter } = useSelector((state: RootState) => state.roles);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  
  const [activeSection, setActiveSection] = useState<MainSection>('');
  const [activeSubSection, setActiveSubSection] = useState<SubSection>('');
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    'user-management': false,
    'activity-history': false,
    'data-management': false,
  });
  const [showCreateRoleForm, setShowCreateRoleForm] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRoles(archiveFilter === 'archived') as any);

    // Restore saved navigation state on component mount
    const savedActiveSection: string | null = localStorage.getItem('settings-activeSection');
    const savedActiveSubSection: string | null = localStorage.getItem('settings-activeSubSection');
    const savedExpandedSections: string | null = localStorage.getItem('settings-expandedSections');

    if (savedActiveSection) {
      setActiveSection(savedActiveSection as MainSection);
    }
    
    if (savedActiveSubSection) {
      setActiveSubSection(savedActiveSubSection as SubSection);
    }
    
    if (savedExpandedSections) {
      try {
        const parsedExpandedSections: ExpandedSections = JSON.parse(savedExpandedSections);
        setExpandedSections(parsedExpandedSections);
      } catch (error) {
        console.error('Error parsing saved expanded sections:', error);
      }
    }
  }, [dispatch, archiveFilter]);

  const toggleSection = (section: MainSection): void => {
    const newExpandedSections: ExpandedSections = {
      ...expandedSections,
      [section]: !expandedSections[section],
    };
    setExpandedSections(newExpandedSections);
    setActiveSection(section);
    
    // Save expanded sections to localStorage
    localStorage.setItem('settings-expandedSections', JSON.stringify(newExpandedSections));
    localStorage.setItem('settings-activeSection', section);
  };

  const handleSubSectionClick = (section: MainSection, subSection: SubSection): void => {
    setActiveSection(section);
    setActiveSubSection(subSection);
    const newExpandedSections: ExpandedSections = {
      ...expandedSections,
      [section]: true,
    };
    setExpandedSections(newExpandedSections);
    setShowCreateRoleForm(false);
    
    // Save state to localStorage
    localStorage.setItem('settings-activeSection', section);
    localStorage.setItem('settings-activeSubSection', subSection);
    localStorage.setItem('settings-expandedSections', JSON.stringify(newExpandedSections));
  };

  const handleGetStarted = (): void => {
    const newExpandedSections: ExpandedSections = {
      ...expandedSections,
      'user-management': true,
    };
    setExpandedSections(newExpandedSections);
    setActiveSection('user-management');
    setActiveSubSection('users');
    
    // Save state to localStorage
    localStorage.setItem('settings-activeSection', 'user-management');
    localStorage.setItem('settings-activeSubSection', 'users');
    localStorage.setItem('settings-expandedSections', JSON.stringify(newExpandedSections));
  };

  const handleCreateRole = (): void => {
    setShowCreateRoleForm(true);
  };

  const handleRoleCreated = (): void => {
    dispatch(fetchRoles(archiveFilter === 'archived') as any);
  };

  const renderContent = (): ReactNode => {
    if (activeSubSection === 'roles' && showCreateRoleForm) {
      return (
        <CreateRoles
          onCancel={() => setShowCreateRoleForm(false)}
          onRoleCreated={handleRoleCreated}
        />
      );
    }
    switch (activeSubSection) {
      case 'users':
        return <UsersList />;
      case 'roles':
        return (
          <RolesManagement
            onCreateRole={handleCreateRole}
            loadingRoles={loadingRoles}
            rolesError={rolesError}
          />
        );
      case 'activity-logs':
        return <ActivityLogs />;
      case 'data-export':
        return <DataExport />;
      case 'privacy-preferences':
        return <PrivacyPreferences />;
      case 'backup-restore':
        return <BackupRestore />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="flex h-screen bg-cream font-sans">
        {/* Sidebar */}
        <div className="w-64 lg:w-72 xl:w-80 bg-white border-r border-light-gray overflow-y-auto flex-shrink-0 z-10">
          <div className="p-4 border-b border-light-gray flex items-center">
            <div className="relative group flex items-center">
              <button
                onClick={handleBack}
                className="mr-2 transition-transform duration-200 group-hover:-translate-x-0.5 flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5 text-gray" />
              </button>
              <span className="absolute -top-6 left-1/2 mt-1 transform -translate-x-1/2 px-2 py-1 bg-dark-gray text-white text-small rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-md">
                Back
              </span>
            </div>
            <h1 className="text-h2 font-sans text-dark-gray">Settings</h1>
          </div>

          <nav className="p-2">
            <div className="mb-1">
              <button
                onClick={() => toggleSection('user-management')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-peach ${
                  activeSection === 'user-management'
                    ? 'bg-primary-orange text-white'
                    : 'text-dark-gray'
                }`}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-button font-sans">User Management</span>
                </div>
                {expandedSections['user-management'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedSections['user-management'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('user-management', 'users')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'users' ? 'bg-primary-orange text-white' : 'text-gray'
                    }`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => handleSubSectionClick('user-management', 'roles')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'roles' ? 'bg-primary-orange text-white' : 'text-gray'
                    }`}
                  >
                    Roles
                  </button>
                </div>
              )}
            </div>
            <div className="mb-1">
              <button
                onClick={() => toggleSection('activity-history')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-peach ${
                  activeSection === 'activity-history'
                    ? 'bg-primary-orange text-white'
                    : 'text-dark-gray'
                }`}
              >
                <div className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  <span className="text-button font-sans">Activity History</span>
                </div>
                {expandedSections['activity-history'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedSections['activity-history'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('activity-history', 'activity-logs')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'activity-logs'
                        ? 'bg-primary-orange text-white'
                        : 'text-gray'
                    }`}
                  >
                    Activity Logs
                  </button>
                </div>
              )}
            </div>
            <div className="mb-1">
              <button
                onClick={() => toggleSection('data-management')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-peach ${
                  activeSection === 'data-management'
                    ? 'bg-primary-orange text-white'
                    : 'text-dark-gray'
                }`}
              >
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  <span className="text-button font-sans">Data Management</span>
                </div>
                {expandedSections['data-management'] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {expandedSections['data-management'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'data-export')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'data-export'
                        ? 'bg-primary-orange text-white'
                        : 'text-gray'
                    }`}
                  >
                    Data Export
                  </button>
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'privacy-preferences')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'privacy-preferences'
                        ? 'bg-primary-orange text-white'
                        : 'text-gray'
                    }`}
                  >
                    Privacy Preferences
                  </button>
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'backup-restore')}
                    className={`flex items-center w-full p-2 text-small rounded-md hover:bg-peach ${
                      activeSubSection === 'backup-restore'
                        ? 'bg-primary-orange text-white'
                        : 'text-gray'
                    }`}
                  >
                    Backup & Restore
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 xl:p-8 max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
