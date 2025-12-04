import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

// --- Configuration Constants ---
const PROFILE_IMAGE_URL = 'https://avatars.githubusercontent.com/u/148160741?v=4';

// --- Component 1: Custom Header (Reused for uniformity and updated vertical padding) ---
const AppHeader = () => {
  return (
    <View style={headerStyles.headerContainer}>
      <View style={headerStyles.logoGroup}>
        <Image 
                source={require('../../assets/images/logo.png')} 
                style={headerStyles.logoIcon}/>
        <Text style={headerStyles.logoText}>Insightify</Text>
      </View>
      <Image
        source={{ uri: PROFILE_IMAGE_URL }} 
        style={headerStyles.profileImage}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    </View>
  );
};

type SettingItemProps = {
    icon: string;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
};
// --- Component 2: Reusable Setting Item ---
const SettingItem = ({ icon, label, onPress, isDestructive = false }: SettingItemProps) => {
    return (
        <TouchableOpacity style={settingsStyles.itemContainer} onPress={onPress}>
            <Text style={settingsStyles.itemIcon}>{icon}</Text>
            <Text style={[
                settingsStyles.itemLabel,
                isDestructive && settingsStyles.destructiveText
            ]}>
                {label}
            </Text>
            <Text style={settingsStyles.arrowIcon}>›</Text>
        </TouchableOpacity>
    );
};
type ProfileScreenProps = {
  handlePress: (setting: string) => void;
};
// --- Main Screen Component ---
const ProfileScreen = () => {
  const router = useRouter();
  const user = auth.currentUser;

  // Dummy handlers for UI demo
  const handlePress = (setting: string)=> {
    console.log(`Navigating to ${setting} screen`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The user will be redirected to the login screen.
      router.replace('/login');
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred while logging out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader />

        {/* Profile Card */}
        <View style={profileStyles.profileCard}>
            <Image
                source={{ uri: PROFILE_IMAGE_URL }}
                style={profileStyles.largeProfileImage}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
            <Text style={profileStyles.nameText}>{user?.displayName || "User"}</Text>
            <Text style={profileStyles.emailText}>{user?.email}</Text>
            
            <TouchableOpacity 
                style={profileStyles.editButton}
                onPress={() => handlePress('Edit Profile')}
            >
                <Text style={profileStyles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>

        {/* --- Settings Section: Account --- */}
        <Text style={settingsStyles.sectionTitle}>Account</Text>
        <View style={settingsStyles.card}>
            <SettingItem 
                icon="👤" 
                label="Personal Information" 
                onPress={() => handlePress('Personal Info')}
            />
            <View style={settingsStyles.separator} />
            <SettingItem 
                icon="🔒" 
                label="Security & Password" 
                onPress={() => handlePress('Security')}
            />
        </View>

        {/* --- Settings Section: Data & Analytics (Based on Context) --- */}
        <Text style={settingsStyles.sectionTitle}>Data Management</Text>
        <View style={settingsStyles.card}>
            <SettingItem 
                icon="🔔" 
                label="Notification Settings" 
                onPress={() => handlePress('Notifications')}
            />
            <View style={settingsStyles.separator} />
            <SettingItem 
                icon="📤" 
                label="Export/Backup Data" 
                onPress={() => handlePress('Export')}
            />
            <View style={settingsStyles.separator} />
            <SettingItem 
                icon="☁️" 
                label="Data Synchronization" 
                onPress={() => handlePress('Sync')}
            />
        </View>
        
        {/* --- Settings Section: Support & Legal --- */}
        <Text style={settingsStyles.sectionTitle}>Support & About</Text>
        <View style={settingsStyles.card}>
            <SettingItem 
                icon="ℹ️" 
                label="App Version & License" 
                onPress={() => handlePress('About')}
            />
            <View style={settingsStyles.separator} />
            <SettingItem 
                icon="❓" 
                label="Help & FAQ" 
                onPress={() => handlePress('Help')}
            />
            <View style={settingsStyles.separator} />
            <SettingItem 
                icon="📜" 
                label="Terms and Privacy Policy" 
                onPress={() => handlePress('Terms')}
            />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
            style={settingsStyles.logoutButton}
            onPress={handleLogout}
        >
            <Text style={settingsStyles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheets ---

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    contentContainer: { paddingBottom: 40 },
});

// Header Styles (Updated padding vertical to 20)
const headerStyles = StyleSheet.create({
    headerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 20, // UPDATED: increased vertical padding
        marginBottom: 10 
    },
    logoGroup: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: {  width: 42, height: 42, marginRight: 1, marginTop: 3, resizeMode: 'contain' },
    logoText: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
    profileImage: { 
        width: 45, 
        height: 45, 
        borderRadius: 22.5, 
        borderWidth: 2, 
        borderColor: '#4F46E5' 
    },
});

// Profile Card Styles
const profileStyles = StyleSheet.create({
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    largeProfileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#4F46E5',
    },
    nameText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1F2937',
    },
    emailText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },
    editButton: {
        backgroundColor: '#D1D5DB',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});

// Settings Styles
const settingsStyles = StyleSheet.create({
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden', // Ensures separator stays inside
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1.41,
        elevation: 2,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    itemIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    itemLabel: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '500',
    },
    destructiveText: {
        color: '#EF4444', // Red for log out/destructive actions
    },
    arrowIcon: {
        fontSize: 18,
        color: '#9CA3AF',
        fontWeight: '300',
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 55, // Aligns with the label text
    },
    logoutButton: {
        backgroundColor: '#EF4444', // Red button
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default ProfileScreen;
