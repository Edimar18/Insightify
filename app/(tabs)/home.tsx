import { Asset } from 'expo-asset';
import { copyAsync, documentDirectory, getInfoAsync, readAsStringAsync } from 'expo-file-system/legacy';
import Papa, { ParseResult } from 'papaparse';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// --- Component 1: Custom Header ---
// This component houses the logo/title and the profile picture.
const AppHeader = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Logo and Title */}
      <View style={styles.logoGroup}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logoIcon}/>
        <Text style={styles.logoText}>Insightify</Text>
      </View>

      {/* Profile Picture */}
      <Image
        source={{ uri: 'https://avatars.githubusercontent.com/u/148160741?v=4' }}
        style={styles.profileImage}
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
      <Text style={styles.metricValue}>₱{value}</Text>
    </View>
  );
};

// --- Type Definition for our Data ---
interface Transaction {
  Date: string;
  Type: 'Revenue' | 'Expense';
  Description: string;
  Category: string;
  Amount: number;
}
// --- Component 3: The Dashboard Screen ---
const DashboardScreen = () => {
  // State to hold transaction data loaded from CSV
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    const fileUri = documentDirectory + 'transactions.csv';
    try {
      const fileInfo = await getInfoAsync(fileUri);
      let csvString;

      if (!fileInfo.exists) {
        const asset = Asset.fromModule(require('../../assets/data/transactions.csv'));
        await asset.downloadAsync();
        if (!asset.localUri) return;
        await copyAsync({ from: asset.localUri, to: fileUri });
        csvString = await readAsStringAsync(fileUri);
      } else {
        csvString = await readAsStringAsync(fileUri);
      }

      Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        complete: (results: ParseResult<Transaction>) => {
          setTransactions(results.data.filter(row => row.Date && row.Amount));
        },
      });
    } catch (error) {
      console.error("Failed to load or parse transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA LOADING LOGIC ---
  useEffect(() => {
    loadTransactions();
  }, []); // The empty dependency array ensures this runs only once on mount

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTransactions().finally(() => setRefreshing(false));
  }, []);

  // --- DATA PROCESSING LOGIC ---
  // useMemo prevents recalculating on every render unless transactions change
  const { metrics, chartData } = useMemo(() => {
    const totalRevenue = transactions.filter(t => t.Type === 'Revenue').reduce((sum, t) => sum + t.Amount, 0);
    const totalExpenses = transactions.filter(t => t.Type === 'Expense').reduce((sum, t) => sum + t.Amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const revenueTransactions = transactions.filter(t => t.Type === 'Revenue');
    const avgOrderValue = revenueTransactions.length > 0 ? totalRevenue / revenueTransactions.length : 0;

    // For the chart, we'll show weekly totals for October
    const weeklyData = { 'W1': { revenue: 0, expenses: 0 }, 'W2': { revenue: 0, expenses: 0 }, 'W3': { revenue: 0, expenses: 0 } };
    transactions.forEach(t => {
      const day = new Date(t.Date).getDate();
      const week = day <= 7 ? 'W1' : day <= 14 ? 'W2' : 'W3';
      if (t.Type === 'Revenue') weeklyData[week].revenue += t.Amount;
      if (t.Type === 'Expense') weeklyData[week].expenses += t.Amount;
    });

    return {
      metrics: [
        { title: 'Total Revenue', value: totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) },
        { title: 'Net Profit', value: netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 }) },
        { title: 'Expenses', value: totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 }) },
        { title: 'Avg. Order Value', value: avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) },
      ],
      chartData: {
        labels: Object.keys(weeklyData), // ["W1", "W2", "W3"]
        datasets: [
          { data: Object.values(weeklyData).map(d => d.revenue), color: (opacity = 1) => `#4F46E5` }, // Revenue
          { data: Object.values(weeklyData).map(d => d.expenses), color: (opacity = 1) => `#22C55E` }, // Expenses
        ],
        legend: ["Revenue", "Expenses"]
      }
    };
  }, [transactions]);

  if (loading) {
    return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" style={{ flex: 1 }} /></SafeAreaView>;
  }

  return (
    // SafeAreaView is essential for iOS and Android to handle notches and system bars
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false} // Hides the scroll bar for a cleaner look
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
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
          <LineChart
            data={chartData}
            width={width - 72} // Screen width - container padding (16*2) - chart section padding (20*2)
            height={220}
            yAxisLabel="₱"
            yAxisSuffix="k"
            yAxisInterval={1}
            withShadow={false}
            withInnerLines={false}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`, // Text color
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // Axis label color
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2' }
            }}
            bezier
            style={styles.chartStyle}
          />
          
          {/* Legend */}
          {/* The legend is now part of the chart data, but you can keep a custom one if you prefer */}
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
    width: 42, 
    height: 42,
    marginRight: 1, 
    marginTop: 3, 
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937', 
  },
  refreshIcon: {
    width: 24,
    height: 24,
  },
  profileImage: {
    width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#4F46E5',
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
  chartStyle: {
    marginBottom: 15,
    borderRadius: 16,
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

