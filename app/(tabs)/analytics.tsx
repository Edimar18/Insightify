import { Asset } from 'expo-asset';
import { copyAsync, documentDirectory, getInfoAsync, readAsStringAsync } from 'expo-file-system/legacy';
import Papa, { ParseResult } from 'papaparse';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
// Calculate card width for two items per row with padding
const CARD_WIDTH = (width / 2) - 24; 
const CHART_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

// --- Component 1: Custom Header (Reused from Dashboard) ---
const AppHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoGroup}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logoIcon} 
      />
        <Text style={styles.logoText}>Insightify</Text>
      </View>
      <Image
        source={{ uri: 'https://avatars.githubusercontent.com/u/148160741?v=4' }}
        style={styles.profileImage}
      />
    </View>
  );
};

// --- Component Time Filter Card ---
type TimeFilterProps = {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
};

// --- Component 2: Time Filter (Day/Week/Month) ---
const TimeFilter = ({ selected, onSelect }: TimeFilterProps) => {
    const filters: FilterType[] = ['Day', 'Week', 'Month'];
    return (
        <View style={filterStyles.container}>
            <Text style={filterStyles.dateText}>Filter by:</Text>
            <View style={filterStyles.buttonGroup}>
                {filters.map((filter) => (
                    <TouchableOpacity 
                        key={filter} 
                        style={[
                            filterStyles.button, 
                            selected === filter && filterStyles.buttonSelected
                        ]} 
                        onPress={() => onSelect(filter)}
                    >
                        <Text style={[
                            filterStyles.buttonText,
                            selected === filter && filterStyles.buttonTextSelected
                        ]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

type PieChartData = {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

// --- Component 3: Expense Category Donut Chart ---
const ExpenseDonutChart = ({ data }: { data: PieChartData[] }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Expenses by Category</Text>
            {data.length > 0 ? (
                <PieChart
                    data={data}
                    width={CARD_WIDTH - 30} // card width - padding
                    height={120}
                    chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
                    accessor={"amount"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 0]}
                    hasLegend={false} // We'll render a custom legend
                    absolute
                />
            ) : (
                <View style={chartStyles.placeholder}><Text style={chartStyles.placeholderText}>No expense data</Text></View>
            )}
            <View style={chartStyles.legendContainer}>
                {data.map(item => (
                    <View key={item.name} style={chartStyles.legendItem}>
                        <View style={[chartStyles.dot, { backgroundColor: item.color }]} />
                        <Text style={chartStyles.legendText}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

type LineChartCardProps = {
    data: {
        labels: string[];
        datasets: { data: number[] }[];
    };
    totalRevenue: number;
    totalExpenses: number;
};

// --- Component 4: Profit / Loss Line Chart ---
const ProfitLossLineChart = ({ data, totalRevenue, totalExpenses }: LineChartCardProps) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Profit / Loss</Text>
            {data.labels.length > 0 ? (
                <LineChart
                    data={data}
                    width={CARD_WIDTH - 10} // Adjust for padding
                    height={120}
                    withHorizontalLabels={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    withShadow={false}
                    chartConfig={{
                        backgroundColor: '#FFFFFF',
                        backgroundGradientFrom: '#FFFFFF',
                        backgroundGradientTo: '#FFFFFF',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(67, 56, 202, ${opacity})`,
                        propsForDots: { r: '3', strokeWidth: '1', stroke: '#4338CA' },
                    }}
                    bezier
                    style={{ marginLeft: -15, marginBottom: -10 }}
                />
            ) : (
                <View style={chartStyles.placeholder}><Text style={chartStyles.placeholderText}>No profit data</Text></View>
            )}
            <View style={chartStyles.summary}>
                <Text style={chartStyles.summaryText}>Revenue: <Text style={chartStyles.revenueText}>+₱{totalRevenue.toFixed(2)}</Text></Text>
                <Text style={chartStyles.summaryText}>Expenses: <Text style={chartStyles.expensesText}>-₱{totalExpenses.toFixed(2)}</Text></Text>
            </View>
        </View>
    );
};

// --- Component Card PROPS---
type TransactionRowProps = {
  transaction: Transaction;
};

// --- Component 5: Recent Transactions Table Row ---
const TransactionRow = ({ transaction }: TransactionRowProps) => {
    const isRevenue = transaction.Type === 'Revenue';
    return (
        <View style={logStyles.row}>
            <Text style={[logStyles.cell, logStyles.cellDate]}>{transaction.Date}</Text>
            <Text style={[logStyles.cell, logStyles.cellDesc]} numberOfLines={1}>{transaction.Description}</Text>
            <Text style={[logStyles.cell, logStyles.cellAmount, isRevenue ? logStyles.amountRevenue : logStyles.amountExpense]}>
                {isRevenue ? '+' : '-'}₱{transaction.Amount.toFixed(2)}
            </Text>
        </View>
    );
};

// --- Component 6: Recent Transactions List ---
const RecentTransactions = ({ transactions }: { transactions: Transaction[] }) => {
    return (
        <View style={logStyles.container}>
            <Text style={logStyles.title}>Recent Transactions</Text>
            <View style={logStyles.headerRow}>
                <Text style={[logStyles.headerCell, logStyles.cellDate]}>Date</Text>
                <Text style={[logStyles.headerCell, logStyles.cellDesc]}>Description</Text>
                <Text style={[logStyles.headerCell, logStyles.cellAmount]}>Amount</Text>
            </View>
            {transactions.slice(0, 5).map((item, index) => (
                <TransactionRow key={index} transaction={item} />
            ))}
        </View>
    );
};

// --- Type Definitions ---
type FilterType = 'Day' | 'Week' | 'Month';
interface Transaction {
  Date: string;
  Type: 'Revenue' | 'Expense';
  Description: string;
  Category: string;
  Amount: number;
}

// --- Main Screen Component ---
const AnalyticsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Month');
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async () => {
    setLoading(true);
    const fileUri = documentDirectory + 'transactions.csv';
    try {
      const fileInfo = await getInfoAsync(fileUri);
      let csvString;

      if (!fileInfo.exists) {
        // If file doesn't exist, copy it from assets
        const asset = Asset.fromModule(require('../../assets/data/transactions.csv'));
        await asset.downloadAsync();
        if (!asset.localUri) return;
        await copyAsync({ from: asset.localUri, to: fileUri });
        csvString = await readAsStringAsync(fileUri);
      } else {
        // If file exists, read it
        csvString = await readAsStringAsync(fileUri);
      }
      Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        complete: (results: ParseResult<Transaction>) => {
          // Filter out any empty rows from CSV parsing
          const validData = results.data.filter(row => row.Date && row.Amount);
          setTransactions(validData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())); // Sort newest first
        },
      });
    } catch (error) {
      console.error("Failed to load or parse transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Data Loading ---
  useEffect(() => {
    loadTransactions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions().finally(() => setRefreshing(false));
  }, []);

  // --- Data Processing ---
  const { pieChartData, lineChartData, lineChartTotals, filteredTransactions } = useMemo(() => {
    // Helper to reliably parse MM/DD/YYYY dates
    const parseDate = (dateString: string) => {
        const parts = dateString.split('/');
        // new Date(year, monthIndex, day)
        return new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    };

    const now = new Date('2025-10-17T12:00:00Z'); // Use a fixed date for consistent filtering with dummy data
    let filtered = transactions.filter(t => {
        const tDate = parseDate(t.Date);
        if (activeFilter === 'Day') return tDate.toDateString() === now.toDateString();
        if (activeFilter === 'Week') return (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24) <= 7;
        return true; // 'Month' shows all data for this example
    });

    // Ensure transactions are sorted with the newest first
    filtered.sort((a, b) => parseDate(b.Date).getTime() - parseDate(a.Date).getTime());

    // Pie Chart (Expenses by Category)
    const expenseGroups = filtered.filter(t => t.Type === 'Expense').reduce((acc, t) => {
        acc[t.Category] = (acc[t.Category] || 0) + t.Amount;
        return acc;
    }, {} as Record<string, number>);

    const pieData: PieChartData[] = Object.entries(expenseGroups).map(([name, amount], index) => ({
        name,
        amount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        legendFontColor: '#4B5563',
        legendFontSize: 12,
    }));

    // Line Chart (Profit over time)
    const profitByDay = filtered.reduce((acc, t) => {
        const day = t.Date;
        if (!acc[day]) acc[day] = { revenue: 0, expense: 0 };
        if (t.Type === 'Revenue') acc[day].revenue += t.Amount;
        else acc[day].expense += t.Amount;
        return acc;
    }, {} as Record<string, { revenue: number; expense: number }>);

    const sortedDays = Object.keys(profitByDay).sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime());
    const lineData = {
        labels: sortedDays.map(day => new Date(day).toLocaleDateString('en-US', { day: 'numeric' })),
        datasets: [{ data: sortedDays.map(day => profitByDay[day].revenue - profitByDay[day].expense) }]
    };

    const totals = filtered.reduce((acc, t) => {
        if (t.Type === 'Revenue') acc.revenue += t.Amount;
        else acc.expense += t.Amount;
        return acc;
    }, { revenue: 0, expense: 0 });

    return { pieChartData: pieData, lineChartData: lineData, lineChartTotals: totals, filteredTransactions: filtered };
  }, [transactions, activeFilter]);

  if (loading) {
    return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" style={{ flex: 1 }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.screenContainer} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        <AppHeader />
        <TimeFilter selected={activeFilter} onSelect={setActiveFilter} />

        {/* Top Analytics Cards */}
        <View style={styles.topCardsContainer}>
            <ExpenseDonutChart data={pieChartData} />
            <ProfitLossLineChart data={lineChartData} totalRevenue={lineChartTotals.revenue} totalExpenses={lineChartTotals.expense} />
        </View>

        {/* Recent Transactions Table */}
        <RecentTransactions transactions={filteredTransactions} />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheets ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray background
    },
    screenContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    contentContainer: {
        paddingBottom: 20, 
    },
    
    // Header Styles (Copied for local definition, should be imported in a real app)
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10, // Reduced margin since filter is next
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

    // Card Common Styles
    topCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 10,
    },
});

const filterStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 0, 
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    buttonGroup: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB', // Light background for the toggle group
        borderRadius: 8,
        padding: 2,
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        minWidth: 50,
        alignItems: 'center',
    },
    buttonSelected: {
        backgroundColor: '#FFFFFF', // Selected button is white
        // Add a subtle shadow for the selected button to lift it
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280', // Default text color
    },
    buttonTextSelected: {
        color: '#1F2937', // Darker text for selected state
        fontWeight: '600',
    },
});

const chartStyles = StyleSheet.create({
    placeholder: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
    },
    placeholderText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    legendContainer: {
        marginTop: 15,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: '#4B5563',
    },

    summary: {
        marginTop: 15,
    },
    summaryText: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 2,
    },
    revenueText: {
        color: '#10B981', // Green for revenue
        fontWeight: '700',
    },
    expensesText: {
        color: '#EF4444', // Red for expenses
        fontWeight: '700',
    },
});

const logStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 20,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 15,
    },
    headerRow: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // Lighter separator for rows
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'left',
    },
    cell: {
        fontSize: 14,
        color: '#1F2937',
        alignSelf: 'center',
    },
    // Column Width Distribution (approximate)
    cellDate: {
        width: '35%',
        color: '#6B7280',
    },
    cellDesc: {
        width: '40%',
        fontWeight: '500',
    },
    cellAmount: {
        width: '25%',
        fontWeight: '600',
        textAlign: 'right',
    },
    amountRevenue: {
        color: '#10B981',
    },
    amountExpense: {
        color: '#EF4444',
    },
});

export default AnalyticsScreen;

