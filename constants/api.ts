// API Configuration
export const API_CONFIG = {
  // Your Go backend auth service runs on port 3008
  BASE_URL: 'http://localhost:3008/api', // Update this to your actual backend URL
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Add your Google OAuth Client ID here
  CLIENT_ID: 'your_google_client_id_here', // Replace with your actual Google Client ID
  // For React Native, you'll need to configure this in your app.json as well
};

// API Endpoints - matching your Go backend routes
export const API_ENDPOINTS = {
  AUTH: {
    CREATE_TOKEN: '/auth/createToken',
    VERIFY_TOKEN: '/auth/verifyToken',
    GOOGLE_AUTH: '/auth/google',
    DEMO: '/auth/demo',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    STREAM: '/notifications/stream',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
};

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  GOOGLE_AUTH_ERROR: 'Google authentication failed. Please try again.',
}; 