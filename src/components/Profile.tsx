import React, { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import { Camera, Calendar, MapPin, Briefcase, Mail, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  updateProfile,
  selectProfile,
  selectProfileStatus,
  selectProfileError,
  selectIsProfileLoading,
  selectIsUpdateLoading,
} from '../redux/slices/profileSlice';
import Footer from './Footer';

// Type Definitions
interface ProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  country_name?: string;
  role_name?: string;
  profile_photo_url?: string;
  bio?: string;
  marriage_anniversary?: string;
  is_active?: boolean;
  is_verified?: boolean;
  [key: string]: any;
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isVerified: boolean;
}

interface ProfileProps {
  isLoggedIn: boolean;
}

const initialProfile: ProfileData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  country_name: '',
  role_name: '',
  profile_photo_url:
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
};

// Editable Field Component
const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  type = 'text',
  placeholder = '',
  className = '',
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value || '');

  const handleBlur = (): void => {
    setIsEditing(false);
    if (value !== localValue) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !multiline) {
      (e.target as HTMLInputElement).blur();
    }
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  if (isEditing) {
    return multiline ? (
      <textarea
        value={localValue}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-cream text-dark-gray border border-light-gray rounded-lg p-3 focus:ring-2 focus:ring-primary-orange focus:outline-none transition ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    ) : (
      <input
        type={type}
        value={localValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-cream text-dark-gray border border-light-gray rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-orange focus:outline-none transition ${className}`}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-text hover:bg-peach rounded-lg p-2 transition text-body min-h-[2rem] flex items-center"
    >
      {value || <span className="text-gray italic">{placeholder}</span>}
    </div>
  );
};

// Main Profile Component
const Profile: React.FC<ProfileProps> = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const profileData: ProfileData = useSelector(selectProfile) || initialProfile;
  const status: string = useSelector(selectProfileStatus);
  const error: string | null = useSelector(selectProfileError);
  const isLoading: boolean = useSelector(selectIsProfileLoading);
  const isUpdating: boolean = useSelector(selectIsUpdateLoading);

  // Local state for profile image
  const [profileImage, setProfileImage] = useState<string>(initialProfile.profile_photo_url || '');

  // Fetch profile data when component mounts
  useEffect(() => {
    dispatch(fetchProfile() as any);
  }, [dispatch]);

  // Update profile image when Redux data loads
  useEffect(() => {
    if (profileData?.profile_photo_url) {
      setProfileImage(profileData.profile_photo_url);
    }
  }, [profileData]);

  const handleSaveField = async (field: string, value: string): Promise<void> => {
    try {
      await dispatch(updateProfile({ [field]: value }) as any).unwrap();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onloadend = (): void => {
        const newImage: string = reader.result as string;
        setProfileImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const [passwords, setPasswords] = useState<PasswordState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isVerified: false,
  });

  const handlePasswordChange = (field: keyof PasswordState, value: string): void => {
    setPasswords((prev: PasswordState) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChangeCombined = (): void => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    const mockCorrectPassword: string = 'password123';

    if (currentPassword !== mockCorrectPassword) {
      alert('Current password is incorrect');
      return;
    }

    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert('Password successfully changed!');

    setPasswords({
      currentPassword: newPassword,
      newPassword: '',
      confirmPassword: '',
      isVerified: false,
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
          <p className="text-dark-gray">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-500 text-h3 mb-4">Error loading profile</p>
          <p className="text-gray mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProfile() as any)}
            className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Create display values with fallbacks
  const displayName: string = profileData
    ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
    : '';
  const displayBio: string = '';

  return (
    <div className="min-h-screen bg-cream text-dark-gray">
      <div className="max-w-screen mx-auto">
        {/* Profile Header with Gradient Background */}
        <div className="bg-brand-gradient p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h2">Your Profile</h2>
              <p className="text-small mt-2">Manage your personal and account information</p>
            </div>
            {isUpdating && (
              <div className="flex items-center gap-2 text-white/80">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-small">Saving...</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 bg-white shadow-lg rounded-b-xl p-6 mb-8">
          {/* Left Column - Profile Image */}
          <div className="flex flex-col items-center lg:border-r lg:border-light-gray pr-0 lg:pr-6">
            <div className="relative mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-accent-magenta shadow-md"
              />
              <label className="absolute bottom-2 right-2 bg-primary-orange p-2 rounded-full cursor-pointer hover:bg-gradient-to hover:from-gradient-from hover:to-gradient-to text-white shadow-md">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-h2 text-center mt-2 w-full">
              <EditableField
                value={displayName}
                onSave={(value: string) => {
                  const names: string[] = value.split(' ');
                  handleSaveField('first_name', names[0] || '');
                  if (names.length > 1) {
                    handleSaveField('last_name', names.slice(1).join(' '));
                  }
                }}
                placeholder="Enter your name"
                className="text-center"
              />
            </h2>
            <p className="text-gray mb-4 text-h4 w-full">
              <EditableField
                value={profileData?.role_name || ''}
                onSave={(value: string) => handleSaveField('role_name', value)}
                placeholder="Enter your role"
                className="text-center"
              />
            </p>
          </div>

          {/* Right Column - Profile Details */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bio Section */}
            <div className="md:col-span-2">
              <h3 className="text-h3 text-dark-gray mb-3">Bio</h3>
              <EditableField
                value={displayBio}
                onSave={(value: string) => handleSaveField('bio', value)}
                multiline
                placeholder="Tell us about yourself..."
                className="h-32"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-h3 text-dark-gray mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Email</p>
                    <EditableField
                      value={profileData?.email || ''}
                      onSave={(value: string) => handleSaveField('email', value)}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Phone</p>
                    <EditableField
                      value={profileData?.phone || ''}
                      onSave={(value: string) => handleSaveField('phone', value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Location</p>
                    <EditableField
                      value={profileData?.country_name || ''}
                      onSave={(value: string) => handleSaveField('country_name', value)}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-h3 text-dark-gray mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Date of Birth</p>
                    <EditableField
                      value={profileData?.dob || ''}
                      onSave={(value: string) => handleSaveField('dob', value)}
                      type="date"
                      placeholder="Enter date of birth"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Gender</p>
                    <EditableField
                      value={profileData?.gender || ''}
                      onSave={(value: string) => handleSaveField('gender', value)}
                      placeholder="Enter gender"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="mt-1 text-accent-magenta" />
                  <div className="w-full">
                    <p className="text-small text-gray">Marriage Anniversary</p>
                    <EditableField
                      value={profileData?.marriage_anniversary || ''}
                      onSave={(value: string) => handleSaveField('marriage_anniversary', value)}
                      type="date"
                      placeholder="Enter marriage anniversary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="md:col-span-2">
              <h3 className="text-h3 text-dark-gray mb-4">Account Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cream p-4 rounded-lg">
                  <p className="text-small text-gray">Account Status</p>
                  <p className={`text-h4 font-medium ${profileData?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {profileData?.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="bg-cream p-4 rounded-lg">
                  <p className="text-small text-gray">Verification Status</p>
                  <p
                    className={`text-h4 font-medium ${
                      profileData?.is_verified ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {profileData?.is_verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
                <div className="bg-cream p-4 rounded-lg">
                  <p className="text-small text-gray">Role</p>
                  <p className="text-h4 font-medium text-dark-gray capitalize">
                    {profileData?.role_name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-h3 text-dark-gray mb-4">Change Password</h3>
              <div className="flex flex-wrap mb-4 gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-small text-gray mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('currentPassword', e.target.value)
                    }
                    className="w-full bg-cream text-dark-gray border border-light-gray rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-orange focus:outline-none transition"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-small text-gray mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('newPassword', e.target.value)
                    }
                    className="w-full bg-cream text-dark-gray border border-light-gray rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-orange focus:outline-none transition"
                    placeholder="Change password"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-small text-gray mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handlePasswordChange('confirmPassword', e.target.value)
                    }
                    className="w-full bg-cream text-dark-gray border border-light-gray rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-orange focus:outline-none transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button
                onClick={handlePasswordChangeCombined}
                className="bg-accent-magenta text-white py-3 px-6 rounded-lg hover:opacity-90 transition text-button"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <h2 className="text-h2 text-dark-gray mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item: number) => (
              <div key={item} className="flex items-start gap-4 p-4 rounded-lg bg-peach">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-orange text-white">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-h4 font-medium text-dark-gray">
                    Completed project milestone {item}
                  </p>
                  <p className="text-small text-gray">
                    {item} day{item > 1 ? 's' : ''} ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Profile;
