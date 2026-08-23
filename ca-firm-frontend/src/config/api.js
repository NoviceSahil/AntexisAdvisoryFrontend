// API Configuration
// This file centralizes all API endpoint configurations

// Base API URL from environment variables. Empty string means "same origin"
// - correct for production, since server.js serves both the API and the
// built frontend from one process. Local dev overrides this via
// .env.development (loaded only by `npm start`, never `npm run build`).
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// API Endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  APPLY: `${API_BASE_URL}/api/apply`,
  CONTACT: `${API_BASE_URL}/api/contact`,
  BLOGS: `${API_BASE_URL}/api/blogs`,
  BLOG_BY_ID: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  COMPLIANCE_DATES: `${API_BASE_URL}/api/compliance`,
  SERVICES: `${API_BASE_URL}/api/services`,
  SITE_SETTINGS: `${API_BASE_URL}/api/settings`,

  // Admin session
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_LOGOUT: `${API_BASE_URL}/api/admin/logout`,
  ADMIN_ME: `${API_BASE_URL}/api/admin/me`,

  // Admin: applications
  ADMIN_APPLICATIONS: `${API_BASE_URL}/api/applications`,
  ADMIN_APPLICATIONS_ALL: `${API_BASE_URL}/api/applications/all`,
  ADMIN_APPLICATION_STATUS: (id) => `${API_BASE_URL}/api/applications/${id}/status`,
  ADMIN_DOWNLOAD_RESUME: (filename) => `${API_BASE_URL}/api/download-resume/${filename}`,

  // Admin: contact enquiries
  ADMIN_CONTACTS: `${API_BASE_URL}/api/contact`,
  ADMIN_CONTACTS_ALL: `${API_BASE_URL}/api/contact/all`,
  ADMIN_CONTACT_STATUS: (id) => `${API_BASE_URL}/api/contact/${id}/status`,

  // Admin: blogs
  ADMIN_BLOGS_ALL: `${API_BASE_URL}/api/blogs/all`,
  ADMIN_CREATE_BLOG: `${API_BASE_URL}/api/blogs`,
  ADMIN_UPDATE_BLOG: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  ADMIN_BLOG_VISIBILITY: (id) => `${API_BASE_URL}/api/blogs/${id}/visibility`,
  ADMIN_DELETE_BLOG: (id) => `${API_BASE_URL}/api/blogs/${id}`,

  // Admin: compliance calendar
  ADMIN_COMPLIANCE_ALL: `${API_BASE_URL}/api/compliance/all`,
  ADMIN_CREATE_COMPLIANCE: `${API_BASE_URL}/api/compliance`,
  ADMIN_UPDATE_COMPLIANCE: (id) => `${API_BASE_URL}/api/compliance/${id}`,
  ADMIN_COMPLIANCE_VISIBILITY: (id) => `${API_BASE_URL}/api/compliance/${id}/visibility`,
  ADMIN_DELETE_COMPLIANCE: (id) => `${API_BASE_URL}/api/compliance/${id}`,

  // Admin: services
  ADMIN_SERVICES_ALL: `${API_BASE_URL}/api/services/all`,
  ADMIN_CREATE_SERVICE: `${API_BASE_URL}/api/services`,
  ADMIN_UPDATE_SERVICE: (id) => `${API_BASE_URL}/api/services/${id}`,
  ADMIN_SERVICE_VISIBILITY: (id) => `${API_BASE_URL}/api/services/${id}/visibility`,
  ADMIN_DELETE_SERVICE: (id) => `${API_BASE_URL}/api/services/${id}`,

  // Admin: site settings (stats + contact info)
  ADMIN_UPDATE_SETTINGS: `${API_BASE_URL}/api/settings`,

  // Admin: visitor analytics
  ADMIN_VISITOR_STATS: `${API_BASE_URL}/api/visitor-stats`,
  TRACK_VISIT: `${API_BASE_URL}/api/track-visit`,

  // Super admin: manage admin accounts
  SUPER_ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  SUPER_ADMIN_CREATE_USER: `${API_BASE_URL}/api/admin/users`,
  SUPER_ADMIN_UPDATE_USER: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
  SUPER_ADMIN_DELETE_USER: (id) => `${API_BASE_URL}/api/admin/users/${id}`,

  // File upload base URL
  UPLOADS: `${API_BASE_URL}/uploads`,
  BLOG_IMAGES: `${API_BASE_URL}/uploads/blog-images`,
  BLOG_DOCUMENTS: `${API_BASE_URL}/uploads/blog-documents`,
};

const API_SETTINGS = {
  API_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
    },
    // Admin endpoints authenticate via an httpOnly session cookie, so every
    // request needs to carry credentials - public endpoints don't mind.
    withCredentials: true,
  },
  MULTIPART_CONFIG: {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  },
};

export const API_CONFIG = API_SETTINGS.API_CONFIG;
export const MULTIPART_CONFIG = API_SETTINGS.MULTIPART_CONFIG;
