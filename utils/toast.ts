import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

import { toast, ToastOptions, TypeOptions } from 'react-toastify';

// Type definitions
interface ToastConfig extends Partial<ToastOptions> {
  position?: ToastOptions['position'];
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: number | undefined;
  theme?: 'light' | 'dark' | 'colored';
}

interface ApiResponse {
  data?: {
    message?: string;
    msg?: string;
    [key: string]: any;
  };
  status: number;
  [key: string]: any;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      msg?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  message?: string;
  [key: string]: any;
}

interface ShowToast {
  success: (message: string, customConfig?: Partial<ToastConfig>) => void;
  error: (message: string, customConfig?: Partial<ToastConfig>) => void;
  warning: (message: string, customConfig?: Partial<ToastConfig>) => void;
  info: (message: string, customConfig?: Partial<ToastConfig>) => void;
  handleApiResponse: (response: ApiResponse, customConfig?: Partial<ToastConfig>) => void;
  handleApiError: (error: ApiError, customConfig?: Partial<ToastConfig>) => void;
  setDefaultConfig: (newConfig: Partial<ToastConfig>) => void;
  getDefaultConfig: () => ToastConfig;
  custom: (message: string, type?: TypeOptions, customConfig?: Partial<ToastConfig>) => void;
}

// Default configuration for all toasts
const defaultConfig: ToastConfig = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light", // "light", "dark", "colored"
};

// Toast utility object with different methods
const showToast: ShowToast = {
  success: (message: string, customConfig: Partial<ToastConfig> = {}): void => {
    const config = { ...defaultConfig, ...customConfig };
    toast.success(message, config);
  },

  error: (message: string, customConfig: Partial<ToastConfig> = {}): void => {
    const config = { ...defaultConfig, ...customConfig };
    toast.error(message, config);
  },

  warning: (message: string, customConfig: Partial<ToastConfig> = {}): void => {
    const config = { ...defaultConfig, ...customConfig };
    toast.warning(message, config);
  },

  info: (message: string, customConfig: Partial<ToastConfig> = {}): void => {
    const config = { ...defaultConfig, ...customConfig };
    toast.info(message, config);
  },

  // Method to handle API responses automatically
  handleApiResponse: (response: ApiResponse, customConfig: Partial<ToastConfig> = {}): void => {
    const { data, status } = response;
    const message = data?.message || data?.msg || 'Operation completed';

    if (status >= 200 && status < 300) {
      showToast.success(message, customConfig);
    } else if (status >= 400 && status < 500) {
      showToast.warning(message, customConfig);
    } else if (status >= 500) {
      showToast.error(message, customConfig);
    }
  },

  // Method to handle API errors (for catch blocks)
  handleApiError: (error: ApiError, customConfig: Partial<ToastConfig> = {}): void => {
    const message = 
      error?.response?.data?.message || 
      error?.response?.data?.msg || 
      error?.message || 
      'Something went wrong';
    
    showToast.error(message, customConfig);
  },

  // Method to update default configuration
  setDefaultConfig: (newConfig: Partial<ToastConfig>): void => {
    Object.assign(defaultConfig, newConfig);
  },

  // Method to get current default configuration
  getDefaultConfig: (): ToastConfig => ({ ...defaultConfig }),

  // Custom toast with full control
  custom: (message: string, type: TypeOptions = 'default', customConfig: Partial<ToastConfig> = {}): void => {
    const config = { ...defaultConfig, ...customConfig };
    toast(message, { ...config, type });
  }
};

export default showToast;

const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
};

export default showToast;
