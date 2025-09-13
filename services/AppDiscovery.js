/**
 * App Discovery Service
 * 
 * Automatically discovers and configures the app for any WordPress site
 * with the Booknetic plugin installed
 */

class AppDiscovery {
  constructor() {
    this.discoveredSites = [];
    this.currentSite = null;
  }

  /**
   * Discover WordPress sites with Booknetic plugin
   * This can scan common WordPress URLs or use a discovery service
   */
  async discoverSites() {
    // This could be expanded to scan for sites or use a central registry
    return [];
  }

  /**
   * Test if a WordPress site has the Booknetic plugin
   */
  async testSite(url) {
    try {
      const cleanUrl = this.cleanUrl(url);
      const testEndpoint = `${cleanUrl}/wp-json/booknetic-app/v1/info`;
      
      const response = await fetch(testEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          site: {
            url: cleanUrl,
            name: data.site_name || 'Booknetic Site',
            appName: data.app_name || 'Booknetic App',
            version: data.api_version,
            features: data.features || {},
          },
          data: data,
        };
      }
    } catch (error) {
      console.log(`Site ${url} not compatible:`, error.message);
    }

    return { success: false };
  }

  /**
   * Clean and validate URL
   */
  cleanUrl(url) {
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    
    // Add https if no protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    return url;
  }

  /**
   * Get site configuration
   */
  async getSiteConfig(url) {
    const result = await this.testSite(url);
    if (result.success) {
      return result.site;
    }
    throw new Error('Site not compatible with Booknetic app');
  }

  /**
   * Save discovered site
   */
  async saveSite(site) {
    try {
      const sites = await this.getSavedSites();
      const existingIndex = sites.findIndex(s => s.url === site.url);
      
      if (existingIndex >= 0) {
        sites[existingIndex] = site;
      } else {
        sites.push(site);
      }

      await AsyncStorage.setItem('booknetic_sites', JSON.stringify(sites));
      return true;
    } catch (error) {
      console.error('Error saving site:', error);
      return false;
    }
  }

  /**
   * Get saved sites
   */
  async getSavedSites() {
    try {
      const sites = await AsyncStorage.getItem('booknetic_sites');
      return sites ? JSON.parse(sites) : [];
    } catch (error) {
      console.error('Error getting saved sites:', error);
      return [];
    }
  }

  /**
   * Set current active site
   */
  async setCurrentSite(site) {
    this.currentSite = site;
    await AsyncStorage.setItem('current_booknetic_site', JSON.stringify(site));
  }

  /**
   * Get current active site
   */
  async getCurrentSite() {
    try {
      const site = await AsyncStorage.getItem('current_booknetic_site');
      return site ? JSON.parse(site) : null;
    } catch (error) {
      console.error('Error getting current site:', error);
      return null;
    }
  }
}

export default new AppDiscovery();
