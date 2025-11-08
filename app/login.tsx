import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const Login = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1200); // delay before form animation
    return () => clearTimeout(timer);
  }, []);

  const logoSource = { uri: 'https://via.placeholder.com/150x150.png?text=Insightify' };

  return (
    <View style={styles.container}>
      {/* Logo + App Name */}
      <MotiView
        from={{ opacity: 0, translateY: 2.5 }}
        animate={{ opacity: 1, translateY: showForm ? -height * 0.5 : 0 }} // move up when form appears
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
            animate={{ translateY: 0 }}
            exit={{ translateY: height }}
            transition={{ type: 'spring', damping: 35, stiffness: 90 }}
            style={styles.formWrapper}
          >
            {/* Triangle shape */}
            <Svg height="100" width={width} style={styles.triangle}>
              <Path d={`M0 100 L${width / 2} 0 L${width} 100 Z`} fill="#F2F4F7" />
            </Svg>

            {/* Form container */}
            <View style={styles.formContainer}>
              <Text style={styles.loginTitle}>Log In</Text>

              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Enter username"
                placeholderTextColor="#999"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
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
    top: '50%', // initially center vertically
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -60 }], // offset half the logo+text height
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
    paddingVertical: 40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 25,
    textShadowColor: '#ccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#007BFF',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});


