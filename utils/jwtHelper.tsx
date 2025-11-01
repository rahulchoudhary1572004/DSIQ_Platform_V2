// utils/jwtHelper.ts
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Type Definitions
interface DecodedPayload extends JwtPayload {
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the payload.
 * @param {string} token - JWT token string
 * @returns {DecodedPayload|null} Decoded token payload or null if invalid
 */
export function decodeJWT(token: string | null | undefined): DecodedPayload | null {
  try {
    if (!token) {
      return null;
    }

    const decoded: DecodedPayload = jwtDecode<DecodedPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Invalid JWT Token:', error);
    return null;
  }
}
