// utils/getRoles.ts
import axios, { AxiosResponse } from 'axios';
import { getModuleIdByName } from './getModuleIdByName';

// Type Definitions
interface RoleData {
  id: string | number;
  name: string;
  is_archive: boolean;
  [key: string]: any;
}

interface Role {
  id: string | number;
  name: string;
}

interface ApiResponse {
  data: RoleData[];
  [key: string]: any;
}

/**
 * Fetches all active roles for the User Management module.
 * @returns {Promise<Role[]>} - Array of active roles with id and name.
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const module_id: string | null = await getModuleIdByName('User Management');

    if (!module_id) {
      console.warn('Module ID for User Management not found');
      return [];
    }

    const response: AxiosResponse<ApiResponse> = await axios.get('/get-roles', {
      params: { module_id },
    });

    const roleData: RoleData[] | undefined = response?.data?.data;

    if (!Array.isArray(roleData)) {
      console.error('Unexpected response structure:', response.data);
      return [];
    }

    const roles: Role[] = roleData
      .filter((role: RoleData) => role.is_archive === false)
      .map((role: RoleData) => ({
        id: role.id,
        name: role.name,
      }));

    console.log('Roles:', roles);
    return roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};
