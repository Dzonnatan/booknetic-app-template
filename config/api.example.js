/**
 * API Configuration Example
 * 
 * Copy this file to api.js and update with your WordPress site URL
 */

// WordPress Site Configuration
export const API_CONFIG = {
  // Replace with your actual WordPress site URL
  // Examples:
  // WORDPRESS_URL: 'https://mybooknetic.com',
  // WORDPRESS_URL: 'https://booknetic.mysite.com',
  // WORDPRESS_URL: 'https://localhost:8080', // For local development
  WORDPRESS_URL: 'https://your-wordpress-site.com',
  
  // Development settings
  DEBUG: __DEV__, // Automatically true in development mode
  
  // API timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry attempts for failed requests
  RETRY_ATTEMPTS: 3,
};

// Helper function to get the WordPress URL
export const getWordPressURL = () => {
  if (!API_CONFIG.WORDPRESS_URL || API_CONFIG.WORDPRESS_URL === 'https://your-wordpress-site.com') {
    console.warn('⚠️  WordPress URL not configured! Please update config/api.js');
    return null;
  }
  return API_CONFIG.WORDPRESS_URL;
};

// Helper function to validate URL
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
