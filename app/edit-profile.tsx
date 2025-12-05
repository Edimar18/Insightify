import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../firebaseConfig'; // Make sure you export 'db' from firebaseConfig

// --- Component 1: Custom Header ---
const AppHeader = () => {
  const router = useRouter();
  return (
    <View style={headerStyles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={headerStyles.backButton}>
        <Text style={headerStyles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={headerStyles.headerTitle}>Edit Profile</Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

/**
 * Uploads an image to Cloudinary.
 * You need to configure your cloud_name and upload_preset.
 * @param uri The local URI of the image file.
 * @returns The secure URL of the uploaded image from Cloudinary.
 */
const uploadImageToCloudinary = async (uri: string) => {
  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg', // Adjust the type if you allow other image formats
    name: 'profile.jpg',
  } as any);

  // =================================================================================
  // TODO: REPLACE THESE PLACEHOLDER VALUES with your Cloudinary credentials
  const cloudName = 'dubuem6e9'; // <-- REPLACE
  const uploadPreset = 'InsightifyProfile'; // <-- REPLACE (must be an "unsigned" preset)
  // =================================================================================

  data.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const json = await response.json();
    return json.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return null;
  }
};

// --- Main Screen Component ---
const EditProfileScreen = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(user?.photoURL || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile from Firestore on component mount
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || user.displayName || '');
          setBio(data.bio || '');
          setImageUri(data.photoURL || user.photoURL || null);
        } else {
          // If no doc, use auth data as a fallback
          setDisplayName(user.displayName || '');
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        Alert.alert("Error", "Could not load your profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Crop to a square
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!displayName.trim()) {
        Alert.alert("Validation Error", "Display name cannot be empty.");
        return;
    }

    setSaving(true);
    try {
      let newPhotoURL = imageUri;

      // Check if the imageUri is a local file (meaning a new image was picked)
      if (imageUri && imageUri.startsWith('file://')) {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUri);
        if (cloudinaryUrl) {
          newPhotoURL = cloudinaryUrl;
        } else {
          Alert.alert("Upload Failed", "Could not upload the new profile picture. Please try again.");
          setSaving(false);
          return;
        }
      }
      
      // 1. Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: displayName.trim(),
        bio: bio.trim(),
        photoURL: newPhotoURL,
      }, { merge: true }); // merge:true prevents overwriting other fields

      // 2. Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: newPhotoURL,
      });

      Alert.alert("Success", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() }
      ]);

    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Error", "An unexpected error occurred while saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* --- Profile Picture Section --- */}
        <View style={styles.imageSection}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../assets/images/avatar-placeholder.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            <Text style={styles.imageButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* --- Form Section --- */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your public name"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us a little about yourself"
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {/* --- Action Buttons --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()} disabled={saving}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheets ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Image Section
  imageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4F46E5',
    backgroundColor: '#E5E7EB',
  },
  imageButton: {
    marginTop: 10,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },

  // Form Section
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Footer Buttons
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButtonText: {
    color: '#FFFFFF',
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

export default EditProfileScreen;