import { useNetInfo } from '@react-native-community/netinfo';
import { Stack } from 'expo-router';
import { documentDirectory, getInfoAsync, readAsStringAsync } from 'expo-file-system/legacy';
import { collection, doc, writeBatch } from 'firebase/firestore';
import Papa from 'papaparse';
import React from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

const DataSyncScreen = () => {
  // Use the netinfo hook to get the real network status
  const netInfo = useNetInfo();
  const isOnline = netInfo.isConnected;
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!isOnline || !user) {
      Alert.alert("Upload Failed", "You must be online and logged in to upload your data.");
      return;
    }

    setIsUploading(true);
    try {
      const fileUri = documentDirectory + 'transactions.csv';
      const fileInfo = await getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        Alert.alert("No Data Found", "Could not find the local transactions.csv file to upload.");
        return;
      }

      const csvString = await readAsStringAsync(fileUri);

      Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: async (results: any) => {
          const transactions = results.data.filter((row: any) => row.Date && row.Amount);
          if (transactions.length === 0) {
            Alert.alert("No Data", "The CSV file is empty. Nothing to upload.");
            setIsUploading(false);
            return;
          }

          // Create a batch write operation
          const batch = writeBatch(db);
          const userTransactionsRef = collection(db, 'users', user.uid, 'transactions');

          transactions.forEach((transaction: any) => {
            const newTransactionRef = doc(userTransactionsRef); // Create a new doc with a unique ID
            batch.set(newTransactionRef, transaction);
          });

          await batch.commit();
          Alert.alert("Upload Complete", `${transactions.length} transactions have been successfully saved to the cloud.`);
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "An unexpected error occurred during the upload process.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Stack Header Configuration --- */}
      <Stack.Screen options={{ 
        title: 'Data Synchronization',
        headerStyle: { backgroundColor: '#F3F4F6' },
        headerTintColor: '#1F2937',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }} />

      <View style={styles.container}>
        {/* --- Status Card --- */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, isOnline ? styles.online : styles.offline]} />
            <Text style={styles.statusTitle}>
              {isOnline ? 'Connected & In Sync' : 'Offline Mode'}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            Your data is automatically saved and synchronized across your devices whenever you are connected to the internet.
          </Text>
        </View>

        {/* --- Upload Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Initial Cloud Upload</Text>
          <Text style={styles.cardDescription}>
            Press the button below to perform a one-time upload of your locally stored data to your secure cloud account.
          </Text>
          <TouchableOpacity 
            style={[styles.button, (!isOnline || isUploading) && styles.buttonDisabled]} 
            onPress={handleUpload}
            disabled={!isOnline || isUploading}
          >
            {isUploading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Upload Local Data to Cloud</Text>}
          </TouchableOpacity>
        </View>


        {/* --- Informational Card --- */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>How It Works</Text>
            <Text style={styles.infoText}>
              When you're offline, your changes are saved securely on this device. Once you reconnect, they will be uploaded automatically. No manual action is needed!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  online: { backgroundColor: '#22C55E' /* green-500 */ },
  offline: { backgroundColor: '#FBBF24' /* amber-400 */ },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#E0E7FF', // A light indigo color
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: { fontSize: 24, marginRight: 15, marginTop: -2 },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '600', color: '#3730A3', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#4338CA', lineHeight: 20 },
  button: {
    marginTop: 15,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default DataSyncScreen;
