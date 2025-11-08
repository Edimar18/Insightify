import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { copyAsync, documentDirectory, getInfoAsync, readAsStringAsync, writeAsStringAsync } from 'expo-file-system/legacy';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Type Definitions ---
interface Transaction {
  id: string; // Unique identifier
  Date: string;
  Type: 'Revenue' | 'Expense' | 'Product';
  Description: string;
  Category: string;
  Amount: number;
  Quantity?: number; // For products
  UnitPrice?: number; // For products
}

type TabType = 'Product' | 'Revenue' | 'Expense' | 'Import';

// --- Component 1: Custom Header ---
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

// --- Component 2: Tab Navigation ---
const EntryTabs = ({ activeTab, setActiveTab }: { activeTab: TabType; setActiveTab: (tab: TabType) => void }) => {
    const tabs: TabType[] = ['Product', 'Revenue', 'Expense', 'Import'];

    return (
        <View style={tabStyles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[tabStyles.tab, activeTab === tab && tabStyles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={[
                        tabStyles.tabText,
                        activeTab === tab && tabStyles.activeTabText
                    ]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// --- Component 3: Table View ---
const TableView = ({
    data,
    type,
    selectedId,
    onSelectRow,
    onEdit,
    onDelete
}: {
    data: Transaction[];
    type: TabType;
    selectedId: string | null;
    onSelectRow: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    if (type === 'Import') return null;

    const renderHeader = () => {
        if (type === 'Product') {
            return (
                <View style={tableStyles.headerRow}>
                    <Text style={[tableStyles.headerCell, { width: '25%' }]}>Date</Text>
                    <Text style={[tableStyles.headerCell, { width: '30%' }]}>Name</Text>
                    <Text style={[tableStyles.headerCell, { width: '20%' }]}>Category</Text>
                    <Text style={[tableStyles.headerCell, { width: '25%' }]}>Price</Text>
                </View>
            );
        } else {
            return (
                <View style={tableStyles.headerRow}>
                    <Text style={[tableStyles.headerCell, { width: '25%' }]}>Date</Text>
                    <Text style={[tableStyles.headerCell, { width: '35%' }]}>Description</Text>
                    <Text style={[tableStyles.headerCell, { width: '20%' }]}>Category</Text>
                    <Text style={[tableStyles.headerCell, { width: '20%' }]}>Amount</Text>
                </View>
            );
        }
    };

    const renderRow = (item: Transaction, index: number) => {
        const isSelected = item.id === selectedId;
        if (type === 'Product') {
            return (
                <Pressable key={item.id} onPress={() => onSelectRow(item.id)}>
                    <View style={[tableStyles.row, isSelected && tableStyles.selectedRow]}>
                        <Text style={[tableStyles.cell, { width: '25%' }]}>{item.Date}</Text>
                        <Text style={[tableStyles.cell, { width: '30%' }]} numberOfLines={1}>{item.Description}</Text>
                        <Text style={[tableStyles.cell, { width: '20%' }]} numberOfLines={1}>{item.Category}</Text>
                        <Text style={[tableStyles.cell, { width: '25%' }]}>₱{item.Amount.toFixed(2)}</Text>
                        {isSelected && (
                            <View style={tableStyles.actionIcons}>
                                <TouchableOpacity onPress={() => onEdit(item.id)} style={tableStyles.iconButton}>
                                    <MaterialCommunityIcons name="pencil" size={20} color="#4F46E5" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(item.id)} style={tableStyles.iconButton}>
                                    <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Pressable>
            );
        } else {
            return (
                <Pressable key={item.id} onPress={() => onSelectRow(item.id)}>
                    <View style={[tableStyles.row, isSelected && tableStyles.selectedRow]}>
                    <Text style={[tableStyles.cell, { width: '25%' }]}>{item.Date}</Text>
                    <Text style={[tableStyles.cell, { width: '35%' }]} numberOfLines={1}>{item.Description}</Text>
                    <Text style={[tableStyles.cell, { width: '20%' }]} numberOfLines={1}>{item.Category}</Text>
                    <Text style={[tableStyles.cell, { width: '20%', color: item.Type === 'Revenue' ? '#10B981' : '#EF4444' }]}>
                        {item.Type === 'Revenue' ? '+' : '-'}₱{item.Amount.toFixed(2)}
                    </Text>
                </View>
                {isSelected && (
                    <View style={tableStyles.actionIconsOnSelected}>
                        <TouchableOpacity onPress={() => onEdit(item.id)} style={tableStyles.iconButton}>
                            <MaterialCommunityIcons name="pencil" size={20} color="#4F46E5" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(item.id)} style={tableStyles.iconButton}>
                            <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
                </Pressable>
            );
        }
    };

    return (
        <View style={tableStyles.container}>
            {renderHeader()}
            <ScrollView style={tableStyles.scrollView}>
                {data.length > 0 ? (
                    data.map((item, index) => renderRow(item, index))
                ) : (
                    <View style={tableStyles.emptyState}>
                        <Text style={tableStyles.emptyText}>No data available</Text>
                        <Text style={tableStyles.emptySubtext}>Tap the + button to add {type.toLowerCase()} data</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

// --- Component 4: Add Entry Form ---
const AddEntryForm = ({ type, onSave, onCancel, initialData }: { type: TabType; onSave: (data: Partial<Transaction>) => void; onCancel: () => void; initialData?: Partial<Transaction> | null }) => {
    const [formData, setFormData] = useState<any>(() => {
        const defaultState = {
            date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            description: '',
            category: '',
            amount: '',
            quantity: '',
            unitPrice: '',
            paymentMethod: '',
            notes: ''
        };
        if (initialData) {
            return { ...defaultState, ...initialData, amount: initialData.Amount?.toString() ?? '' };
        }
        return defaultState;
    });

    const handleSubmit = () => {
        if (type === 'Product') {
            if (!formData.description || !formData.category || !formData.amount) {
                alert('Please fill in all required fields');
                return;
            }
            onSave({
                Date: formData.date,
                Type: 'Product',
                Description: formData.description,
                Category: formData.category,
                Amount: parseFloat(formData.amount),
                id: initialData?.id // Pass id if editing
            });
        } else if (type === 'Revenue') {
            if (!formData.description || !formData.quantity || !formData.unitPrice) {
                alert('Please fill in all required fields');
                return;
            }
            const total = parseFloat(formData.quantity) * parseFloat(formData.unitPrice);
            onSave({
                Date: formData.date,
                Type: 'Revenue',
                Description: formData.description,
                Category: formData.category || 'Sales',
                Amount: total,
                id: initialData?.id // Pass id if editing
            });
        } else if (type === 'Expense') {
            if (!formData.description || !formData.category || !formData.amount) {
                alert('Please fill in all required fields');
                return;
            }
            onSave({
                Date: formData.date,
                Type: 'Expense',
                Description: formData.description,
                Category: formData.category,
                Amount: parseFloat(formData.amount),
                id: initialData?.id // Pass id if editing
            });
        }
    };

    const renderProductForm = () => (
        <>
            <Text style={formStyles.formTitle}>{initialData ? 'Edit' : 'Add'} Product</Text>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Date</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="MM/DD/YYYY"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Product Name *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Enter product name"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Category *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                    placeholder="e.g., Electronics, Food, Clothing"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Price *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.amount}
                    onChangeText={(text) => setFormData({ ...formData, amount: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                />
            </View>
        </>
    );

    const renderRevenueForm = () => (
        <>
            <Text style={formStyles.formTitle}>{initialData ? 'Edit' : 'Add'} Revenue</Text>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Date</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="MM/DD/YYYY"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Product/Service *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Enter product or service name"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Category</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                    placeholder="e.g., Sales, Services"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Quantity Sold *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.quantity}
                    onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                    placeholder="0"
                    keyboardType="numeric"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Unit Price *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.unitPrice}
                    onChangeText={(text) => setFormData({ ...formData, unitPrice: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Payment Method</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.paymentMethod}
                    onChangeText={(text) => setFormData({ ...formData, paymentMethod: text })}
                    placeholder="Cash, Card, etc."
                />
            </View>
        </>
    );

    const renderExpenseForm = () => (
        <>
            <Text style={formStyles.formTitle}>{initialData ? 'Edit' : 'Add'} Expense</Text>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Date</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="MM/DD/YYYY"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Expense Name *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Enter expense name"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Category *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                    placeholder="e.g., Marketing, Overhead, Utilities"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Amount *</Text>
                <TextInput
                    style={formStyles.input}
                    value={formData.amount}
                    onChangeText={(text) => setFormData({ ...formData, amount: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                />
            </View>
            <View style={formStyles.inputGroup}>
                <Text style={formStyles.label}>Notes</Text>
                <TextInput
                    style={[formStyles.input, formStyles.textArea]}
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder="Additional details..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>
        </>
    );

    return (
        <View style={formStyles.formContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={formStyles.mainCard}>
                    {type === 'Product' && renderProductForm()}
                    {type === 'Revenue' && renderRevenueForm()}
                    {type === 'Expense' && renderExpenseForm()}
                </View>

                <View style={formStyles.actionButtons}>
                    <TouchableOpacity style={[formStyles.button, formStyles.cancelButton]} onPress={onCancel}>
                        <Text style={formStyles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[formStyles.button, formStyles.saveButton]} onPress={handleSubmit}>
                        <Text style={[formStyles.buttonText, formStyles.saveButtonText]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

// --- Component 5: Import Tab ---
const ImportTab = () => (
    <View style={formStyles.importContainer}>
        <Text style={formStyles.formTitle}>Import Data</Text>
        <Text style={formStyles.importDescription}>
            Upload your existing transaction data from a CSV file. The file should contain columns for Date, Type (Revenue/Expense/Product), Description, Category, and Amount.
        </Text>
        
        <TouchableOpacity style={formStyles.importButton}>
            <Text style={formStyles.importButtonText}>Select CSV File to Import</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
            <Text style={formStyles.importNoteTitle}>CSV Format Requirements:</Text>
            <Text style={formStyles.importNote}>
                • Date: MM/DD/YYYY format
            </Text>
            <Text style={formStyles.importNote}>
                • Type: Revenue, Expense, or Product
            </Text>
            <Text style={formStyles.importNote}>
                • Description: Product/Service name or expense description
            </Text>
            <Text style={formStyles.importNote}>
                • Category: Classification of the entry
            </Text>
            <Text style={formStyles.importNote}>
                • Amount: Numeric value (no currency symbols)
            </Text>
        </View>
    </View>
);

// --- Component 6: Success Modal ---
const SaveModal = ({ modalVisible, setModalVisible }: { modalVisible: boolean; setModalVisible: (visible: boolean) => void }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
                <Text style={modalStyles.checkMark}>✓</Text>
                <Text style={modalStyles.modalText}>Record saved successfully!</Text>
                <Pressable
                    style={modalStyles.doneButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={modalStyles.doneButtonText}>Done</Text>
                </Pressable>
            </View>
        </View>
    </Modal>
);

// --- Main Screen Component ---
const EntryScreen = () => {
    const [activeTab, setActiveTab] = useState<TabType>('Product');
    const [showForm, setShowForm] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [csvUri, setCsvUri] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Load CSV data
    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        const fileUri = documentDirectory + 'transactions.csv';
        try {
            const fileInfo = await getInfoAsync(fileUri);
            let csvString;

            if (!fileInfo.exists) {
                // If file doesn't exist in document directory, copy it from assets
                const asset = Asset.fromModule(require('../../assets/data/transactions.csv'));
                await asset.downloadAsync();
                if (!asset.localUri) return;
                await copyAsync({ from: asset.localUri, to: fileUri });
                csvString = await readAsStringAsync(fileUri);
            } else {
                // If file exists, read it directly
                csvString = await readAsStringAsync(fileUri);
            }
            
            setCsvUri(fileUri);
            Papa.parse(csvString, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results: any) => {
                    const validData = results.data
                        .filter((row: any) => row.Date && row.Amount)
                        // Add a unique ID to each row for selection handling
                        .map((row: any, index: number) => ({ ...row, id: `${new Date(row.Date).getTime()}-${index}` }));
                    setTransactions(validData.sort((a: Transaction, b: Transaction) => new Date(b.Date).getTime() - new Date(a.Date).getTime()));
                },
            });
        } catch (error) {
            console.error("Failed to load transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (entry: Partial<Transaction>) => {
        setLoading(true);
        let updatedTransactions;

        if (entry.id) { // This is an update
            updatedTransactions = transactions.map(t => t.id === entry.id ? { ...t, ...entry } as Transaction : t);
        } else { // This is a new entry
            const newEntryWithId = { ...entry, id: `${new Date(entry.Date!).getTime()}-${transactions.length}` } as Transaction;
            updatedTransactions = [...transactions, newEntryWithId];
        }

        // Sort and save
        const sortedTransactions = updatedTransactions.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
        await writeToCsv(sortedTransactions);

        setTransactions(sortedTransactions);
        setModalVisible(true);
        setShowForm(false);
        setEditingTransaction(null);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this entry? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const updatedTransactions = transactions.filter(t => t.id !== id);
                        await writeToCsv(updatedTransactions);
                        setTransactions(updatedTransactions);
                        setSelectedId(null);
                        setLoading(false);
                    }
                }
            ]
        );
    };

    const handleEdit = (id: string) => {
        const transactionToEdit = transactions.find(t => t.id === id);
        if (transactionToEdit) {
            setEditingTransaction(transactionToEdit);
            setShowForm(true);
        }
    };

    const writeToCsv = async (data: Transaction[]) => {
        try {
            if (!csvUri) return;
            // Sanitize data for unparsing (remove our internal 'id')
            const dataToSave = data.map(({ id, ...rest }) => rest);
            const csv = Papa.unparse(dataToSave, {
                columns: ['Date', 'Type', 'Description', 'Category', 'Amount', 'Quantity', 'UnitPrice']
            });
            await writeAsStringAsync(csvUri, csv);
        } catch (error) {
            console.error("Failed to save to CSV:", error);
            alert("Failed to save data. Please try again.");
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedId(prevId => (prevId === id ? null : id)); // Toggle selection
    };

    const getFilteredData = () => {
        if (activeTab === 'Product') {
            return transactions.filter(t => t.Type === 'Product');
        } else if (activeTab === 'Revenue') {
            return transactions.filter(t => t.Type === 'Revenue');
        } else if (activeTab === 'Expense') {
            return transactions.filter(t => t.Type === 'Expense');
        }
        return [];
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.loadingText}>Loading data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <AppHeader />
                <EntryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Content Area */}
                {showForm ? (
                    <AddEntryForm 
                        type={editingTransaction?.Type as TabType || activeTab}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingTransaction(null);
                        }}
                        initialData={editingTransaction}
                    />
                ) : activeTab === 'Import' ? (
                    <View style={styles.importWrapper}>
                        <ImportTab />
                    </View>
                ) : (
                    <TableView data={getFilteredData()} type={activeTab} selectedId={selectedId} onSelectRow={handleSelectRow} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                {/* Floating Add Button (not shown on Import tab or when form is visible) */}
                {activeTab !== 'Import' && !showForm && (
                    <TouchableOpacity 
                        style={styles.floatingButton}
                        onPress={() => setShowForm(true)}
                    >
                        <Text style={styles.floatingButtonText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            <SaveModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </SafeAreaView>
    );
};

// --- Stylesheets ---

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280' },
    importWrapper: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginTop: 10 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, marginBottom: 10 },
    logoGroup: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: { fontSize: 24, marginRight: 8, color: '#4F46E5' },
    logoText: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
    profileImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#4F46E5' },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    floatingButtonText: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: '300',
    },
});

const tabStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 3,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        fontWeight: '600',
        color: '#1F2937',
    },
});

const tableStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 10,
    },
    headerCell: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        textTransform: 'uppercase',
    },
    scrollView: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cell: {
        fontSize: 14,
        color: '#1F2937',
    },
    selectedRow: {
        backgroundColor: '#E0E7FF', // A light indigo for highlighting
    },
    actionIcons: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E7FF', // Match selected background
        paddingLeft: 10,
    },
    actionIconsOnSelected: {
        position: 'absolute',
        right: 15,
        top: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        marginLeft: 5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#D1D5DB',
    },
});

const formStyles = StyleSheet.create({
    formContainer: {
        flex: 1,
        marginTop: 10,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 3,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 5,
    },
    input: {
        height: 50,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        minHeight: 100,
        paddingVertical: 10,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#D1D5DB',
    },
    saveButton: {
        backgroundColor: '#4F46E5',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
    importContainer: {
        paddingVertical: 10,
    },
    importDescription: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 20,
        lineHeight: 20,
    },
    importButton: {
        backgroundColor: '#3B82F6',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    importButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    importNoteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F46E5',
        marginTop: 10,
        marginBottom: 5,
    },
    importNote: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 8,
        lineHeight: 18,
    },
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    checkMark: {
        fontSize: 60,
        color: '#10B981',
        marginBottom: 10,
        fontWeight: '300',
    },
    modalText: {
        marginBottom: 25,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    doneButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 10,
        paddingHorizontal: 30,
        paddingVertical: 12,
        elevation: 2,
    },
    doneButtonText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default EntryScreen;