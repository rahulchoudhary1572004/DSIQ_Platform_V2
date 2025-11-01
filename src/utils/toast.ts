import { toast, type ToastOptions, type TypeOptions } from 'react-toastify';import { toast } from 'react-toastify';

import type { ToastOptions } from 'react-toastify';

// Type definitions

interface ToastConfig extends Partial<ToastOptions> {import { toast, ToastOptions, TypeOptions } from 'react-toastify';

  position?: ToastOptions['position'];

  autoClose?: number | false;// Type definitions

  hideProgressBar?: boolean;interface ToastConfig extends Partial<ToastOptions> {

  closeOnClick?: boolean;  position?: ToastOptions['position'];

  pauseOnHover?: boolean;  autoClose?: number | false;

  draggable?: boolean;  hideProgressBar?: boolean;

  progress?: number | undefined;  closeOnClick?: boolean;

  theme?: 'light' | 'dark' | 'colored';  pauseOnHover?: boolean;

}  draggable?: boolean;

  progress?: number | undefined;

interface ApiResponse {  theme?: 'light' | 'dark' | 'colored';

  data?: {}

    message?: string;

    msg?: string;interface ApiResponse {

    [key: string]: any;  data?: {

  };    message?: string;

  status: number;    msg?: string;

  [key: string]: any;    [key: string]: any;

}  };

  status: number;

interface ApiError {  [key: string]: any;

  response?: {}

    data?: {

      message?: string;interface ApiError {

      msg?: string;  response?: {

      [key: string]: any;    data?: {

    };      message?: string;

    [key: string]: any;      msg?: string;

  };      [key: string]: any;

  message?: string;    };

  [key: string]: any;    [key: string]: any;

}  };

  message?: string;

interface ShowToast {  [key: string]: any;

  success: (message: string, customConfig?: Partial<ToastConfig>) => void;}

  error: (message: string, customConfig?: Partial<ToastConfig>) => void;

  warning: (message: string, customConfig?: Partial<ToastConfig>) => void;interface ShowToast {

  info: (message: string, customConfig?: Partial<ToastConfig>) => void;  success: (message: string, customConfig?: Partial<ToastConfig>) => void;

  handleApiResponse: (response: ApiResponse, customConfig?: Partial<ToastConfig>) => void;  error: (message: string, customConfig?: Partial<ToastConfig>) => void;

  handleApiError: (error: ApiError, customConfig?: Partial<ToastConfig>) => void;  warning: (message: string, customConfig?: Partial<ToastConfig>) => void;

  setDefaultConfig: (newConfig: Partial<ToastConfig>) => void;  info: (message: string, customConfig?: Partial<ToastConfig>) => void;

  getDefaultConfig: () => ToastConfig;  handleApiResponse: (response: ApiResponse, customConfig?: Partial<ToastConfig>) => void;

  custom: (message: string, type?: TypeOptions, customConfig?: Partial<ToastConfig>) => void;  handleApiError: (error: ApiError, customConfig?: Partial<ToastConfig>) => void;

}  setDefaultConfig: (newConfig: Partial<ToastConfig>) => void;

  getDefaultConfig: () => ToastConfig;

// Default configuration for all toasts  custom: (message: string, type?: TypeOptions, customConfig?: Partial<ToastConfig>) => void;

const defaultConfig: ToastConfig = {}

  position: "top-right",

  autoClose: 2000,// Default configuration for all toasts

  hideProgressBar: false,const defaultConfig: ToastConfig = {

  closeOnClick: true,  position: "top-right",

  pauseOnHover: true,  autoClose: 2000,

  draggable: true,  hideProgressBar: false,

  progress: undefined,  closeOnClick: true,

  theme: "light", // "light", "dark", "colored"  pauseOnHover: true,

};  draggable: true,

  progress: undefined,

// Toast utility object with different methods  theme: "light", // "light", "dark", "colored"

const showToast: ShowToast = {};

