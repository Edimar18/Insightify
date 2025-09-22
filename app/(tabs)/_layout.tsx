import { Tabs } from 'expo-router';
import React from 'react';
import {View} from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ECF0F1",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { backgroundColor: "#2C3E50" , paddingTop: 10, paddingBottom: 10, height: 70},
        tabBarItemStyle: {borderRadius: 20}
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => 
            <MaterialCommunityIcons size={28} name='home' color={color} />
          ,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="chart-bar" color={color} />,
        }}
        
      />
      <Tabs.Screen
        name="data_entry"
        options={{
          title: 'Entry',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="form-textbox" color={color} />,
        }}
        
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-circle" color={color} />,
        }}
        
      />
    </Tabs>
  );
}
