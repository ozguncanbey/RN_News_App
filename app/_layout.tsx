import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme'; // Varsayılan şablon component yolu
import Colors from '@/constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const themeColors = Colors.light;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          // Genel Stack başlık stilleri (Detail ekranı için ezilebilir)
          headerStyle: {
            backgroundColor: themeColors.headerBackground, // Varsayılan başlık arka plan rengi
          },
          headerTintColor: themeColors.headerText, // Varsayılan başlık metin ve ikon rengi
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Sekme grubunu tanımla (başlığı gizli) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Haber Detay ekranını açıkça tanımla ve başlık stilini ayarla */}
        {/* Detail ekranının yolu app/news/[id].tsx olduğu için name propu 'news/[id]' olmalı */}
        <Stack.Screen
          name="news/[id]"
          options={{
            title: '', // Detail ekranının başlığı
            headerStyle: {
              backgroundColor: themeColors.headerBackground, // Detail ekranı başlık arka plan rengi
            },
            headerTintColor: themeColors.headerText, // Detail ekranı başlık metin ve ikon rengi
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackButtonDisplayMode: 'minimal', // Geri butonunu gizle
            headerBackTitle: '', // Geri butonu metnini tamamen gizle
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
