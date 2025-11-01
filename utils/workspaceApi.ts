// API utility functions for workspace operations
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for GET requests
const getRequest = async (url: string) => {
  return await api.get(url);
};

// Type definitions
export interface Retailer {
  id: string;
  name: string;
  country: string;
  country_iso3?: string;
  [key: string]: any;
}

export interface CategoryData {
  id: string;
  name?: string;
  breadcrumb?: string;
  breadcrumbParts?: string[];
  level?: number;
  [key: string]: any;
}

export interface CategoryNode {
  children: CategoryHierarchy;
  data: CategoryData | null;
}

export interface CategoryHierarchy {
  [key: string]: CategoryNode;
}

export interface CategoriesByRetailer {
  [retailerId: string]: {
    hierarchy: CategoryHierarchy;
    flat: CategoryData[];
    [key: string]: any;
  };
}

export interface BrandsByCategory {
  [categoryId: string]: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  available?: boolean;
}

export interface WorkspaceData {
  name: string;
  retailers: string[];
  categories: { [retailerId: string]: string[] };
  brands: { [categoryId: string]: string[] };
  modules: string[];
  [key: string]: any;
}

// Backend response types
interface BackendRetailerResponse {
  id: string;
  retailer_name: string;
  country_name?: string;
  country_iso3?: string;
  [key: string]: any;
}

interface BackendCategoryResponse {
  id: string;
  name: string;
  breadcrumb: string;
  level: number;
  retailer_id: string;
  [key: string]: any;
}

interface BackendBrandResponse {
  name: string;
  category_id: string;
  [key: string]: any;
}

/**
 * Check if a workspace name is available
 * @param name - The workspace name to check
 * @returns Promise with availability result
 */
export async function checkWorkspaceName(name: string): Promise<ApiResponse<{ available: boolean }>> {
  try {
    const response = await api.post("/check-workspace-name", { name });
    console.log("Backend response for checkWorkspaceName:", response.data);
    return {
      success: true,
      available: response.data.message === "Workspace name is available",
      message: response.data.message,
    };
  } catch (error: any) {
    console.log("Error in checkWorkspaceName:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to check workspace name",
    };
  }
}

/**
 * Fetch all available retailers
 * @returns Promise with retailers data
 */
export async function fetchRetailers(): Promise<ApiResponse<Retailer[]>> {
  try {
    const response = await getRequest("/get-retailer");
    const retailers = response.data.map((retailer: BackendRetailerResponse) => ({
      id: retailer.id,
      name: retailer.retailer_name,
      country: retailer.country_name || "Unknown",
      country_iso3: retailer.country_iso3 || "UNK",
    }));
    return { success: true, data: retailers };
  } catch (error: any) {
    return {
      success: false,
      message: error.data?.message || error.message || "Failed to fetch retailers",
    };
  }
}

/**
 * Fetch categories for selected retailers
 * @param retailerIds - Array of retailer IDs
 * @returns Promise with categories grouped by retailer
 */
export async function fetchCategoriesByRetailers(
  retailerIds: string[]
): Promise<ApiResponse<CategoriesByRetailer>> {
  try {
    const response = await api.post("/get-category-by-retailer", {
      retailers: retailerIds,
    });
    
    const filteredCategories: CategoriesByRetailer = {};
    
    response.data.data.forEach((category: BackendCategoryResponse) => {
      const retailerId = category.retailer_id;
      
      if (!filteredCategories[retailerId]) {
        filteredCategories[retailerId] = { flat: [], hierarchy: {} };
      }
      
      const breadcrumbParts = category.breadcrumb.split(" > ").map((part) => part.trim());
      const level = category.level;
      
      const categoryData: CategoryData = {
        id: category.id,
        name: category.name,
        breadcrumb: category.breadcrumb,
        level,
        breadcrumbParts,
      };
      
      filteredCategories[retailerId].flat.push(categoryData);

      let currentLevel = filteredCategories[retailerId].hierarchy;
      for (let i = 0; i <= level; i++) {
        const name = breadcrumbParts[i];
        if (!currentLevel[name]) {
          currentLevel[name] = { children: {}, data: null };
        }
        if (i === level) {
          currentLevel[name].data = categoryData;
        }
        currentLevel = currentLevel[name].children;
      }
    });
    
    return { success: true, data: filteredCategories };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch categories",
    };
  }
}

/**
 * Fetch brands for selected categories
 * @param categoryIds - Array of category IDs
 * @returns Promise with brands grouped by category
 */
export async function fetchBrandsByCategories(
  categoryIds: string[]
): Promise<ApiResponse<BrandsByCategory>> {
  try {
    const response = await api.post("/get-brands-by-category", {
      categories: categoryIds,
    });
    
    const brandsByCategory = response.data.data.reduce((acc: BrandsByCategory, brand: BackendBrandResponse) => {
      const categoryId = brand.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(brand.name);
      return acc;
    }, {});
    
    return { success: true, data: brandsByCategory };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch brands",
    };
  }
}

/**
 * Create a new workspace
 * @param workspaceData - The workspace configuration data
 * @returns Promise with creation result
 */
export async function createWorkspace(
  workspaceData: WorkspaceData
): Promise<ApiResponse<any>> {
  try {
    const response = await api.post("/create-workspace", workspaceData);
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create workspace",
    };
  }
}
