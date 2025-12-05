import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// CHANGED: Only one "../" is needed since the file is in the app folder
import { auth } from '../firebaseConfig';

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

// --- Component 2: Toggle Row (Reused) ---
const SecurityToggle = ({ label, description, value, onToggle }: any) => (
  <View style={styles.toggleRow}>
    <View style={styles.textContainer}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && <Text style={styles.settingDescription}>{description}</Text>}
    </View>
    <Switch
      trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
      thumbColor={"#FFFFFF"}
      ios_backgroundColor="#D1D5DB"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

// --- Component 3: Action Row (For buttons like "Change Password") ---
const ActionRow = ({ label, onPress, isDestructive = false }: any) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <Text style={[styles.settingLabel, isDestructive && styles.destructiveText]}>
      {label}
    </Text>
    <Text style={styles.arrowIcon}>›</Text>
  </TouchableOpacity>
);

// --- Main Screen Component ---
const SecurityPasswordScreen = () => {
  const router = useRouter();
  const [biometrics, setBiometrics] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Function to handle Password Reset
  const handleChangePassword = () => {
    const email = auth.currentUser?.email;
    if (email) {
      Alert.alert(
        "Change Password",
        `Send a password reset email to ${email}?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Send Email", 
            onPress: async () => {
              try {
                await sendPasswordResetEmail(auth, email);
                Alert.alert("Success", "Password reset email sent!");
              } catch (error: any) {
                Alert.alert("Error", error.message);
              }
            } 
          }
        ]
      );
    } else {
        Alert.alert("Error", "No email found for this user.");
    }
  };

  // Function to handle Account Deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure? This action cannot be undone and you will lose all your data.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Delete logic here") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Security" />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Section 1: Login Options */}
        <Text style={styles.sectionTitle}>Login Options</Text>
        <View style={styles.card}>
          <SecurityToggle 
            label="Biometric Login" 
            description="Use FaceID or TouchID to log in"
            value={biometrics} 
            onToggle={setBiometrics} 
          />
        </View>

        {/* Section 2: Password Management */}
        <Text style={styles.sectionTitle}>Password</Text>
        <View style={styles.card}>
            <ActionRow 
                label="Change Password" 
                onPress={handleChangePassword} 
            />
            <View style={styles.separator} />
            <SecurityToggle 
                label="Two-Factor Authentication" 
                description="Add an extra layer of security"
                value={twoFactor} 
                onToggle={setTwoFactor} 
            />
        </View>

        {/* Section 3: Devices (Mock Data) */}
        <Text style={styles.sectionTitle}>Active Devices</Text>
        <View style={styles.card}>
             <View style={styles.deviceRow}>
                <Text style={styles.deviceIcon}>📱</Text>
                <View>
                    <Text style={styles.settingLabel}>iPhone 14 Pro</Text>
                    <Text style={styles.settingDescription}>This device • Mobile App</Text>
                </View>
             </View>
        </View>

        {/* Section 4: Danger Zone */}
        <Text style={[styles.sectionTitle, { color: '#EF4444', marginTop: 30 }]}>Danger Zone</Text>
        <View style={styles.card}>
             <ActionRow 
                label="Delete Account" 
                onPress={handleDeleteAccount}
                isDestructive
             />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SecurityPasswordScreen;

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },

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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  // Text Styles
  textContainer: { flex: 1, paddingRight: 10 },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280', 
    marginTop: 2,
  },
  destructiveText: {
    color: '#EF4444',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  deviceIcon: {
    fontSize: 24,
    marginRight: 15,
  },

  // Utilities
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
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