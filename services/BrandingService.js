/**
 * Branding Service
 * 
 * Handles dynamic branding and theming based on WordPress site configuration
 */

class BrandingService {
  constructor() {
    this.defaultTheme = {
      primaryColor: '#007AFF',
      secondaryColor: '#5856D6',
      backgroundColor: '#f8f9fa',
      textColor: '#1a1a1a',
      secondaryTextColor: '#666',
      borderColor: '#e1e5e9',
      successColor: '#34C759',
      errorColor: '#FF3B30',
      warningColor: '#FF9500',
    };
    
    this.currentTheme = { ...this.defaultTheme };
  }

  /**
   * Update theme based on site configuration
   */
  updateTheme(siteConfig) {
    if (siteConfig && siteConfig.branding) {
      this.currentTheme = {
        ...this.defaultTheme,
        ...siteConfig.branding,
      };
    } else {
      this.currentTheme = { ...this.defaultTheme };
    }
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Get primary color
   */
  getPrimaryColor() {
    return this.currentTheme.primaryColor;
  }

  /**
   * Get secondary color
   */
  getSecondaryColor() {
    return this.currentTheme.secondaryColor;
  }

  /**
   * Get background color
   */
  getBackgroundColor() {
    return this.currentTheme.backgroundColor;
  }

  /**
   * Get text color
   */
  getTextColor() {
    return this.currentTheme.textColor;
  }

  /**
   * Get secondary text color
   */
  getSecondaryTextColor() {
    return this.currentTheme.secondaryTextColor;
  }

  /**
   * Create dynamic styles based on theme
   */
  createStyles(baseStyles) {
    const themedStyles = {};
    
    Object.keys(baseStyles).forEach(key => {
      themedStyles[key] = { ...baseStyles[key] };
      
      // Replace color values with theme colors
      if (themedStyles[key].color === '#007AFF') {
        themedStyles[key].color = this.getPrimaryColor();
      }
      if (themedStyles[key].backgroundColor === '#007AFF') {
        themedStyles[key].backgroundColor = this.getPrimaryColor();
      }
      if (themedStyles[key].borderColor === '#007AFF') {
        themedStyles[key].borderColor = this.getPrimaryColor();
      }
      if (themedStyles[key].shadowColor === '#007AFF') {
        themedStyles[key].shadowColor = this.getPrimaryColor();
      }
    });

    return themedStyles;
  }

  /**
   * Get app name from site config
   */
  getAppName(siteConfig) {
    return siteConfig?.appName || siteConfig?.name || 'Booknetic';
  }

  /**
   * Get site logo URL
   */
  getLogoUrl(siteConfig) {
    return siteConfig?.logo || null;
  }

  /**
   * Get favicon URL
   */
  getFaviconUrl(siteConfig) {
    return siteConfig?.favicon || null;
  }
}

export default new BrandingService();
