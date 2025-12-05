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

// --- Component 2: Help Option Row ---
const HelpOption = ({ icon, title, subtitle, onPress }: any) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{icon}</Text>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.arrowIcon}>›</Text>
  </TouchableOpacity>
);

// --- Main Screen Component ---
const HelpFaqScreen = () => {
  const router = useRouter();

  const handlePlaceholderPress = (feature: string) => {
    console.log(`Navigating to ${feature}...`);
    // Future: router.push('/guides') etc.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Help & FAQ" />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Header Text */}
        <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <Text style={styles.heroSubtitle}>Select a category below to find answers.</Text>
        </View>

        {/* Section 1: Self Service */}
        <Text style={styles.sectionTitle}>Resources</Text>
        <View style={styles.card}>
          <HelpOption 
            icon="📚" 
            title="User Guide" 
            subtitle="Learn how to use Insightify features"
            onPress={() => handlePlaceholderPress('User Guide')}
          />
          <View style={styles.separator} />
          <HelpOption 
            icon="🤔" 
            title="FAQ" 
            subtitle="Frequently asked questions"
            onPress={() => handlePlaceholderPress('FAQ')}
          />
        </View>

        {/* Section 2: Contact */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.card}>
          <HelpOption 
            icon="🎧" 
            title="Customer Service" 
            subtitle="Chat with our support team"
            onPress={() => handlePlaceholderPress('Customer Service')}
          />
           <View style={styles.separator} />
           <HelpOption 
            icon="🐛" 
            title="Report a Bug" 
            subtitle="Let us know if something is broken"
            onPress={() => handlePlaceholderPress('Bug Report')}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpFaqScreen;

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },

  // Hero
  heroSection: {
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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

  // Section Headers
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },

  // Option Rows
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF', // Very light indigo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
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
    marginLeft: 55, // Align with text
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