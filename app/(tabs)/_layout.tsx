import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const themeColors = Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabIconSelected,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: themeColors.background,
        },
        headerStyle: {
          backgroundColor: themeColors.headerBackground,
        },
        headerTintColor: themeColors.headerText,
      }}>
      {/* Ana Sayfa Sekmesi */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
          headerShown: true,
        }}
      />

      {/* Kayıtlı Haberler Sekmesi Eklendi */}
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={24} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}