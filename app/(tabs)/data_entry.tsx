import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';

// --- Component 1: Custom Header (Reused for uniformity) ---
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

type EntryTabsProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};
// --- Component 2: Sub-Tab Navigation ---
const EntryTabs = ({ activeTab, setActiveTab }: EntryTabsProps) => {
    const tabs = [
        { key: 'Product', label: 'Product' },
        { key: 'Revenue', label: 'Revenue' },
        { key: 'Expense', label: 'Expense' },
        { key: 'Import', label: 'Import' }, // Added based on context
    ];

    return (
        <View style={tabStyles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={[tabStyles.tab, activeTab === tab.key && tabStyles.activeTab]}
                    onPress={() => setActiveTab(tab.key)}
                >
                    <Text style={[
                        tabStyles.tabText,
                        activeTab === tab.key && tabStyles.activeTabText
                    ]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};


type CustomInputProps = {
    label: string;
    placeholder: string;
    isDropdown?: boolean;
    multiline?: boolean;
};
// --- Component 3: Custom Input Field (Simplified for UI) ---
const CustomInput = ({ label, placeholder, isDropdown = false, multiline = false }: CustomInputProps) => (
    <View style={formStyles.inputGroup}>
        <Text style={formStyles.label}>{label}</Text>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            style={[
                formStyles.input, 
                isDropdown && formStyles.dropdown,
                multiline && formStyles.textArea,
            ]}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
        />
        {/* Placeholder for the dropdown arrow or calendar icon if needed */}
        {isDropdown && <Text style={formStyles.dropdownIcon}>▼</Text>}
    </View>
);

// --- Component 4: Forms for Each Tab ---

const ProductForm = () => (
    <>
        <Text style={formStyles.formTitle}>Add Product</Text>
        <CustomInput label="Product Name" placeholder="Input Text" />
        <CustomInput label="Category" placeholder="Select Category" isDropdown={true} />
        <CustomInput label="Price" placeholder="Value" />
        <CustomInput label="Stock Quantity" placeholder="Value" />
    </>
);

const RevenueForm = () => (
    <>
        <Text style={formStyles.formTitle}>Add Revenue</Text>
        {/* Date input can be complex, using simple text input for UI */}
        <CustomInput label="Date" placeholder="MM/DD/YYYY" /> 
        <CustomInput label="Product" placeholder="Input Text" />
        <CustomInput label="Quantity Sold" placeholder="Value" />
        <CustomInput label="Unit Price" placeholder="Value" />
        <CustomInput label="Total Amount" placeholder="Value" />
        <CustomInput label="Payment Method" placeholder="Select" isDropdown={true} />
    </>
);

const ExpenseForm = () => (
    <>
        <Text style={formStyles.formTitle}>Add Expense</Text>
        <CustomInput label="Date" placeholder="MM/DD/YYYY" /> 
        <CustomInput label="Expense Name" placeholder="Input Text" />
        <CustomInput label="Category" placeholder="Select Category" isDropdown={true} />
        <CustomInput label="Amount" placeholder="Value" />
        <CustomInput label="Notes" placeholder="Input Text" multiline={true} />
    </>
);

const ImportForm = () => (
    <View style={formStyles.importContainer}>
        <Text style={formStyles.formTitle}>Import Data</Text>
        <Text style={formStyles.importDescription}>
            Upload your existing transaction data from a CSV file. The file should contain columns for Date, Type (Revenue/Expense), Category, and Amount.
        </Text>
        
        <TouchableOpacity style={formStyles.importButton}>
            <Text style={formStyles.importButtonText}>Select CSV File to Import</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
            <Text style={formStyles.importNoteTitle}>Data Requirement Check:</Text>
            <Text style={formStyles.importNote}>
                Your current forms cover **Product Inventory**, **Revenue**, and **Expenses**. This is sufficient for the core BI needs.
            </Text>
            <Text style={formStyles.importNote}>
                **Missing Crucial Entry:** Based on your problem statement ("Track the efficiency of delivery operations"), you might want a dedicated **Delivery Cost/Log** entry form. For now, this is tracked as part of the 'Expense' form, but a dedicated form could enhance tracking delivery efficiency KPIs.
            </Text>
        </View>
    </View>
);


type SaveModalProps = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
};
// --- Component 5: Save Confirmation Modal ---
const SaveModal = ({ modalVisible, setModalVisible }: SaveModalProps) => (
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
    const [activeTab, setActiveTab] = useState('Product');
    const [modalVisible, setModalVisible] = useState(false);

    const renderForm = () => {
        switch (activeTab) {
            case 'Product':
                return <ProductForm />;
            case 'Revenue':
                return <RevenueForm />;
            case 'Expense':
                return <ExpenseForm />;
            case 'Import':
                return <ImportForm />;
            default:
                return <ProductForm />;
        }
    };
    
    // Function to simulate saving (just for UI demonstration)
    const handleSave = () => {
        // In a real app, this would be the save logic
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader />
                <EntryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Main Form/Content Area */}
                <View style={formStyles.mainCard}>
                    {renderForm()}
                </View>

                {/* Action Buttons (Always present) */}
                <View style={formStyles.actionButtons}>
                    <TouchableOpacity style={[formStyles.button, formStyles.backButton]}>
                        <Text style={formStyles.buttonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[formStyles.button, formStyles.saveButton]}
                        onPress={handleSave} // Only used for UI demo
                    >
                        <Text style={[formStyles.buttonText, formStyles.saveButtonText]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            <SaveModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </SafeAreaView>
    );
};

// --- Stylesheets ---

// General Styles
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
    contentContainer: { paddingBottom: 20 },
    // Header Styles (reused)
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, marginBottom: 10 },
    logoGroup: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: { fontSize: 24, marginRight: 8, color: '#4F46E5' },
    logoText: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
    profileImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#4F46E5' },
});

// Tab Navigation Styles
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
        // Shadow for the lifted tab effect
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

// Form and Input Styles
const formStyles = StyleSheet.create({
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
    dropdown: {
        paddingRight: 40, // Space for the arrow
    },
    textArea: {
        minHeight: 100,
        paddingVertical: 10,
    },
    dropdownIcon: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        color: '#6B7280',
        fontSize: 10,
    },
    // Action Button Styles
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    backButton: {
        backgroundColor: '#D1D5DB',
    },
    saveButton: {
        backgroundColor: '#4F46E5', // Primary Purple
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    saveButtonText: {
        color: '#FFFFFF',
    },

    // Import Tab Styles
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
        backgroundColor: '#3B82F6', // Blue for upload
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

// Modal Styles
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay
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
        color: '#10B981', // Green checkmark
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
