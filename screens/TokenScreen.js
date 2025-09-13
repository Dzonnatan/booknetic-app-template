import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WordPressAPI from '../services/WordPressAPI';

export default function TokenScreen({ onTokenValidated }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);

  const handleTokenValidation = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter a valid token');
      return;
    }

    setIsLoading(true);
    try {
      // Validate token with WordPress
      const response = await WordPressAPI.validateToken(token);
      
      if (response.valid) {
        setSiteInfo(response.site_info);
        onTokenValidated(response.site_info, token);
      } else {
        Alert.alert('Invalid Token', 'The token you entered is not valid. Please check and try again.');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      Alert.alert('Connection Error', 'Unable to validate token. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="key-outline" size={64} color="#007AFF" />
          <Text style={styles.title}>Enter App Token</Text>
          <Text style={styles.subtitle}>
            Enter the token provided by your WordPress administrator to connect to your site
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>App Token</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your app token here"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleTokenValidation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Connect to Site</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {siteInfo && (
          <View style={styles.siteInfo}>
            <Text style={styles.siteInfoTitle}>Connected to:</Text>
            <Text style={styles.siteName}>{siteInfo.site_name}</Text>
            <Text style={styles.siteUrl}>{siteInfo.site_url}</Text>
          </View>
        )}

        <View style={styles.help}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <Text style={styles.helpText}>
            Contact your WordPress administrator to get your app token.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  siteInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  siteInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 2,
  },
  siteUrl: {
    fontSize: 14,
    color: '#388e3c',
  },
  help: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});
