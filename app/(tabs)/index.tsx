import React, { useEffect, useState, useRef, useMemo, useLayoutEffect, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Colors from '@/constants/Colors';

const HomeScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  // Filtre ve arama parametrelerini tutan state'ler
  const [query, setQuery] = useState(''); // Bu state arama inputunun değeri için kullanılıyor
  const [country, setCountry] = useState('us'); // Filtre state'i
  const [sortType, setSortType] = useState<'publishedAt' | 'popularity' | undefined>('publishedAt'); // Filtre state'i

  // useFetchNews hook'unu filtre/arama parametreleri ile çağır
  const {
    articles,
    isLoading,
    isLoadingMore,
    error,
    refetch, // refetch fonksiyonu alındı
    loadMore,
    totalResults,
    hasMore,
  } = useFetchNews({
    query, // Hook'a başlangıç query'si olarak gönderiliyor
    country: query.trim() === '' ? country : undefined, // Başlangıç ülke filtresi
    sortType: query.trim() !== '' ? sortType : undefined, // Başlangıç sıralama filtresi
    // initialPage ve initialPageSize hook içinde varsayılan değerde
  });

  const [searchText, setSearchText] = useState(query); // Arama inputunun değeri için state
  const [isFocused, setIsFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Arama butonuna basıldığında veya klavyeden submit edildiğinde çalışır
  const handleSearch = useCallback(() => {
    const newQuery = searchText.trim();
    // refetch fonksiyonunu yeni query değeri ve o anki filtre state'leri ile çağır
    refetch({
      query: newQuery,
      country: newQuery.trim() === '' ? country : undefined, // Arama varsa ülke filtresi kaldırılır
      sortType: newQuery.trim() !== '' ? sortType : undefined, // Arama yoksa sıralama filtresi kaldırılır
    });
    // Arama inputunun state'ini de güncelleyelim ki UI doğru görünsün
    setQuery(newQuery);
    inputRef.current?.blur();
  }, [searchText, country, sortType, refetch]); // Bağımlılıklar güncellendi

  // İptal butonuna basıldığında çalışır
  const handleCancel = useCallback(() => {
    setSearchText(''); // Arama inputunu temizle
    // refetch fonksiyonunu boş query ve o anki ülke filtresi ile çağır
    refetch({
      query: '',
      country: country, // Arama temizlenince ülke filtresi geri gelir
      sortType: undefined, // Arama temizlenince sıralama filtresi kaldırılır
    });
    // Query state'ini de temizleyelim ki UI doğru görünsün
    setQuery('');
    inputRef.current?.blur();
  }, [country, refetch]); // Bağımlılıklar güncellendi

  // Aşağı çekerek yenileme handler'ı
  const handleRefresh = useCallback(async () => {
    console.log("Mevcut sorgu ve filtre ile yenileniyor (sayfa 1):", { query, country, sortType });
    // refetch fonksiyonunu o anki güncel state değerleri ile çağır
    await refetch({
      query: query,
      country: query.trim() === '' ? country : undefined,
      sortType: query.trim() !== '' ? sortType : undefined,
    });
  }, [query, country, sortType, refetch]); // Bağımlılıklar güncellendi

  // Filtre seçildiğinde çalışır
  const handleFilterSelect = useCallback((value: string) => {
    // Filtre seçildiğinde, ilgili filtre parametreleri ve mevcut query değeri ile refetch çağrısı yapılıyor.
    if (query.trim() === '') { // Arama yoksa ülke filtresi uygulanır
      refetch({ country: value, query: '' });
      setCountry(value); // UI state'ini güncelle
    } else { // Arama varsa sıralama filtresi uygulanır
      refetch({ sortType: value as 'popularity' | 'publishedAt', query });
      setSortType(value as 'popularity' | 'publishedAt'); // UI state'ini güncelle
    }
    setMenuVisible(false);
  }, [query, refetch]); // query ve refetch bağımlılıkları

  const filterOptions = useMemo(() => {
    return query.trim() === '' ? COUNTRIES : SORT_TYPES;
  }, [query]);

  const handleItemPress = useCallback((item: NewsArticle) => {
    router.push({
      pathname: '/news/[id]',
      params: { id: item.url.split('/').pop() || 'detail', article: JSON.stringify(item) },
    });
  }, [router]);

  const showEmptyState = !isLoading && !articles.length && !error;
  const showList = articles.length > 0;

  const renderHeaderRight = useCallback(() => (
    <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
      <MaterialIcons name="filter-list" size={24} color="#fff" />
    </TouchableOpacity>
  ), [setMenuVisible]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  const renderListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null;
    }
    if (error) {
      return <EmptyState message={`Hata: ${error}`} />;
    }
    if (!articles.length && !isLoadingMore) {
      return <EmptyState message="Haber bulunamadı." />;
    }
    return null;
  }, [isLoading, error, articles.length, isLoadingMore]);


  return (
    <View style={commonStyles.container}>
      {/* Arama Çubuğu */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search news..."
            placeholderTextColor="#888"
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
      </View>

      {/* Ana İçerik Alanı */}
      {isLoading && !articles.length ? (
        <ActivityIndicator size="large" color="#007AFF" style={commonStyles.loader} />
      ) : (
        <NewsList
          articles={articles}
          onItemPress={handleItemPress}
          refreshing={isLoading}
          onRefresh={handleRefresh} // Güncellenmiş handleRefresh fonksiyonu bağlandı
          onEndReached={hasMore ? loadMore : null}
          onEndReachedThreshold={0.5} // NewsList componentinde tanımlı olmalı
          loadingMore={isLoadingMore}
          ListEmptyComponent={renderListEmptyComponent}
        />
      )}

      {/* Filtre Menüsü Modal */}
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: '#000',
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
