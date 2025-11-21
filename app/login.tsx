import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { 
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const Login = () => {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'login' | 'signup'>('login');

  // Lift amount when keyboard shows
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard lift animation effect
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height * 0.01); // adjust lift strength
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logoSource = { uri: 'https://via.placeholder.com/150x150.png?text=Insightify' };

  const toggleFormMode = () => {
    setFormMode(prev => (prev === 'login' ? 'signup' : 'login'));
  };

  const handleLogin = () => {
    if (username.toLowerCase() === 'edimar' && password === '12345') {
      router.replace('/home');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        
        {/* Logo + App Name */}
        <MotiView
          from={{ opacity: 0, translateY: 2.5 }}
          animate={{ opacity: 1, translateY: showForm ? -height * 0.5 : 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.logoContainer}
        >
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>Insightify</Text>
        </MotiView>

        {/* Login Form */}
        <AnimatePresence>
          {showForm && (
            <MotiView
              from={{ translateY: height }}
              animate={{ 
                translateY: -keyboardOffset, // lift form when typing
              }}
              exit={{ translateY: height }}
              transition={{ type: 'timing', duration: 300 }}
              style={styles.formWrapper}
            >
              {/* Triangle shape */}
              <Svg height="100" width={width} style={styles.triangle}>
                <Path d={`M0 100 L${width / 2} 0 L${width} 100 Z`} fill="#F2F4F7" />
              </Svg>

              {/* Form container */}
              <View style={styles.formContainer}>
                <AnimatePresence exitBeforeEnter>
                  {formMode === 'login' ? (
                    <MotiView
                      key="login"
                      from={{ opacity: 0, translateX: -50 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      exit={{ opacity: 0, translateX: 50 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={styles.innerFormContainer}
                    >
                      <Text style={styles.loginTitle}>Log In</Text>
                      <Text style={styles.label}>Username</Text>
                      <TextInput 
                        placeholder="Enter username" 
                        placeholderTextColor="#999"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                      />
                      <Text style={styles.label}>Password</Text>
                      <TextInput 
                        placeholder="Enter password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                      />

                      <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log in</Text>
                      </TouchableOpacity>
                    </MotiView>
                  ) : (
                    <MotiView
                      key="signup"
                      from={{ opacity: 0, translateX: 50 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      exit={{ opacity: 0, translateX: -50 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={styles.innerFormContainer}
                    >
                      <Text style={styles.loginTitle}>Sign Up</Text>
                      <Text style={styles.label}>Email</Text>
                      <TextInput 
                        placeholder="Enter your email" 
                        placeholderTextColor="#999"
                        style={styles.input}
                        keyboardType="email-address"
                      />
                      <Text style={styles.label}>Username</Text>
                      <TextInput 
                        placeholder="Choose a username" 
                        placeholderTextColor="#999"
                        style={styles.input}
                      />
                      <Text style={styles.label}>Password</Text>
                      <TextInput 
                        placeholder="Create a password" 
                        placeholderTextColor="#999"
                        secureTextEntry
                        style={styles.input}
                      />

                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Create Account</Text>
                      </TouchableOpacity>
                    </MotiView>
                  )}
                </AnimatePresence>

                <TouchableOpacity onPress={toggleFormMode} style={styles.toggleButton}>
                  <Text style={styles.toggleText}>
                    {formMode === 'login'
                      ? "Don't have an account? "
                      : 'Already have an account? '}
                    <Text style={styles.toggleTextHighlight}>
                      {formMode === 'login' ? 'Sign Up' : 'Log In'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </AnimatePresence>

      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E3A48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    transform: [{ translateY: -60 }],
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  formWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    top: -99,
  },
  formContainer: {
    backgroundColor: '#F2F4F7',
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  innerFormContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 25,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#607080',
    marginLeft: 40,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
  },
  toggleText: {
    color: '#607080',
    fontSize: 14,
  },
  toggleTextHighlight: {
    color: '#007BFF',
    fontWeight: '700',
  },
});
