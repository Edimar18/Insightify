import { Stack } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ExportBackupScreen = () => {

  // --- Mock Handlers ---
  const handleExport = (format: 'JSON' | 'CSV') => {
    // TODO: Implement actual data fetching from Firestore and file generation.
    Alert.alert(
      `Exporting as ${format}`,
      `This will export your analytics data as a ${format} file. This feature is coming soon!`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Stack Header Configuration --- */}
      <Stack.Screen options={{ 
        title: 'Export & Backup',
        headerStyle: { backgroundColor: '#F3F4F6' },
        headerTintColor: '#1F2937',
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }} />

      <View style={styles.container}>
        {/* --- Info Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Data File</Text>
          <Text style={styles.cardSubtitle}>
            Download a copy of your analytics data. You can use this file as a personal backup or to import it into other services.
          </Text>

          <View style={styles.separator} />

          {/* --- File Details --- */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated</Text>
            <Text style={styles.detailValue}>Dec 8, 2025, 10:30 AM</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Size</Text>
            <Text style={styles.detailValue}>~ 2.5 MB</Text>
          </View>
        </View>

        {/* --- Export Actions --- */}
        <Text style={styles.sectionTitle}>Export Options</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.button} onPress={() => handleExport('JSON')}>
            <Text style={styles.buttonText}>Download as JSON</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.button} onPress={() => handleExport('CSV')}>
            <Text style={styles.buttonText}>Download as CSV</Text>
          </TouchableOpacity>
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
    padding: 20,
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
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#374151',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  button: {
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4F46E5',
    textAlign: 'center',
  },
});

export default ExportBackupScreen;