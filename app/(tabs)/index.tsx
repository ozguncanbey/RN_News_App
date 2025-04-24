import React, { useEffect, useState, useRef, useMemo, useLayoutEffect, useCallback } from 'react'; // useLayoutEffect, useCallback import edildi
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { useRouter } from 'expo-router';
import NewsList from '../../components/NewsList';
import { commonStyles } from '../../styles/commonStyles';
import EmptyState from '../../components/EmptyState';
import FilterMenu from '../../components/FilterMenu';
import { COUNTRIES } from '../../constants/countries';
import { SORT_TYPES } from '../../constants/sortTypes';
import { useFetchNews } from '../../hooks/useFetchNews';
import { NewsArticle } from '../../types/news';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // useNavigation import edildi
import Colors from '@/constants/Colors';

const HomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation(); // useNavigation hook'u çağrıldı

  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('us');
  const [sortType, setSortType] = useState<'publishedAt' | 'popularity' | undefined>('publishedAt');

  const { articles, isLoading, error } = useFetchNews({
    query,
    country: query.trim() === '' ? country : undefined,
    sortType: query.trim() !== '' ? sortType : undefined,
  });

  const [searchText, setSearchText] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSearch = useCallback(() => { // useCallback eklendi
    setQuery(searchText.trim());
    inputRef.current?.blur();
  }, [searchText]); // searchText bağımlılığı

  const handleCancel = useCallback(() => { // useCallback eklendi
    setSearchText('');
    setQuery('');
    inputRef.current?.blur();
  }, []); // Bağımlılık yok

  const handleRefresh = useCallback(() => { // useCallback eklendi
    if (query !== '') {
      setQuery('');
    } else {
      console.log("Refreshing...");
      // Gerçek yenileme için useFetchNews hook'una refetch fonksiyonu eklenebilir
    }
  }, [query]); // query bağımlılığı

  const handleFilterSelect = useCallback((value: string) => { // useCallback eklendi
    if (query.trim() === '') {
      setCountry(value);
    } else {
      setSortType(value as 'popularity' | 'publishedAt');
    }
    setMenuVisible(false);
  }, [query]); // query bağımlılığı

  const filterOptions = useMemo(() => { // useMemo eklendi
    return query.trim() === '' ? COUNTRIES : SORT_TYPES;
  }, [query]); // query bağımlılığı

  const handleItemPress = useCallback((item: NewsArticle) => { // useCallback eklendi
    router.push({
      pathname: '/news/[id]',
      params: { id: item.url.split('/').pop() || 'detail', article: JSON.stringify(item) },
    });
  }, [router]); // router bağımlılığı

  const showEmptyState = !isLoading && !articles.length && !error;
  const showList = articles.length > 0;

  // Filtre menüsünü açacak butonu render eden fonksiyon
  const renderHeaderRight = useCallback(() => (
    <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}> {/* Sağdan boşluk ayarı */}
      <MaterialIcons name="filter-list" size={24} color="#fff" /> {/* Başlık rengiyle uyumlu ikon rengi */}
    </TouchableOpacity>
  ), [setMenuVisible]); // setMenuVisible bağımlılığı

  // Header seçeneklerini ayarlamak için useLayoutEffect kullanıyoruz
  useLayoutEffect(() => {
    navigation.setOptions({ // navigation.setOptions kullanıldı
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]); // navigation ve renderHeaderRight bağımlılıkları


  return (
    <View style={commonStyles.container}>
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {(isFocused || searchText !== '') && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelCircle}>
              <Text style={styles.cancelIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Filtre butonu header'a taşındı */}
        {/* <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginLeft: 8 }}>
          <MaterialIcons name="filter-list" size={24} color="#333" />
        </TouchableOpacity> */}
      </View>

      {isLoading && !articles.length ? (
        <ActivityIndicator size="large" color="#007AFF" style={commonStyles.loader} />
      ) : showEmptyState ? (
        <EmptyState message={error ? error : "Haber bulunamadı."} />
      ) : showList ? (
        <NewsList
          articles={articles}
          onItemPress={handleItemPress}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      ) : null}


      <FilterMenu
        visible={menuVisible}
        options={filterOptions}
        onSelect={handleFilterSelect}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 0,
  } as ViewStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 44,
    flex: 1,
  } as ViewStyle,
  searchIcon: {
    fontSize: 18,
    color: '#999',
    marginRight: 4,
  } as TextStyle,
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 8,
  } as TextStyle,
  cancelCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  } as ViewStyle,
  cancelIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  } as TextStyle,
});

export default HomeScreen;