  success: (message: string, customConfig: Partial<ToastConfig> = {}): void => {

    const config = { ...defaultConfig, ...customConfig };// Toast utility object with different methods

    toast.success(message, config);const showToast: ShowToast = {

  },  success: (message: string, customConfig: Partial<ToastConfig> = {}): void => {

    const config = { ...defaultConfig, ...customConfig };

  error: (message: string, customConfig: Partial<ToastConfig> = {}): void => {    toast.success(message, config);

    const config = { ...defaultConfig, ...customConfig };  },

    toast.error(message, config);

  },  error: (message: string, customConfig: Partial<ToastConfig> = {}): void => {

    const config = { ...defaultConfig, ...customConfig };

  warning: (message: string, customConfig: Partial<ToastConfig> = {}): void => {    toast.error(message, config);

    const config = { ...defaultConfig, ...customConfig };  },

    toast.warning(message, config);

  },  warning: (message: string, customConfig: Partial<ToastConfig> = {}): void => {

    const config = { ...defaultConfig, ...customConfig };

  info: (message: string, customConfig: Partial<ToastConfig> = {}): void => {    toast.warning(message, config);

    const config = { ...defaultConfig, ...customConfig };  },

    toast.info(message, config);

  },  info: (message: string, customConfig: Partial<ToastConfig> = {}): void => {

    const config = { ...defaultConfig, ...customConfig };

  // Method to handle API responses automatically    toast.info(message, config);

  handleApiResponse: (response: ApiResponse, customConfig: Partial<ToastConfig> = {}): void => {  },

    const { data, status } = response;

    const message = data?.message || data?.msg || 'Operation completed';  // Method to handle API responses automatically

  handleApiResponse: (response: ApiResponse, customConfig: Partial<ToastConfig> = {}): void => {

    if (status >= 200 && status < 300) {    const { data, status } = response;

      showToast.success(message, customConfig);    const message = data?.message || data?.msg || 'Operation completed';

    } else if (status >= 400 && status < 500) {

      showToast.warning(message, customConfig);    if (status >= 200 && status < 300) {

    } else if (status >= 500) {      showToast.success(message, customConfig);

      showToast.error(message, customConfig);    } else if (status >= 400 && status < 500) {

    }      showToast.warning(message, customConfig);

  },    } else if (status >= 500) {

      showToast.error(message, customConfig);

  // Method to handle API errors (for catch blocks)    }

  handleApiError: (error: ApiError, customConfig: Partial<ToastConfig> = {}): void => {  },

    const message = 

      error?.response?.data?.message ||   // Method to handle API errors (for catch blocks)

      error?.response?.data?.msg ||   handleApiError: (error: ApiError, customConfig: Partial<ToastConfig> = {}): void => {

      error?.message ||     const message = 

      'Something went wrong';      error?.response?.data?.message || 

          error?.response?.data?.msg || 

    showToast.error(message, customConfig);      error?.message || 

  },      'Something went wrong';

    

  // Method to update default configuration    showToast.error(message, customConfig);

  setDefaultConfig: (newConfig: Partial<ToastConfig>): void => {  },

    Object.assign(defaultConfig, newConfig);

  },  // Method to update default configuration

  setDefaultConfig: (newConfig: Partial<ToastConfig>): void => {

  // Method to get current default configuration    Object.assign(defaultConfig, newConfig);

  getDefaultConfig: (): ToastConfig => ({ ...defaultConfig }),  },



  // Custom toast with full control  // Method to get current default configuration

  custom: (message: string, type: TypeOptions = 'default', customConfig: Partial<ToastConfig> = {}): void => {  getDefaultConfig: (): ToastConfig => ({ ...defaultConfig }),

    const config = { ...defaultConfig, ...customConfig };

    toast(message, { ...config, type });  // Custom toast with full control

  }  custom: (message: string, type: TypeOptions = 'default', customConfig: Partial<ToastConfig> = {}): void => {

};    const config = { ...defaultConfig, ...customConfig };

    toast(message, { ...config, type });

export default showToast;  }

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
