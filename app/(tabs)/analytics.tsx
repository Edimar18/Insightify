import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
// Calculate card width for two items per row with padding
const CARD_WIDTH = (width / 2) - 24; 

// --- Component 1: Custom Header (Reused from Dashboard) ---
const AppHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoGroup}>
        <Text style={styles.logoIcon}>📊</Text>
        <Text style={styles.logoText}>Insightify</Text>
      </View>
      <Image
        source={{ uri: 'https://avatars.githubusercontent.com/u/148160741?v=4' }} 
        style={styles.profileImage}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    </View>
  );
};

// --- Component Time Filter Card ---
type TimeFilterProps = {
  selected: string;
};

// --- Component 2: Time Filter (Day/Week/Month) ---
const TimeFilter = ({ selected }: TimeFilterProps) => {
    // This is purely for UI display, no functionality added yet
    const filters = ['Day', 'Week', 'Month'];
    return (
        <View style={filterStyles.container}>
            <Text style={filterStyles.dateText}>JAN 1, 2025 - Dec 31 2025</Text>
            <View style={filterStyles.buttonGroup}>
                {filters.map((filter) => (
                    <TouchableOpacity 
                        key={filter} 
                        style={[
                            filterStyles.button, 
                            selected === filter && filterStyles.buttonSelected
                        ]}
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

// --- Component 3: Donut Chart Placeholder ---
const DonutChartCard = () => {
    // Placeholders for chart and legends
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Category</Text>
            <View style={chartStyles.donutPlaceholder}>
                <Text style={chartStyles.percentageText}>68%</Text>
                <Text style={chartStyles.percentageTextRight}>10%</Text>
                <Text style={chartStyles.percentageTextBottom}>22%</Text>
            </View>
            <View style={chartStyles.legendContainer}>
                <View style={chartStyles.legendItem}>
                    <View style={[chartStyles.dot, { backgroundColor: '#3B82F6' }]} />
                    <Text style={chartStyles.legendText}>Sales</Text>
                </View>
                <View style={chartStyles.legendItem}>
                    <View style={[chartStyles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={chartStyles.legendText}>Marketing</Text>
                </View>
                <View style={chartStyles.legendItem}>
                    <View style={[chartStyles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={chartStyles.legendText}>Expenses</Text>
                </View>
            </View>
        </View>
    );
};

// --- Component 4: Line Chart Placeholder ---
const LineChartCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Profit / Loss</Text>
            <View style={chartStyles.linePlaceholder} />
            <View style={chartStyles.summary}>
                <Text style={chartStyles.summaryText}>Total Revenue: <Text style={chartStyles.revenueText}>+$15,000.00</Text></Text>
                <Text style={chartStyles.summaryText}>Total Expenses: <Text style={chartStyles.expensesText}>+$7,000.00</Text></Text>
            </View>
        </View>
    );
};

// --- Component Card PROPS---
type ComponentCardProps = {
  index: number;
  id: string;
  date: string;
  status: string;
  color: string;
};

// --- Component 5: Stock Log Table Row ---
const LogRow = ({ index, id, date, status, color }: ComponentCardProps) => {
    return (
        <View style={logStyles.row}>
            <Text style={[logStyles.cell, logStyles.cellNo]}>{index}</Text>
            <Text style={[logStyles.cell, logStyles.cellID]}>{id}</Text>
            <Text style={[logStyles.cell, logStyles.cellDate]}>{date}</Text>
            <View style={[logStyles.cell, logStyles.cellStatus]}>
                <Text style={logStyles.statusText}>{status}</Text>
                <View style={[logStyles.statusDot, { backgroundColor: color }]} />
            </View>
        </View>
    );
};

// --- Component 6: Stock Log Details ---
const StockLogDetails = () => {
    const data = [
        { index: 1, id: '#12594', date: 'Sept 30, 2025', status: 'Delivered', color: '#10B981' }, // Green
        { index: 2, id: '#12490', date: 'Oct 01, 2025', status: 'Pending', color: '#3B82F6' }, // Blue
        { index: 3, id: '#12306', date: 'Oct 10, 2025', status: 'Pending', color: '#F59E0B' }, // Orange
    ];
    return (
        <View style={logStyles.container}>
            <Text style={logStyles.title}>Stocks Log Details</Text>
            <View style={logStyles.headerRow}>
                <Text style={[logStyles.headerCell, logStyles.cellNo]}>No</Text>
                <Text style={[logStyles.headerCell, logStyles.cellID]}>ID</Text>
                <Text style={[logStyles.headerCell, logStyles.cellDate]}>Date</Text>
                <Text style={[logStyles.headerCell, logStyles.cellStatus]}>Status</Text>
            </View>
            {data.map((item) => (
                <LogRow key={item.index} {...item} />
            ))}
        </View>
    );
};


// --- Main Screen Component ---
const AnalyticsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.screenContainer} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader />
        <TimeFilter selected="Day" />

        {/* Top Analytics Cards */}
        <View style={styles.topCardsContainer}>
            <DonutChartCard />
            <LineChartCard />
        </View>

        {/* Stock Log Details Table */}
        <StockLogDetails />

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
        fontSize: 24,
        marginRight: 8,
        color: '#4F46E5', 
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
        color: '#4B5563',
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
    // Donut Chart Placeholder
    donutPlaceholder: {
        // Removed the conflicting 'width: 100%' here
        aspectRatio: 1, // Keep it square
        backgroundColor: '#E5E7EB', // Placeholder color
        borderRadius: CARD_WIDTH / 2, // Circular shape
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 120, // fixed height for visual size
        width: 120, // Kept the specific pixel width
        alignSelf: 'center',
        
    },
    percentageText: {
        position: 'absolute',
        top: 20,
        left: 0,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    percentageTextRight: {
        position: 'absolute',
        top: 20,
        right: 0,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    percentageTextBottom: {
        position: 'absolute',
        bottom: 0,
        right: 25,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
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

    // Line Chart Placeholder
    linePlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 10,
        // Adding a simple visual line approximation (purely visual)
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#9CA3AF',
    },
    summary: {
        marginTop: 10,
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
        color: '#EF4444', // Red for expenses (or maybe a positive green if treated as a metric goal)
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
        paddingVertical: 10,
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
    },
    cell: {
        fontSize: 14,
        color: '#1F2937',
        alignSelf: 'center',
    },
    // Column Width Distribution (approximate)
    cellNo: {
        width: '10%', 
    },
    cellID: {
        width: '25%',
        fontWeight: '500',
    },
    cellDate: {
        width: '35%',
        color: '#6B7280',
    },
    cellStatus: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    statusText: {
        fontSize: 14,
        color: '#1F2937',
        marginRight: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});

export default AnalyticsScreen;
