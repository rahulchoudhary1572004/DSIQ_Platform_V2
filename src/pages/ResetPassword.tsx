import React, { useState } from 'react';
<<<<<<< Updated upstream
import type { FormEvent } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
=======
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import type { InputChangeEvent } from '@progress/kendo-react-inputs';
>>>>>>> Stashed changes
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../redux/slices/authSlice';
import showToast from '../../utils/toast';
<<<<<<< Updated upstream

// Type Definitions
=======
import type { AppDispatch } from '../redux/store';

// Type definitions
>>>>>>> Stashed changes
interface FormData {
  password: string;
  confirmPassword: string;
}

interface PasswordRules {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasUpperCase: boolean;
}

interface ShowPasswords {
  password: boolean;
  confirmPassword: boolean;
}

<<<<<<< Updated upstream
interface ResetPasswordParams extends Record<string, string | undefined> {
  token?: string;
}

interface ImageEvent extends React.SyntheticEvent<HTMLImageElement, Event> {
  target: HTMLImageElement & EventTarget;
}

const ResetPasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useParams<ResetPasswordParams>();
=======
type PasswordField = keyof ShowPasswords;

const ResetPasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useParams<{ token: string }>();
>>>>>>> Stashed changes
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  
  const [passwordRules, setPasswordRules] = useState<PasswordRules>({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
  });
  
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    password: false,
    confirmPassword: false
  });

<<<<<<< Updated upstream
  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));

    // Update password rules specifically for password field
    if (name === 'password') {
      setPasswordRules({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasUpperCase: /[A-Z]/.test(value),
=======
  const handleChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value as string }));

    // Update password rules specifically for password field
    if (name === 'password') {
      const passwordValue = value as string;
      setPasswordRules({
        minLength: passwordValue.length >= 8,
        hasNumber: /\d/.test(passwordValue),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
        hasUpperCase: /[A-Z]/.test(passwordValue),
>>>>>>> Stashed changes
      });
    }
  };

<<<<<<< Updated upstream
  const togglePasswordVisibility = (field: keyof ShowPasswords): void => {
    setShowPasswords((prev: ShowPasswords) => ({
=======
  const togglePasswordVisibility = (field: PasswordField): void => {
    setShowPasswords(prev => ({
>>>>>>> Stashed changes
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (): boolean => {
    const { password, confirmPassword } = formData;

    if (!password) {
      showToast.error('Please enter a password');
      return false;
    }

    // Check password rules
    if (!passwordRules.minLength) {
      showToast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!passwordRules.hasNumber) {
      showToast.error('Password must contain a number');
      return false;
    }
    if (!passwordRules.hasUpperCase) {
      showToast.error('Password must contain an uppercase letter');
      return false;
    }
    if (!passwordRules.hasSpecialChar) {
      showToast.error('Password must contain a special character');
      return false;
    }

    // Check password match
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return false;
    }

    return true;
  };

<<<<<<< Updated upstream
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
=======
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
>>>>>>> Stashed changes
    e.preventDefault();

    if (validatePassword()) {
      try {
        // Use token here
        console.log('Reset token:', token);
<<<<<<< Updated upstream
        dispatch(resetPassword({ token, password: formData.password }) as any);
        
        showToast.success('Password reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
=======
        if (token) {
          dispatch(resetPassword({ token, password: formData.password }));
          // Simulating API call with token and new password
          // Example:
          // await resetPasswordAPI({ token, password: formData.password });

          showToast.success('Password reset successfully');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          showToast.error('Invalid reset token');
        }
>>>>>>> Stashed changes
      } catch (error) {
        showToast.error('Failed to reset password');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/icon.png"
            alt="DSIQ Logo"
            className="h-16 w-auto mx-auto mb-4"
<<<<<<< Updated upstream
            onError={(e: ImageEvent) => {
              e.target.onerror = null;
              e.target.src = "/icon.png";
=======
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/icon.png";
>>>>>>> Stashed changes
            }}
          />
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.password ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="!w-full !pr-10"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPasswords.password ? (
                  <EyeOff className="!h-5 !w-5" />
                ) : (
                  <Eye className="!h-5 !w-5" />
                )}
              </button>
            </div>
            <div className="pl-2 text-xs text-gray-500 mt-2">
              <p className={`mb-1 ${passwordRules.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                • At least 8 characters
              </p>
              <p className={`mb-1 ${passwordRules.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains a number
              </p>
              <p className={`mb-1 ${passwordRules.hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains an uppercase letter
              </p>
              <p className={`mb-1 ${passwordRules.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains a special character
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="!absolute !inset-y-0 !right-0 !flex !items-center !px-3 !text-gray-600"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            themeColor="primary"
            type="submit"
            className="w-full !bg-indigo-600 !text-white hover:!bg-indigo-700 mb-4"
          >
            Reset Password
          </Button>

          <div className="text-center text-sm text-gray-500 mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:underline"
            >
              Return to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
