import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppDiscovery from '../services/AppDiscovery';
import wordPressAPI from '../services/WordPressAPI';

const SiteSelectionScreen = ({ onSiteSelected }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSites, setSavedSites] = useState([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);

  useEffect(() => {
    loadSavedSites();
  }, []);

  const loadSavedSites = async () => {
    try {
      const sites = await AppDiscovery.getSavedSites();
      setSavedSites(sites);
    } catch (error) {
      console.error('Error loading saved sites:', error);
    } finally {
      setIsLoadingSites(false);
    }
  };

  const handleAddSite = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a website URL');
      return;
    }

    setIsLoading(true);

    try {
      const siteConfig = await AppDiscovery.getSiteConfig(url);
      await AppDiscovery.saveSite(siteConfig);
      await AppDiscovery.setCurrentSite(siteConfig);
      
      // Update WordPress API with new URL
      wordPressAPI.updateBaseURL(siteConfig.url);
      
      onSiteSelected(siteConfig);
    } catch (error) {
      Alert.alert(
        'Site Not Found',
        'This website does not have the Booknetic plugin installed or is not accessible. Please check the URL and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedSite = async (site) => {
    try {
      await AppDiscovery.setCurrentSite(site);
      wordPressAPI.updateBaseURL(site.url);
      onSiteSelected(site);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to this site');
    }
  };

  const handleRemoveSite = async (siteToRemove) => {
    try {
      const updatedSites = savedSites.filter(site => site.url !== siteToRemove.url);
      await AsyncStorage.setItem('booknetic_sites', JSON.stringify(updatedSites));
      setSavedSites(updatedSites);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove site');
    }
  };

  const renderSavedSite = ({ item }) => (
    <TouchableOpacity
      style={styles.savedSiteItem}
      onPress={() => handleSelectSavedSite(item)}
    >
      <View style={styles.siteInfo}>
        <Text style={styles.siteName}>{item.appName}</Text>
        <Text style={styles.siteUrl}>{item.url}</Text>
      </View>
      <View style={styles.siteActions}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveSite(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="business-outline" size={60} color="#007AFF" />
          <Text style={styles.logoText}>Booknetic</Text>
        </View>
        <Text style={styles.subtitle}>Connect to your WordPress site</Text>
      </View>

      <View style={styles.content}>
        {/* Add New Site */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Site</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="globe-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your website URL (e.g., mysite.com)"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!isLoading}
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={handleAddSite}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="add-outline" size={20} color="white" />
                <Text style={styles.addButtonText}>Connect Site</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Saved Sites */}
        {savedSites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Sites</Text>
            {isLoadingSites ? (
              <ActivityIndicator style={styles.loading} />
            ) : (
              <FlatList
                data={savedSites}
                renderItem={renderSavedSite}
                keyExtractor={(item) => item.url}
                style={styles.sitesList}
              />
            )}
          </View>
        )}

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.helpText}>
            Make sure your WordPress site has the Booknetic plugin installed and activated.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sitesList: {
    maxHeight: 200,
  },
  savedSiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  siteInfo: {
    flex: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  siteUrl: {
    fontSize: 14,
    color: '#666',
  },
  siteActions: {
    marginLeft: 12,
  },
  removeButton: {
    padding: 8,
  },
  loading: {
    marginVertical: 20,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default SiteSelectionScreen;
