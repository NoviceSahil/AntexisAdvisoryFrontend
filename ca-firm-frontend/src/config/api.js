// API Configuration
// This file centralizes all API endpoint configurations

// Base API URL from environment variables
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Application endpoints
  APPLY: `${API_BASE_URL}/api/apply`,
  
  // Contact endpoints
  CONTACT: `${API_BASE_URL}/api/contact`,
  
  // Blog endpoints
  BLOGS: `${API_BASE_URL}/api/blogs`,
  BLOG_BY_ID: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  
  // Estimator endpoints
  ESTIMATOR_OPTIONS: `${API_BASE_URL}/api/estimator-options`,
  ADMIN_ESTIMATOR_OPTIONS: `${API_BASE_URL}/api/admin/estimator-options`,
  ADMIN_CREATE_ESTIMATOR_OPTION: `${API_BASE_URL}/api/admin/estimator-options`,
  ADMIN_UPDATE_ESTIMATOR_OPTION: (id) => `${API_BASE_URL}/api/admin/estimator-options/${id}`,
  ADMIN_DELETE_ESTIMATOR_OPTION: (id) => `${API_BASE_URL}/api/admin/estimator-options/${id}`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_APPLICATIONS: `${API_BASE_URL}/api/admin/applications`,
  ADMIN_CONTACTS: `${API_BASE_URL}/api/admin/contacts`,
  ADMIN_BLOGS: `${API_BASE_URL}/api/admin/blogs`,
  ADMIN_DELETE_APPLICATION: (id) => `${API_BASE_URL}/api/admin/applications/${id}`,
  ADMIN_DELETE_CONTACT: (id) => `${API_BASE_URL}/api/admin/contacts/${id}`,
  ADMIN_DELETE_BLOG: (id) => `${API_BASE_URL}/api/admin/blogs/${id}`,
  ADMIN_CREATE_BLOG: `${API_BASE_URL}/api/admin/blogs`,
  ADMIN_UPDATE_BLOG: (id) => `${API_BASE_URL}/api/admin/blogs/${id}`,
  
  // Super Admin endpoints
  SUPER_ADMIN_USERS: `${API_BASE_URL}/api/super-admin/users`,
  SUPER_ADMIN_CREATE_USER: `${API_BASE_URL}/api/super-admin/users`,
  SUPER_ADMIN_DELETE_USER: (id) => `${API_BASE_URL}/api/super-admin/users/${id}`,
  
  // File upload base URL
  UPLOADS: `${API_BASE_URL}/uploads`,
  BLOG_IMAGES: `${API_BASE_URL}/uploads/blog-images`,
  BLOG_DOCUMENTS: `${API_BASE_URL}/uploads/blog-documents`,
};

// Default axios configuration
export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
};

// Multipart form data configuration
export const MULTIPART_CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  MULTIPART_CONFIG,
};
