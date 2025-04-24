import { Tabs } from 'expo-router';
import React from 'react';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // İkon kullanımı için

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
      {/* Sekme tanımlarınızı buraya ekleyin veya güncelleyin */}
      {/* Örnek Ana Sayfa Sekmesi */}
      <Tabs.Screen
        name="index" // app/(tabs)/index.tsx dosyasına karşılık gelir
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" color={color} size={24} />
          ),
          headerShown: true,
          // Sekmeye özel başlık stili gerekirse burada ezilebilir
          // headerStyle: { backgroundColor: Colors.light.headerBackground },
          // headerTintColor: Colors.light.headerText,
        }}
      />
      {/* Diğer sekmeler (örn: Kayıtlı Haberler) buraya gelecek */}
      {/* <Tabs.Screen
             name="bookmarks" // Örnek olarak app/(tabs)/bookmarks.tsx
             options={{
                 title: 'Kayıtlı Haberler',
                 tabBarIcon: ({ color, focused }) => (
                     <MaterialIcons name={focused ? 'bookmark' : 'bookmark-outline'} color={color} size={24} />
                 ),
                 headerShown: true,
             }}
         /> */}
    </Tabs>
  );
}