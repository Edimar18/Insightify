import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- Component 1: Custom Header (Reused) ---
const AppHeader = ({ title }: { title: string }) => {
  const router = useRouter();
  return (
    <View style={headerStyles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={headerStyles.backButton}>
        <Text style={headerStyles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={headerStyles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

// --- Component 2: License Row Item ---
const LicenseRow = ({ library, license }: { library: string; license: string }) => (
  <View style={styles.licenseRow}>
    <Text style={styles.libraryName}>{library}</Text>
    <Text style={styles.licenseType}>{license}</Text>
  </View>
);

// --- Main Screen Component ---
const AppVersionLicenseScreen = () => {
  // Update this path based on your folder structure (usually ../assets if in app/ folder)
  const logoSource = require('../assets/images/logo.png'); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="About" />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Section 1: App Info (Hero) */}
        <View style={styles.heroContainer}>
          <View style={styles.logoWrapper}>
            <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>Insightify</Text>
          <Text style={styles.versionText}>Version 1.0.0 (Build 102)</Text>
          <Text style={styles.copyrightText}>© 2025 Insightify Inc. All rights reserved.</Text>
        </View>

        {/* Section 2: Legal Documents */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
            <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkLabel}>Terms of Service</Text>
                <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkLabel}>Privacy Policy</Text>
                <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
        </View>

        {/* Section 3: Open Source Licenses */}
        <Text style={styles.sectionTitle}>Open Source Libraries</Text>
        <View style={styles.card}>
            <LicenseRow library="React Native" license="MIT" />
            <View style={styles.separator} />
            <LicenseRow library="Expo" license="MIT" />
            <View style={styles.separator} />
            <LicenseRow library="Firebase" license="Apache 2.0" />
            <View style={styles.separator} />
            <LicenseRow library="Moti" license="MIT" />
            <View style={styles.separator} />
            <LicenseRow library="React Navigation" license="MIT" />
        </View>

        <Text style={styles.footerNote}>
          unta maka uno sir :3
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AppVersionLicenseScreen;

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },

  // Hero Section
  heroContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logoWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },

  // Typography
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },
  
  // Rows
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  licenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  libraryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  licenseType: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },

  // Utilities
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  footerNote: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 40,
    marginBottom: 20,
  },
});

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 30,
    color: '#4F46E5', 
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
});