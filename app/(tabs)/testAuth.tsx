import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';

// Import from the config file we just created
import { auth, db } from '../../firebaseConfig'; 
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to add logs to screen
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(`[${timestamp}] ${message}`);
  };

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        addLog(`User detected: ${currentUser.uid}`);
      } else {
        addLog("No user logged in.");
      }
    });
    return unsubscribe; // Cleanup subscription
  }, []);

  // 2. Test Login Function
  const handleLogin = async () => {
    setLoading(true);
    try {
      addLog("Attempting Anonymous Login...");
      await signInAnonymously(auth);
      addLog("Login Success!");
    } catch (error) {
      addLog(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Test Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      addLog("Logged out successfully.");
    } catch (error) {
      addLog(`Logout Error: ${error.message}`);
    }
  };

  // 4. Test Firestore Write
  const handleTestFirestore = async () => {
    if (!user) {
      addLog("Error: You must login first before testing Firestore.");
      return;
    }

    setLoading(true);
    try {
      addLog("Attempting to write to 'test_collection'...");
      
      const docRef = await addDoc(collection(db, "test_collection"), {
        testData: "Hello Firebase!",
        createdAt: new Date(),
        userId: user.uid
      });
      
      addLog(`Success! Document written with ID: ${docRef.id}`);
    } catch (error) {
      addLog(`Firestore Error: ${error.message}`);
      addLog("Hint: Check if Firestore Rules allow writes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {user ? "Connected ✅" : "Disconnected ❌"}
        </Text>
        {user && <Text style={styles.uid}>UID: {user.uid}</Text>}
      </View>

      <View style={styles.buttonGroup}>
        {!user ? (
          <Button title="1. Test Login (Anonymous)" onPress={handleLogin} disabled={loading} />
        ) : (
          <Button title="Log Out" onPress={handleLogout} color="red" disabled={loading} />
        )}
        
        <View style={{height: 10}} />
        
        <Button 
          title="2. Test Firestore Write" 
          onPress={handleTestFirestore} 
          disabled={loading || !user} 
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />}

      <Text style={styles.logTitle}>Logs:</Text>
      <ScrollView style={styles.logArea}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  uid: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logArea: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
  },
  logText: {
    color: '#00ff00',
    fontFamily: 'monospace',
    marginBottom: 5,
    fontSize: 12,
  }
});
