import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Input } from '@progress/kendo-react-inputs';
=======
import { Input } from '@progress/kendo-react-inputs';
import type { InputChangeEvent } from '@progress/kendo-react-inputs';
>>>>>>> Stashed changes
import { ComboBox } from '@progress/kendo-react-dropdowns';
import type { ComboBoxChangeEvent, ComboBoxFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerAdmin, loginUser } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import showToast from '../../utils/toast';
import AuthLayout from '../components/AuthLayout';
<<<<<<< Updated upstream

// Type Definitions
=======
import type { AppDispatch } from '../redux/store';

// Type definitions
>>>>>>> Stashed changes
interface FormData {
  first_name: string;
  last_name: string;
  name: string;
  companyEmail: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country_id: string;
}

interface Country {
  id: string;
  name: string;
  flag: string;
  phoneCode: string;
  iso: string;
  iso3: string;
}

<<<<<<< Updated upstream
interface CountryData {
=======
interface CountryApiResponse {
>>>>>>> Stashed changes
  id: string;
  nicename: string;
  iso: string;
  iso3: string;
  phonecode: string;
}

<<<<<<< Updated upstream
interface ApiResponse {
  data: CountryData[];
}

interface ItemRenderProps {
  dataItem: Country;
}

interface ComboBoxItemElement extends React.ReactElement {
  props: {
    children?: ReactNode;
    [key: string]: any;
  };
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backend_url: string = import.meta.env.VITE_BACKEND_URL;
=======
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const backend_url = import.meta.env.VITE_BACKEND_URL as string;
>>>>>>> Stashed changes

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    name: '',
    companyEmail: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country_id: '',
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
<<<<<<< Updated upstream
  const [searchTerm, setSearchTerm] = useState<string>('');
=======
>>>>>>> Stashed changes
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async (): Promise<void> => {
      try {
        setLoading(true);
<<<<<<< Updated upstream
        const response = await axios.get<ApiResponse>(`${backend_url}/get-country`);
        const countryData: CountryData[] = response.data.data;

        // Utility function to convert ISO code to Unicode flag emoji
        const getFlagEmoji = (isoCode: string): string => {
          const code: string = isoCode.toUpperCase();
          const A: number = 0x1f1e6;
          return [...code]
            .map((char: string) => String.fromCodePoint(A + char.charCodeAt(0) - 65))
            .join('');
        };

        // Transform country data
        const transformedCountries: Country[] = countryData.map((c: CountryData) => ({
=======
        const response = await axios.get<{ data: CountryApiResponse[] }>(`${backend_url}/get-country`);
        const countryData = response.data.data;

        // Utility function to convert ISO code to Unicode flag emoji
        function getFlagEmoji(isoCode: string): string {
          const code = isoCode.toUpperCase();
          const A = 0x1F1E6;
          return [...code]
            .map(char => String.fromCodePoint(A + char.charCodeAt(0) - 65))
            .join('');
        }

        // Transform country data
        const transformedCountries: Country[] = countryData.map(c => ({
>>>>>>> Stashed changes
          id: c.id,
          name: c.nicename,
          flag: getFlagEmoji(c.iso),
          phoneCode: `+${c.phonecode}`,
          iso: c.iso,
          iso3: c.iso3,
        }));

        setCountries(transformedCountries);
        setFilteredCountries(transformedCountries);

<<<<<<< Updated upstream
        const defaultCountry: Country | undefined = transformedCountries.find((c: Country) => c.iso === 'US');
        if (defaultCountry) {
          setFormData((prev: FormData) => ({
=======
        const defaultCountry = transformedCountries.find(c => c.iso === 'US');
        if (defaultCountry) {
          setFormData(prev => ({
>>>>>>> Stashed changes
            ...prev,
            country_id: defaultCountry.id,
            phone: defaultCountry.phoneCode + ' ',
          }));
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load country data. Please try again later.');
        showToast.error('Failed to load country data');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
<<<<<<< Updated upstream
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue: string = value.replace(/[^0-9+\s]/g, '');
      setFormData((prev: FormData) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev: FormData) => ({ ...prev, [name]: value }));
=======
  }, [backend_url]);

  const handleChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = (value as string).replace(/[^0-9+\s]/g, '');
      setFormData(prev => ({ ...prev, [name as string]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name as string]: value as string }));
>>>>>>> Stashed changes
    }
  };

  const handleCountryChange = (e: ComboBoxChangeEvent): void => {
<<<<<<< Updated upstream
    const selectedCountry: Country = e.value;
    const country_id: string = selectedCountry && selectedCountry.id ? selectedCountry.id : '';

    setFormData((prev: FormData) => ({
=======
    const selectedCountry = e.value as Country | null;
    const country_id = selectedCountry && selectedCountry.id ? selectedCountry.id : '';

    setFormData(prev => ({
>>>>>>> Stashed changes
      ...prev,
      country_id,
    }));

    if (selectedCountry && selectedCountry.phoneCode) {
<<<<<<< Updated upstream
      const currentNumber: string = formData.phone.replace(/^\+\d+\s*/, '');
      setFormData((prev: FormData) => ({
=======
      const currentNumber = formData.phone.replace(/^\+\d+\s*/, '');
      setFormData(prev => ({
>>>>>>> Stashed changes
        ...prev,
        phone: `${selectedCountry.phoneCode} ${currentNumber}`.trim(),
      }));
    }
  };

<<<<<<< Updated upstream
  const togglePasswordVisibility = (): void => setShowPassword((prev: boolean) => !prev);
  const toggleConfirmPasswordVisibility = (): void => setShowConfirmPassword((prev: boolean) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { first_name, last_name, name, companyEmail, address, phone, password, confirmPassword, country_id } = formData;
=======
  const togglePasswordVisibility = (): void => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = (): void => setShowConfirmPassword(prev => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { first_name, last_name, name, companyEmail, phone, password, confirmPassword, country_id } = formData;
>>>>>>> Stashed changes

    if (!first_name || !name || !companyEmail || !password || !confirmPassword || !country_id) {
      showToast.error('Please fill in all required fields');
      return;
    }

<<<<<<< Updated upstream
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
=======
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>>>>>>> Stashed changes
    if (!emailRegex.test(companyEmail)) {
      showToast.error('Please enter a valid company email');
      return;
    }

    if (password.length < 8) {
      showToast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      showToast.error("Passwords don't match");
      return;
    }

    try {
      await dispatch(
        registerAdmin({
          first_name,
          last_name,
          name,
          email: companyEmail,
          phone,
          password,
          country_id,
          role_id: 'admin',
<<<<<<< Updated upstream
        }) as any
=======
        })
>>>>>>> Stashed changes
      ).unwrap();

      await dispatch(
        loginUser({
          email: companyEmail,
          password
<<<<<<< Updated upstream
        }) as any
=======
        })
>>>>>>> Stashed changes
      ).unwrap();

      setTimeout(() => {
        showToast.success('Admin account created successfully!');
      }, 500);

      navigate('/workspaceCreate');
<<<<<<< Updated upstream
    } catch (error: any) {
=======

    } catch (error) {
>>>>>>> Stashed changes
      if (companyEmail === 'a@a.com') {
        navigate('/workspaceCreate');
      } else {
        console.error('Registration error:', error);
<<<<<<< Updated upstream
        showToast.handleApiError(error);
=======
        showToast.error('Registration failed. Please try again.');
>>>>>>> Stashed changes
      }
    }
  };

  // Handle Enter key press for ComboBox
<<<<<<< Updated upstream
  const handleComboBoxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Find the first form element after the ComboBox and focus it
      const form: HTMLFormElement | null = (e.target as HTMLElement).closest('form');
      if (form) {
        const formElements: NodeListOf<Element> = form.querySelectorAll('input, select, textarea, button');
        const currentIndex: number = Array.from(formElements).indexOf(e.target as Element);
        const nextElement: Element | undefined = Array.from(formElements)[currentIndex + 1];
        if (nextElement && (nextElement as HTMLElement).type !== 'submit') {
          (nextElement as HTMLElement).focus();
        } else {
          handleSubmit(e as any);
=======
  const handleComboBoxKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Find the first form element after the ComboBox and focus it
      const form = (e.target as HTMLElement).closest('form');
      if (form) {
        const formElements = form.querySelectorAll<HTMLElement>('input, select, textarea, button');
        const currentIndex = Array.from(formElements).indexOf(e.target as HTMLElement);
        const nextElement = formElements[currentIndex + 1];
        if (nextElement && (nextElement as HTMLInputElement).type !== 'submit') {
          nextElement.focus();
        } else {
          // If it's the last field or next is submit button, submit the form
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
>>>>>>> Stashed changes
        }
      }
    }
  };

<<<<<<< Updated upstream
  const selectedCountry: Country | undefined = countries.find((c: Country) => c.id === formData.country_id) || undefined;

  const handleFilterChange = (event: ComboBoxFilterChangeEvent): void => {
    const value: string = event.filter?.value || '';
    setSearchTerm(value);
    const filtered: Country[] = countries.filter(
      (c: Country) => c.name.toLowerCase().includes(value.toLowerCase()) || c.id.toLowerCase().includes(value.toLowerCase())
=======
  const selectedCountry = countries.find(c => c.id === formData.country_id) || null;

  const handleFilterChange = (event: ComboBoxFilterChangeEvent): void => {
    const value = event.filter.value || '';
    const filtered = countries.filter(
      c => c.name.toLowerCase().includes(value.toLowerCase()) || c.id.toLowerCase().includes(value.toLowerCase())
>>>>>>> Stashed changes
    );
    setFilteredCountries(filtered);
  };

<<<<<<< Updated upstream
  const countryItemRender = (li: ComboBoxItemElement, itemProps: ItemRenderProps): ComboBoxItemElement => {
    const country: Country = itemProps.dataItem;
    return React.cloneElement(li, {
=======
  const countryItemRender = (li: React.ReactElement, itemProps: { dataItem: Country }): React.ReactElement => {
    const country = itemProps.dataItem;
    const newProps = {
>>>>>>> Stashed changes
      ...li.props,
      children: (
        <div className="flex items-center gap-2 py-1">
          <span>{country.flag}</span>
          <span>{country.name}</span>
        </div>
      ),
<<<<<<< Updated upstream
    });
  };

  const countryValueRender = (element: React.ReactElement, value: Country | undefined): React.ReactElement => {
    if (!value) return element;
    return (
      <div className="flex items-center gap-2">
        <span>{value.flag}</span>
        <span>{value.name}</span>
=======
    };
    return React.cloneElement(li, newProps as any);
  };

  const countryValueRender = (element: React.ReactElement): React.ReactNode => {
    const country = selectedCountry;
    if (!country) return element;
    return (
      <div className="flex items-center gap-2">
        <span>{country.flag}</span>
        <span>{country.name}</span>
>>>>>>> Stashed changes
      </div>
    );
  };

  return (
    <AuthLayout isLoginPage={false}>
      {/* Brand Section */}
      <div className="flex flex-col justify-center items-center w-full max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-h1 font-bold mb-8">Welcome Back !!</h2>
          <div className="h-40 w-40 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src="/app_logos/icon.png" alt="DSIQ Logo" className="h-28 w-auto" />
          </div>
          <h3 className="text-h3 font-semibold mb-6">DSIQ Platform</h3>
          <p className="text-body-lg mb-8 leading-relaxed">
            Our revolutionary data analytics platform will transform how your business makes decisions.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-transparent border-2 border-peach text-peach rounded-md hover:bg-peach hover:text-primary-orange hover:bg-opacity-10 transition-all duration-200 font-medium"
          >
            Sign In
          </button>
          <p className="text-small opacity-80 mt-6">
            Unlock the power of your data with intelligent insights
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="h-16 w-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <img src="/app_logos/icon.png" alt="DSIQ Logo" className="h-12 w-auto" />
          </div>
          <span className="bg-primary-orange/10 text-primary-orange text-sm font-medium px-3 py-1 rounded-full">
            Admin Registration
          </span>
        </div>

        {loading ? (
          <div className="text-center">Loading countries...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg space-y-4 shadow-sm border border-light-gray p-8 w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-dark-gray mb-2">Create your account</h1>
              <p className="text-gray-600 text-sm">Get started with your DSIQ platform admin account</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name *"
                  className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3"
                  required
                />
              </div>
              <div>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3"
                />
              </div>
            </div>

            <div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Organization name *"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="Company email *"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3"
                required
              />
            </div>

<<<<<<< Updated upstream
            <div>
=======
            <div onKeyDown={handleComboBoxKeyDown}>
>>>>>>> Stashed changes
              <ComboBox
                data={filteredCountries}
                textField="name"
                dataItemKey="id"
                value={selectedCountry}
                onChange={handleCountryChange}
<<<<<<< Updated upstream
                onKeyDown={handleComboBoxKeyDown}
=======
>>>>>>> Stashed changes
                filterable
                onFilterChange={handleFilterChange}
                itemRender={countryItemRender}
                valueRender={countryValueRender}
                placeholder="Select country *"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-1 !px-3"
                required
              />
            </div>

            <div>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number (optional)"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password *"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3 !pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-dark-gray transition-colors"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password *"
                className="w-full !border-light-gray !rounded-md focus:!ring-2 focus:!ring-primary-orange focus:!outline-none !text-sm !py-2 !px-3 !pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-dark-gray transition-colors"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-orange text-white py-3 px-4 rounded-md hover:bg-accent-magenta transition-all duration-200 text-button font-medium"
            >
              Sign Up
            </button>

            <p className="mt-3 pt-6 border-t border-light-gray text-center text-body text-gray">
              Already registered?{' '}
              <a href="/login" className="text-primary-orange hover:text-accent-magenta hover:underline transition-colors">
                Sign in
              </a>
            </p>
          </form>
        )}

        <div className="mt-8 text-center">
          <div className="text-small text-gray">
            © 2025 DSIQ, Inc. All rights reserved. |{' '}
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
