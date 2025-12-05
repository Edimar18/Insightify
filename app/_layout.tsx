import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Optional Expo Router setting
export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false, // Hide headers by default
          animation: 'fade',  // Smooth transition
        }}
      >
        {/* Login Screen (shown first) */}
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        {/* Main App (Tabs) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Personal Info Screen */}
        <Stack.Screen
          name="personal-info"
          options={{ headerShown: false }}
        />

        {/* Edit Profile Screen */}
        <Stack.Screen
          name="edit-profile"
          options={{ headerShown: false }}
        />

        {/* Modal Screen (optional) */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
