// utils/getModuleIdByName.ts
import { decodeJWT } from "./jwtHelper";

// Type Definitions
interface Permission {
  id: string;
  module_name: string;
  [key: string]: any;
}

interface DecodedToken {
  permissions?: Permission[];
  [key: string]: any;
}

/**
 * Returns the module ID for the given module name from the JWT token.
 * @param {string} moduleName - The name of the module to search for.
 * @returns {string|null} - The module ID if found, otherwise null.
 */
export const getModuleIdByName = (moduleName: string): string | null => {
  const token: string | null = localStorage.getItem("authToken");
  
  if (!token || !moduleName) {
    return null;
  }

  try {
    const decodedResult = decodeJWT(token);

    if (!decodedResult) {
      console.warn("Failed to decode JWT token");
      return null;
    }

    const decoded: DecodedToken = decodedResult;

    if (!decoded.permissions || !Array.isArray(decoded.permissions)) {
      console.warn("No permissions found in token or permissions is not an array");
      return null;
    }

    const modulePermission: Permission | undefined = decoded.permissions.find(
      (perm: Permission) => perm.module_name === moduleName
    );

    if (!modulePermission) {
      console.warn(`Module "${moduleName}" not found in permissions`);
      return null;
    }

    console.log(`Module: ${moduleName}, ID: ${modulePermission.id}`);
    return modulePermission.id || null;
  } catch (error) {
    console.error(
      `Failed to decode token or find module "${moduleName}":`,
      error
    );
    return null;
  }
};
