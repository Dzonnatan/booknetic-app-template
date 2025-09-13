/**
 * WordPress API Service
 * 
 * Handles communication between the React Native app and WordPress site
 */

import { getWordPressURL, isValidURL } from '../config/api';

class WordPressAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.apiVersion = 'v1';
    this.endpoints = {
      info: '/wp-json/booknetic-app/v1/info',
      posts: '/wp-json/booknetic-app/v1/posts',
      pages: '/wp-json/booknetic-app/v1/pages',
      categories: '/wp-json/booknetic-app/v1/categories',
      appContent: '/wp-json/booknetic-app/v1/app-content',
      contact: '/wp-json/booknetic-app/v1/contact',
      login: '/wp-json/booknetic-app/v1/auth/login',
      logout: '/wp-json/booknetic-app/v1/auth/logout',
      user: '/wp-json/booknetic-app/v1/auth/user',
    };
  }

  /**
   * Make HTTP request
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      console.error('URL:', url);
      console.error('Options:', requestOptions);
      throw error;
    }
  }

  /**
   * Get app information
   */
  async getAppInfo() {
    return this.makeRequest(this.endpoints.info);
  }

  /**
   * Get posts with pagination
   */
  async getPosts(page = 1, perPage = 10, category = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (category) {
      params.append('category', category);
    }

    const endpoint = `${this.endpoints.posts}?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get single post by ID
   */
  async getPost(id) {
    const endpoint = `${this.endpoints.posts}/${id}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get pages
   */
  async getPages() {
    return this.makeRequest(this.endpoints.pages);
  }

  /**
   * Get categories
   */
  async getCategories() {
    return this.makeRequest(this.endpoints.categories);
  }

  /**
   * Get app-specific content
   */
  async getAppContent() {
    return this.makeRequest(this.endpoints.appContent);
  }

  /**
   * Submit contact form
   */
  async submitContactForm(formData) {
    const { name, email, message } = formData;
    
    if (!name || !email || !message) {
      throw new Error('All fields are required');
    }

    return this.makeRequest(this.endpoints.contact, {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }),
    });
  }

  /**
   * Search posts
   */
  async searchPosts(query, page = 1, perPage = 10) {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const endpoint = `${this.endpoints.posts}?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(categorySlug, page = 1, perPage = 10) {
    return this.getPosts(page, perPage, categorySlug);
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(limit = 5) {
    const data = await this.getPosts(1, limit);
    return data.posts.filter(post => post.featured_image);
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 5) {
    const data = await this.getPosts(1, limit);
    return data.posts;
  }

  /**
   * User login
   */
  async login(username, password) {
    return this.makeRequest(this.endpoints.login, {
      method: 'POST',
      body: JSON.stringify({
        username: username.trim(),
        password: password,
      }),
    });
  }

  /**
   * User logout
   */
  async logout() {
    return this.makeRequest(this.endpoints.logout, {
      method: 'POST',
    });
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return this.makeRequest(this.endpoints.user);
  }

  /**
   * Update base URL (for dynamic site switching)
   */
  updateBaseURL(newURL) {
    this.baseURL = newURL;
    console.log('WordPress API URL updated to:', newURL);
  }
}

// Create default instance
const WORDPRESS_URL = getWordPressURL();

if (!WORDPRESS_URL) {
  console.error('❌ WordPress URL not configured. Please update config/api.js');
}

const wordPressAPI = new WordPressAPI(WORDPRESS_URL || 'https://placeholder.com');

export default wordPressAPI;
export { WordPressAPI };
