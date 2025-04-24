// Örneğin app/index.tsx veya başka bir ekranda

import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useFetchNews } from '../../hooks/useFetchNews';
import { NewsArticle } from '../../types/news'; // NewsArticle tipini import etmeyi unutmayın

const HomeScreen = () => {
  // Hook'u çağır ve state'leri al
  // Buraya isterseniz farklı ülke, kategori vb. parametreler gönderebilirsiniz.
  const { articles, isLoading, error } = useFetchNews({ country: 'us' }); // Örnek: Sadece ABD haberlerini çek

  const renderArticle = ({ item }: { item: NewsArticle }) => (
    // Burada bir NewsCard bileşeni kullanabilirsiniz (daha önce bahsettiğimiz gibi)
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.source.name}</Text>
      {/* Daha fazla detay (resim, açıklama) NewsCard bileşeninde gösterilebilir */}
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Haberler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Hata: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.url + item.publishedAt} // Haberlerin benzersiz olduğundan emin olun, URL ve tarih iyi bir kombinasyon olabilir
      // Pagination eklemek için onEndReached gibi prop'lar burada kullanılır
      />
    </View>
  );
};

export default HomeScreen; // Expo Router veya React Navigation ile kullanmak için dışa aktar