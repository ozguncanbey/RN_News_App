import { Tabs } from 'expo-router';
import React from 'react';

// Eğer varsayılan şablon Colors dosyasını kullanıyorsanız orayı güncelleyin
// veya doğrudan renk kodlarını kullanın.
// Biz burada doğrudan renk kodlarını kullanacağız.
const PRIMARY_COLOR = '#007AFF';
const TAB_INACTIVE_COLOR = '#999';
const TAB_BACKGROUND_COLOR = '#fff';
const HEADER_TINT_COLOR = '#fff'; // Başlık rengi (genellikle beyaz)
const HEADER_BACKGROUND_COLOR = PRIMARY_COLOR; // Başlık arka plan rengi

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: TAB_BACKGROUND_COLOR,
        },
        headerStyle: {
          backgroundColor: HEADER_BACKGROUND_COLOR,
        },
        headerTintColor: HEADER_TINT_COLOR,
        // headerShown: false, // Başlık çubuğunu tamamen kaldırmak isterseniz
      }}>
      {/* Sekme tanımları burada yer alır. Örneğin: */}
      {/* <Tabs.Screen
        name="index" // app/(tabs)/index.tsx dosyasına karşılık gelir
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="explore" // app/(tabs)/explore.tsx dosyasına karşılık gelir
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}

// Not: app/news/[id].tsx dosyasındaki 'options' export'u,
// o ekrana özel başlık stilini belirler ve buradaki varsayılanları ezer.
// O dosyadaki başlık rengi zaten #007AFF olarak ayarlıydı.