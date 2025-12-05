import { useRouter } from 'expo-router';
import React from 'react';
import {
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

// --- Main Screen Component ---
const TermsPrivacyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Terms & Privacy" />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <Text style={styles.lastUpdated}>Last Updated: December 2025</Text>

        {/* Section 1: Terms of Service */}
        <Text style={styles.sectionTitle}>Terms of Service</Text>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            Welcome to Insightify. By using our app, you agree to these terms. Please read them carefully.
          </Text>
          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing or using Insightify, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </Text>
          <Text style={styles.heading}>2. Use License</Text>
          <Text style={styles.paragraph}>
            Permission is granted to temporarily download one copy of the materials (information or software) on Insightify for personal, non-commercial transitory viewing only.
          </Text>
           <Text style={styles.heading}>3. Disclaimer</Text>
          <Text style={styles.paragraph}>
            The materials on Insightify are provided on an 'as is' basis. Insightify makes no warranties, expressed or implied.
          </Text>
        </View>

        {/* Section 2: Privacy Policy */}
        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            Your privacy is important to us. It is Insightify's policy to respect your privacy regarding any information we may collect from you across our app.
          </Text>
          <Text style={styles.heading}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
          </Text>
          <Text style={styles.heading}>2. Data Storage</Text>
          <Text style={styles.paragraph}>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.footer}>
            <Text style={styles.footerText}>
                Questions? Contact us at legal@insightify.app
            </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsPrivacyScreen;

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },

  lastUpdated: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontStyle: 'italic',
  },

  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },

  // Typography
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4F46E5', // Insightify Accent
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563', // Dark gray for readability
    marginBottom: 5,
  },
  
  // Footer
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
  }
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