import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- Component 1: Custom Header (reused) ---
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

// --- Component 2: Notification Toggle Row ---
const NotificationToggle = ({ label, description, value, onToggle }: any) => (
  <View style={styles.toggleRow}>
    <View style={styles.textContainer}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <Switch
      trackColor={{ false: "#D1D5DB", true: "#4F46E5" }} // Accent color on true
      thumbColor={"#FFFFFF"}
      ios_backgroundColor="#D1D5DB"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

// --- Main Screen Component ---
const NotificationSettings = () => {
  // State for toggles
  const [pauseAll, setPauseAll] = useState(false);
  // Removed "Activity" state variables (comments/friends)
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Notifications" />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Section 1: General */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <NotificationToggle 
            label="Pause All" 
            description="Temporarily pause all notifications"
            value={pauseAll} 
            onToggle={setPauseAll} 
          />
        </View>

        {/* Section 2: Updates (Moved up since Activity is gone) */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Updates</Text>
          
          <NotificationToggle 
            label="Email Newsletters" 
            description="Receive weekly summaries and news"
            value={emailUpdates} 
            onToggle={setEmailUpdates} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettings;

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { padding: 20 },

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
    color: '#1F2937',
    marginBottom: 15,
  },
  
  // Toggle Row Specifics
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280', // Secondary gray
    marginTop: 2,
  },

  // Utilities
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 5,
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
    color: '#4F46E5', // Accent Color
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
});