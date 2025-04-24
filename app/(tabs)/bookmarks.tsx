import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import BookmarkService from '../../services/bookmarkService';
import NewsList from '../../components/NewsList';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EmptyState from '../../components/EmptyState';
import Toast, { ToastRef } from '../../components/Toast';
import { useRouter } from 'expo-router';
import { NewsArticle } from '../../types/news';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // useFocusEffect import edildi

const BookmarkScreen = () => {
    const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
    const [deletingMode, setDeletingMode] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const toastRef = useRef<ToastRef>(null);
    const router = useRouter();
    const navigation = useNavigation();

    const loadBookmarks = useCallback(async () => { // loadBookmarks useCallback ile sarmalandı
        setIsRefreshing(true);
        try {
            const saved = await BookmarkService.getBookmarks();
            setBookmarks(saved);
        } catch (error) {
            console.error("Error loading bookmarks:", error);
            setBookmarks([]);
        } finally {
            setIsRefreshing(false);
        }
    }, []); // loadBookmarks'ın bağımlılığı yok, bu yüzden stabil kalmalı

    // useFocusEffect kullanıyoruz, ekran her odaklandığında çalışacak
    useFocusEffect(
        useCallback(() => {
            console.log('Bookmark Screen Focused - Loading bookmarks...'); // Ekran odaklandığında logla
            loadBookmarks();
            // useFocusEffect bir temizleme fonksiyonu döndürebilir
            return () => {
                console.log('Bookmark Screen Blurred'); // Ekran odak dışına çıktığında logla
            };
        }, [loadBookmarks]) // loadBookmarks fonksiyonu bağımlılık olarak eklendi
    );


    const handleItemPress = useCallback((article: NewsArticle) => {
        if (!deletingMode) {
            router.push({
                pathname: '/news/[id]',
                params: { id: article.url.split('/').pop() || 'detail', article: JSON.stringify(article) },
            });
        }
    }, [deletingMode, router]);

    const handleDelete = useCallback(async (url: string) => {
        try {
            await BookmarkService.removeBookmark(url);
            await loadBookmarks(); // Silme işleminden sonra listeyi yeniden yükle
            toastRef.current?.show('Bookmark removed.');
        } catch (error) {
            console.error("Error deleting bookmark:", error);
            toastRef.current?.show('Error deleting bookmark.');
        }
    }, [loadBookmarks, toastRef]);

    const handleRefresh = useCallback(async () => {
        // NewsList componentinin pull-to-refresh özelliği bu fonksiyonu çağıracak
        await loadBookmarks(); // loadBookmarks zaten isRefreshing durumunu yönetiyor
    }, [loadBookmarks]);

    const toggleDeletingMode = useCallback(() => {
        setDeletingMode(prevMode => !prevMode);
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={toggleDeletingMode} style={{ marginRight: 15 }}>
                    <MaterialIcons
                        name={deletingMode ? 'close' : 'bookmark-remove'}
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, deletingMode, toggleDeletingMode]);


    const renderEmptyState = useCallback(() => (
        <EmptyState message={isRefreshing ? "Loading..." : "No Bookmarked news."} />
    ), [isRefreshing]);


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {isRefreshing && bookmarks.length === 0 ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.initialLoader} />
                ) : (
                    <NewsList
                        articles={bookmarks}
                        onItemPress={handleItemPress}
                        onDelete={handleDelete}
                        deletingMode={deletingMode}
                        refreshing={isRefreshing} // isRefreshing durumu NewsList'e iletiliyor
                        onRefresh={handleRefresh} // handleRefresh fonksiyonu NewsList'in onRefresh propuna bağlanıyor
                        ListEmptyComponent={renderEmptyState}
                    />
                )}

                <Toast ref={toastRef} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    } as ViewStyle,
    container: {
        flex: 1,
        padding: 16,
    } as ViewStyle,
    initialLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
});

export default BookmarkScreen;
