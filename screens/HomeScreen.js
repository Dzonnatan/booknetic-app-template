import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import wordPressAPI from '../services/WordPressAPI';

const HomeScreen = ({ user, onLogout }) => {
  const [appContent, setAppContent] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentData, postsData] = await Promise.all([
        wordPressAPI.getAppContent(),
        wordPressAPI.getRecentPosts(5)
      ]);
      
      setAppContent(contentData);
      setRecentPosts(postsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await wordPressAPI.logout();
              onLogout();
            } catch (error) {
              console.error('Logout error:', error);
              // Logout user locally even if API call fails
              onLogout();
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Ionicons name="person-circle" size={40} color="#007AFF" />
            ) : (
              <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user.displayName || user.username}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        {appContent?.hero_section && (
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>{appContent.hero_section.title}</Text>
            <Text style={styles.heroSubtitle}>{appContent.hero_section.subtitle}</Text>
            {appContent.hero_section.button_text && (
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>{appContent.hero_section.button_text}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Features Section */}
        {appContent?.features && appContent.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {appContent.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon || 'star'} size={24} color="#007AFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Posts</Text>
            {recentPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postItem}>
                <View style={styles.postContent}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postExcerpt} numberOfLines={2}>
                    {post.excerpt}
                  </Text>
                  <Text style={styles.postDate}>
                    {new Date(post.date).toLocaleDateString('en-US')}
                  </Text>
                </View>
                {post.featured_image && (
                  <View style={styles.postImage}>
                    <Ionicons name="image-outline" size={24} color="#ccc" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Contact Info Section */}
        {appContent?.contact_info && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              {appContent.contact_info.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color="#007AFF" />
                  <Text style={styles.contactText}>{appContent.contact_info.phone}</Text>
                </View>
              )}
              {appContent.contact_info.email && (
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color="#007AFF" />
                  <Text style={styles.contactText}>{appContent.contact_info.email}</Text>
                </View>
              )}
              {appContent.contact_info.address && (
                <View style={styles.contactItem}>
                  <Ionicons name="location-outline" size={20} color="#007AFF" />
                  <Text style={styles.contactText}>{appContent.contact_info.address}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!appContent && recentPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No content available</Text>
            <Text style={styles.emptyStateSubtext}>
              Contact administrator for more information
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchSiteButton: {
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  heroButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  postItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postContent: {
    flex: 1,
    marginRight: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;
