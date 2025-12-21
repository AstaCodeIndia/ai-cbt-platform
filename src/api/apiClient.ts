import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Tests
  TESTS: '/tests',
  TEST_BY_ID: (id: string) => `/tests/${id}`,
  SUBMIT_TEST: (id: string) => `/tests/${id}/submit`,
  PUBLISH_TEST: (id: string) => `/tests/${id}/publish`,
  
  // Questions
  QUESTIONS: '/questions',
  QUESTION_BY_ID: (id: string) => `/questions/${id}`,
  
  // PDF Upload
  UPLOAD_PDF: '/admin/upload-pdf',
  EXTRACT_QUESTIONS: '/admin/extract-questions',
  
  // Student
  STUDENT_ANALYTICS: '/student/analytics',
  STUDENT_TESTS: '/student/tests',
  STUDENT_ATTEMPTS: '/student/attempts',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
};
