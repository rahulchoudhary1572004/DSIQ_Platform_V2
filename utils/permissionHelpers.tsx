// utils/permissionHelper.ts

// Type Definitions
interface Permission {
  id?: string | number;
  module_name: string;
  permission?: string;
  [key: string]: any;
}

/**
 * Checks if user has access to a specific module.
 * @param {string} moduleName - The name of the module to check
 * @param {Permission[]} permissions - Array of user permissions
 * @returns {boolean} - True if user has access to the module, false otherwise
 */
export const hasModuleAccess = (
  moduleName: string,
  permissions: Permission[]
): boolean => {
  if (!moduleName || !Array.isArray(permissions)) {
    return false;
  }
  return permissions.some((perm: Permission) => perm.module_name === moduleName);
};

/**
 * Gets all unique module names from permissions array.
 * @param {Permission[]} permissions - Array of user permissions
 * @returns {string[]} - Array of unique module names
 */
export const getAllPermittedModules = (
  permissions: Permission[]
): string[] => {
  if (!Array.isArray(permissions)) {
    return [];
  }
  return [...new Set(permissions.map((perm: Permission) => perm.module_name))];
};

/**
 * Gets the permission string for a specific module.
 * @param {string} moduleName - The name of the module to check
 * @param {Permission[]} permissions - Array of user permissions
 * @returns {string|null} - The permission string if found, null otherwise
 */
export const getModulePermission = (
  moduleName: string,
  permissions: Permission[]
): string | null => {
  if (!moduleName || !Array.isArray(permissions)) {
    return null;
  }
  const modulePerm: Permission | undefined = permissions.find(
    (perm: Permission) => perm.module_name === moduleName
  );
  return modulePerm?.permission || null;
};
