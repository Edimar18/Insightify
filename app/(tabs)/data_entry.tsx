import { Platform, StyleSheet , Text, View, ScrollView} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';


const TAB =  ['Revenue', 'Expenses', 'Delivery', 'Product', 'Customer']
export default function DataEntry() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>DATA ENTRY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECF0F1'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50'
  }
});
