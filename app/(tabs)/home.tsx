import React from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

// --- Component 1: Custom Header ---
// This component houses the logo/title and the profile picture.
const AppHeader = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Logo and Title */}
      <View style={styles.logoGroup}>
        {/* Placeholder for Logo Icon - using an emoji for simplicity */}
        <Text style={styles.logoIcon}>📊</Text>
        <Text style={styles.logoText}>Insightify</Text>
      </View>
      
      {/* Profile Picture */}
      <Image
        // Using a placeholder image for the profile picture
        source={{ uri: 'https://avatars.githubusercontent.com/u/148160741?v=4' }} 
        style={styles.profileImage}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    </View>
  );
};

// --- Component 2: Key Metric Card ---
type MetricCardProps = {
  title: string;
  value: string;
};

const MetricCard = ({ title, value }: MetricCardProps) => {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>${value}</Text>
    </View>
  );
};

// --- Component 3: The Dashboard Screen ---
const DashboardScreen = () => {
  const metrics = [
    { title: 'Total Revenue', value: '15,000' },
    { title: 'Net Profit', value: '10,000' },
    { title: 'Expenses', value: '5,000' },
    { title: 'Avg. Order Value', value: '1,000' },
  ];

  return (
    // SafeAreaView is essential for iOS and Android to handle notches and system bars
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false} // Hides the scroll bar for a cleaner look
      >
        
        {/* The AppHeader is included here so it scrolls with the rest of the content */}
        <AppHeader />
        
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} title={metric.title} value={metric.value} />
          ))}
        </View>

        {/* Revenue vs Expenses Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Revenue vs Expenses</Text>
          
          {/* Chart Placeholder Area */}
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>CHART PLACEHOLDER</Text>
          </View>
          
          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4F46E5' }]} />
              <Text style={styles.legendText}>Revenue</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  contentContainer: {
    paddingBottom: 20, 
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    // Add horizontal padding here if you want it tighter, but typically padding is on the screen container
    // paddingHorizontal: 0, 
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
    color: '#4F46E5', // Accent color for the icon
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937', 
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#4F46E5', 
  },

  // Metrics Grid Styles
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: (width / 2) - 24, // Two cards per row, accounting for screen padding (16*2) and half-spacing between cards (8)
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    // Standard iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    // Android Shadow
    elevation: 3,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280', 
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Chart Section Styles
  chartSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    // Shadow matching metric cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  chartPlaceholder: {
    height: 200,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  
  // Legend Styles
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default DashboardScreen;
