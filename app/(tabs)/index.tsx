import React, { useEffect, useState, useRef, useMemo } from 'react';
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

const HomeScreen = () => {
  const router = useRouter();

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

  const handleSearch = () => {
    setQuery(searchText.trim());
    inputRef.current?.blur();
  };

  const handleCancel = () => {
    setSearchText('');
    setQuery('');
    inputRef.current?.blur();
  };

  const handleRefresh = () => {
    if (query !== '') {
      setQuery('');
    } else {
      console.log("Refreshing...");
    }
  };

  const handleFilterSelect = (value: string) => {
    if (query.trim() === '') {
      setCountry(value);
    } else {
      setSortType(value as 'popularity' | 'publishedAt');
    }
    setMenuVisible(false);
  };

  const filterOptions = query.trim() === '' ? COUNTRIES : SORT_TYPES;

  const handleItemPress = (item: NewsArticle) => {
    router.push({
      pathname: '/news/[id]',
      params: { id: item.url.split('/').pop() || 'detail', article: JSON.stringify(item) },
    });
  };

  const showEmptyState = !isLoading && !articles.length && !error;
  const showList = articles.length > 0;

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
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginLeft: 8 }}>
          <MaterialIcons name="filter-list" size={24} color="#333" />
        </TouchableOpacity>
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
    paddingHorizontal: 16,
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
  },
  cancelCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#999',
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