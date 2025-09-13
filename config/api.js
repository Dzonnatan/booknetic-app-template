/**
 * API Configuration
 * 
 * Update this file with your WordPress site URL
 */

// WordPress Site Configuration
export const API_CONFIG = {
  // Replace with your actual WordPress site URL
  // Example: WORDPRESS_URL: 'https://mybooknetic.com',
  WORDPRESS_URL: '{{WORDPRESS_URL}}', // This will be replaced during APK generation
  
  // Development settings
  DEBUG: __DEV__, // Automatically true in development mode
  
  // API timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry attempts for failed requests
  RETRY_ATTEMPTS: 3,
};

// Helper function to get the WordPress URL
export const getWordPressURL = () => {
  if (!API_CONFIG.WORDPRESS_URL || API_CONFIG.WORDPRESS_URL === '{{WORDPRESS_URL}}') {
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
