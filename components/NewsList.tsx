import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import { SCREEN_WIDTH } from '../constants/dimensions'; // Import yolu güncellendi
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Expo projesi için import
import { NewsArticle } from '../types/news'; // NewsArticle tipini import ettik

const imageSize = SCREEN_WIDTH * 0.3;

interface NewsListProps {
    articles: NewsArticle[]; // Tanımladığımız NewsArticle tipini kullandık
    onItemPress?: (article: NewsArticle) => void;
    onDelete?: (url: string) => void;
    deletingMode?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onEndReached?: () => void;
    loadingMore?: boolean;
    // HeaderComponent veya EmptyComponent gibi FlatList prop'larını da buraya ekleyebilirsiniz
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const NewsList: React.FC<NewsListProps> = ({
    articles,
    onItemPress,
    onDelete,
    deletingMode = false,
    refreshing = false,
    onRefresh, // undefined varsayılan değeri kullanmak yerine tipini belirttik
    onEndReached, // undefined varsayılan değeri kullanmak yerine tipini belirttik
    loadingMore = false,
    ListEmptyComponent, // Ekledik
}) => {
    const renderItem = ({ item }: { item: NewsArticle }) => ( // item tipi NewsArticle olarak güncellendi
        <View style={styles.itemRow}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => onItemPress?.(item)}
                activeOpacity={0.8} // Tıklama geri bildirimi için
            >
                {/* NewsArticle'da urlToImage olarak tanımladık, imageUrl değil */}
                {item.urlToImage ? (
                    <Image
                        source={{ uri: item.urlToImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>📰</Text>
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text numberOfLines={4} style={styles.title}>
                        {item.title}
                    </Text>
                    {/* Description alanı NewsArticle'da nullable idi, kontrol edelim */}
                    {item.description ? (
                        <Text numberOfLines={3} style={styles.description}>
                            {item.description}
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
            {deletingMode && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete?.(item.url)}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="delete" size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <FlatList
            data={articles}
            // keyExtractor için url ve publishedAt kullanmak daha güvenli,
            // çünkü başlıklar aynı olabilir.
            keyExtractor={(item) => item.url + '-' + item.publishedAt}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5} // Eşik değeri ayarlandı, 0.75 biraz yüksek olabilir
            ListFooterComponent={ // isLoadingMore propu yerine loadingMore kullandık
                loadingMore ? (
                    <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 16 }} />
                ) : null
            }
            ListEmptyComponent={ListEmptyComponent} // EmptyState bileşeni buraya verilebilir
        />
    );
};

const styles = StyleSheet.create({
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    } as ViewStyle,
    card: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        alignItems: 'stretch',
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        // Android shadow
        elevation: 1,
    } as ViewStyle,
    image: {
        width: imageSize,
        aspectRatio: 1, // Orjinal kodda imageSize'a eşitlenmişti, aspectRatio daha esnek
        borderRadius: 8,
        backgroundColor: '#ccc',
        marginRight: 12,
    } as ImageStyle,
    placeholder: {
        width: imageSize,
        aspectRatio: 1, // Orjinal kodda imageSize'a eşitlenmişti, aspectRatio daha esnek
        borderRadius: 8,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    } as ViewStyle,
    placeholderText: {
        fontSize: 28,
        color: 'white',
    } as TextStyle,
    textContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    } as ViewStyle,
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#007AFF',
    } as TextStyle,
    description: {
        marginTop: 4,
        fontSize: 14,
        color: '#333',
    } as TextStyle,
    listContent: {
        paddingBottom: 16,
        // Eğer liste boşsa ortalanması için
        flexGrow: 1,
        justifyContent: 'center',
    } as ViewStyle,
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
        justifyContent: 'center', // İkonu ortalamak için
        alignItems: 'center',
    } as ViewStyle,
});

export default NewsList;