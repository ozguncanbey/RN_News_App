import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Share,
    Linking,
    SafeAreaView,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BookmarkService from '../../services/bookmarkService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NewsArticle } from '../../types/news';
import { useNavigation } from '@react-navigation/native'; // useNavigation import edildi

const DetailScreen = () => {
    const { article } = useLocalSearchParams();
    const parsedArticle: NewsArticle | undefined = article ? JSON.parse(article as string) : undefined;

    const [isBookmarked, setIsBookmarked] = useState(false);
    const router = useRouter();
    const navigation = useNavigation(); // useNavigation hook'u çağrıldı

    if (!parsedArticle) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Haber bilgisi yüklenemedi.</Text>
            </View>
        );
    }

    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: `${parsedArticle.title}\n${parsedArticle.url}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    }, [parsedArticle]);

    const toggleBookmark = useCallback(async () => {
        if (isBookmarked) {
            await BookmarkService.removeBookmark(parsedArticle.url);
        } else {
            await BookmarkService.addBookmark(parsedArticle);
        }
        setIsBookmarked(!isBookmarked);
    }, [isBookmarked, parsedArticle]);

    const handleReadMore = useCallback(() => {
        if (parsedArticle.url) {
            Linking.openURL(parsedArticle.url).catch(err => console.error('An error occurred', err));
        }
    }, [parsedArticle]);


    useEffect(() => {
        const checkBookmark = async () => {
            if (parsedArticle?.url) {
                const result = await BookmarkService.isBookmarked(parsedArticle.url);
                setIsBookmarked(result);
            }
        };
        checkBookmark();
    }, [parsedArticle?.url]);

    // Header seçeneklerini ayarlamak için useLayoutEffect ve navigation.setOptions kullanıyoruz
    useLayoutEffect(() => {
        navigation.setOptions({ // router.setOptions yerine navigation.setOptions kullanıldı
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <TouchableOpacity onPress={handleShare} style={{ marginLeft: 15 }}>
                        <MaterialIcons name="share" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleBookmark} style={{ marginLeft: 15 }}>
                        <MaterialIcons
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isBookmarked, handleShare, toggleBookmark]); // Bağımlılıklar güncellendi

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{parsedArticle.title}</Text>

                {parsedArticle.urlToImage ? (
                    <Image
                        source={{ uri: parsedArticle.urlToImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderIcon}>📰</Text>
                    </View>
                )}

                <View style={styles.meta}>
                    {parsedArticle.author && (
                        <Text style={styles.author}>
                            {parsedArticle.author}
                        </Text>
                    )}
                    {parsedArticle.publishedAt && (
                        <Text style={styles.date}>
                            {new Date(parsedArticle.publishedAt).toLocaleDateString()}
                        </Text>
                    )}
                </View>

                {parsedArticle.description && (
                    <Text style={styles.description}>{parsedArticle.description}</Text>
                )}

                <Text style={styles.contentText}>{parsedArticle.content || 'No content available.'}</Text>

                {parsedArticle.url && (
                    <TouchableOpacity onPress={handleReadMore}>
                        <Text style={styles.readMore}>Read More</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

export const options = {
    title: 'Details',
    headerStyle: {
        backgroundColor: '#007AFF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};

const styles = StyleSheet.create({
    content: {
        padding: 16,
        backgroundColor: '#fff',
    } as ViewStyle,
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 16,
    } as TextStyle,
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 8,
    } as ImageStyle,
    placeholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    } as ViewStyle,
    placeholderIcon: {
        fontSize: 36,
        color: '#fff',
    } as TextStyle,
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    } as ViewStyle,
    author: {
        fontSize: 12,
        color: '#666',
        flexShrink: 1,
        marginRight: 8,
    } as TextStyle,
    date: {
        fontSize: 12,
        color: '#666',
    } as TextStyle,
    description: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 16,
        color: '#000',
    } as TextStyle,
    contentText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 16,
    } as TextStyle,
    readMore: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
        textDecorationLine: 'underline',
    } as TextStyle,
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    } as ViewStyle,
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    } as TextStyle,
});

export default DetailScreen;
