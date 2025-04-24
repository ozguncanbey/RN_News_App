import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams } from 'expo-router';
import { NewsArticle } from '../../types/news';

const DetailScreen = () => {
    const { article } = useLocalSearchParams();
    const parsedArticle: NewsArticle | undefined = article ? JSON.parse(article as string) : undefined;
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Eğer makale bilgisi gelmemişse boş bir ekran veya hata gösterebiliriz
    if (!parsedArticle) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Haber bilgisi yüklenemedi.</Text>
            </View>
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${parsedArticle.title}\n${parsedArticle.url}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const toggleBookmark = async () => {
        if (isBookmarked) {
            await BookmarkService.removeBookmark(parsedArticle.url);
        } else {
            await BookmarkService.addBookmark(parsedArticle);
        }
        setIsBookmarked(!isBookmarked);
    };

    const handleReadMore = () => {
        if (parsedArticle.url) {
            Linking.openURL(parsedArticle.url).catch(err => console.error('An error occurred', err)); // Hata yakalama eklendi
        }
    };

    useEffect(() => {
        const checkBookmark = async () => {
            // parsedArticle.url'nin varlığını kontrol etmeliyiz
            if (parsedArticle?.url) {
                const result = await BookmarkService.isBookmarked(parsedArticle.url);
                setIsBookmarked(result);
            }
        };
        checkBookmark();
    }, [parsedArticle?.url]); // Bağımlılık olarak parsedArticle.url kullanıldı

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{parsedArticle.title}</Text>

                {/* Resim URL'si alanını NewsArticle tipine göre urlToImage olarak güncelledik */}
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
                    {/* Yazar ve Tarih alanları nullable olabilir */}
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

                {/* Description alanı nullable olabilir */}
                {parsedArticle.description && (
                    <Text style={styles.description}>{parsedArticle.description}</Text>
                )}

                {/* Content alanı nullable olabilir */}
                <Text style={styles.contentText}>{parsedArticle.content || 'No content available.'}</Text>


                {/* url alanı nullable olabilir */}
                {parsedArticle.url && (
                    <TouchableOpacity onPress={handleReadMore}>
                        <Text style={styles.readMore}>Read More</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={handleShare}>
                        <MaterialIcons name="share" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleBookmark}>
                        <MaterialIcons
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color="#007AFF"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Expo Router static options
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
        flexShrink: 1, // Uzun yazarlar için satır atlamasını sağla
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
        textDecorationLine: 'underline', // Daha belirgin olması için altı çizili yapılabilir
    } as TextStyle,
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        gap: 16, // Elemanlar arasına boşluk ekler (RN 0.71+ veya polyfill)
        // Gap desteklenmiyorsa:
        // & > *: { marginRight: 16; } gibi stil yazabiliriz,
        // veya her TouchableOpacity'ye marginRight ekleyip sonuncudan kaldırabiliriz.
    } as ViewStyle,
    errorContainer: { // Hata veya makale bulunamadığında gösterilecek stil
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