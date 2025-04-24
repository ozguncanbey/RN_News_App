const tintColorLight = '#007AFF';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#999',
    tabIconSelected: tintColorLight,
    headerBackground: tintColorLight, // Başlık arka planı ana tema rengi olsun
    headerText: '#fff', // Başlık metin rengi beyaz olsun
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    headerBackground: '#000', // Karanlık temada başlık arka planı siyah olabilir
    headerText: '#fff', // Karanlık temada başlık metni beyaz
  },
};

export type ThemeColors = {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  headerBackground: string;
  headerText: string;
};