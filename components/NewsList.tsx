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
import { SCREEN_WIDTH } from '../constants/dimensions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NewsArticle } from '../types/news';

const imageSize = SCREEN_WIDTH * 0.3;

interface NewsListProps {
    articles: NewsArticle[];
    onItemPress?: (article: NewsArticle) => void;
    onDelete?: (url: string) => void;
    deletingMode?: boolean;
    refreshing?: boolean;
    onRefresh?: (() => void | Promise<void>) | null;
    onEndReached?: (() => void | Promise<void>) | null;
    onEndReachedThreshold?: number | null | undefined; // onEndReachedThreshold prop'u eklendi
    loadingMore?: boolean;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const NewsList: React.FC<NewsListProps> = ({
    articles,
    onItemPress,
    onDelete,
    deletingMode = false,
    refreshing = false,
    onRefresh,
    onEndReached,
    onEndReachedThreshold, // prop buraya eklendi
    loadingMore = false,
    ListEmptyComponent,
}) => {
    const renderItem = ({ item }: { item: NewsArticle }) => (
        <View style={styles.itemRow}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => onItemPress?.(item)}
                activeOpacity={0.8}
            >
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
                    <MaterialIcons name="bookmark-remove" size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <FlatList
            data={articles}
            keyExtractor={(item) => item.url + '-' + item.publishedAt}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold} // prop FlatList'e iletildi
            ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 16 }} />
                ) : null
            }
            ListEmptyComponent={ListEmptyComponent}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    } as ViewStyle,
    image: {
        width: imageSize,
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: '#ccc',
        marginRight: 12,
    } as ImageStyle,
    placeholder: {
        width: imageSize,
        aspectRatio: 1,
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
        flexGrow: 1,
    } as ViewStyle,
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 8,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
});

export default NewsList;
