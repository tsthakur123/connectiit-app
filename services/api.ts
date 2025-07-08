import { API_CONFIG, API_ENDPOINTS, API_ERRORS } from '@/constants/api';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

export interface TokenVerificationResponse {
  valid: boolean;
  claims: {
    user_id: string;
    name: string;
    email: string;
    image: string;
    exp: number;
  };
}

// Base API client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          ...API_CONFIG.HEADERS,
          ...options.headers,
        },
        ...options,
      };

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: API_ERRORS.TIMEOUT,
          };
        }
        return {
          success: false,
          error: error.message || API_ERRORS.NETWORK_ERROR,
        };
      }
      return {
        success: false,
        error: API_ERRORS.NETWORK_ERROR,
      };
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Auth service
export class AuthService {
  // Create token (login/signup)
  static async createToken(email: string, name: string, image: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.CREATE_TOKEN, {
      email,
      name,
      image,
    });
  }

  // Verify token
  static async verifyToken(token: string): Promise<ApiResponse<TokenVerificationResponse>> {
    return apiClient.get<TokenVerificationResponse>(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {
      'Authorization': `Bearer ${token}`,
    });
  }

  // Google authentication
  static async googleAuth(googleToken: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
      token: googleToken,
    });
  }

  // Demo endpoint (for testing)
  static async demo(): Promise<ApiResponse<any>> {
    return apiClient.get(API_ENDPOINTS.AUTH.DEMO);
  }
} 