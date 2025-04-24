import React, { useEffect, useState, useRef } from 'react';
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
import BookmarkService from '../../services/bookmarkService'; // Import yolu güncellendi
import NewsList from '../../components/NewsList'; // Import yolu güncellendi
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Expo için import
import EmptyState from '../../components/EmptyState'; // Import yolu güncellendi
import Toast, { ToastRef } from '../../components/Toast'; // Import yolu güncellendi
import { useRouter } from 'expo-router';
import { NewsArticle } from '../../types/news'; // NewsArticle tipini import ettik

const BookmarkScreen = () => {
    const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]); // Tip eklendi
    const [deletingMode, setDeletingMode] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const toastRef = useRef<ToastRef>(null);
    const router = useRouter();

    const loadBookmarks = async () => {
        setIsRefreshing(true); // Yükleme durumunu başlat
        try {
            const saved = await BookmarkService.getBookmarks();
            setBookmarks(saved);
        } catch (error) {
            console.error("Error loading bookmarks:", error);
            // Hata yönetimi burada yapılabilir, örneğin toast göstermek gibi
            setBookmarks([]); // Hata durumunda listeyi temizle
        } finally {
            setIsRefreshing(false); // Yükleme durumunu bitir
        }
    };

    useEffect(() => {
        loadBookmarks();
        // Uygulama bu ekrana her odaklandığında bookmarkları yeniden yüklemek için
        // Expo Router'ın useFocusEffect hook'u daha uygun olabilir.
        // Şimdilik useEffect ilk yüklendiğinde çalışır.
    }, []);


    const handleItemPress = (article: NewsArticle) => { // Tip eklendi
        if (!deletingMode) {
            router.push({
                pathname: '/news/[id]', // Dinamik rota yapısı
                params: { id: article.url.split('/').pop() || 'detail', article: JSON.stringify(article) },
            });
        }
    };

    const handleDelete = async (url: string) => {
        try {
            await BookmarkService.removeBookmark(url);
            // Sadece silineni listeden çıkarmak yerine tüm listeyi yeniden çekmek daha güvenli olabilir
            await loadBookmarks();
            toastRef.current?.show('Yer işareti kaldırıldı.'); // Mesaj güncellendi
        } catch (error) {
            console.error("Error deleting bookmark:", error);
            toastRef.current?.show('Yer işareti kaldırılırken bir hata oluştu.');
        }
    };

    const handleRefresh = async () => {
        await loadBookmarks(); // loadBookmarks zaten isRefreshing durumunu yönetiyor
    };

    const toggleDeletingMode = () => {
        setDeletingMode(!deletingMode);
        // Silme modundan çıkınca toast gösterme mantığı eklenebilir
    };


    // NewsList componentine verilecek ListEmptyComponent
    const renderEmptyState = () => <EmptyState message={isRefreshing ? "Yükleniyor..." : "Kayıtlı haber bulunamadı."} />;


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* NewsList'in kendi içinde isRefreshing ve boş durum yönetimi olduğu için buradaki koşulları sadeleştirebiliriz */}
                {/* Ancak ilk yüklenme anında NewsList yerine sadece ActivityIndicator göstermek isteyebiliriz */}
                {isRefreshing && bookmarks.length === 0 ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.initialLoader} />
                ) : (
                    <NewsList
                        articles={bookmarks} // Tip artık NewsArticle[]
                        onItemPress={handleItemPress}
                        onDelete={handleDelete}
                        deletingMode={deletingMode}
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={renderEmptyState} // Boş durumu NewsList'in propu olarak verdik
                    // Pagination prop'ları burada gerekli değil
                    />
                )}

                {/* Silme modunu aç/kapat butonu */}
                {/* isRefreshing değilken görünür yapalım */}
                {!isRefreshing && (
                    <TouchableOpacity
                        onPress={toggleDeletingMode}
                        style={styles.deleteToggle}>
                        <MaterialIcons
                            name={deletingMode ? 'close' : 'bookmark-remove'}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
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
        // NewsList zaten padding alıyor, burada vermeyebiliriz veya NewsList'in paddingini kaldırıp burada verebiliriz
        // Şimdilik NewsList paddingini koruyalım, bu container sadece esnemesini sağlasın
        // padding: 16,
    } as ViewStyle,
    initialLoader: { // İlk yüklenme anı için stil
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    deleteToggle: {
        position: 'absolute',
        bottom: 24, // Altta konumlandırıldı
        right: 24,
        backgroundColor: '#007AFF',
        padding: 16, // Buton boyutunu artırdık
        borderRadius: 30, // Yuvarlak olması için yarıçap ayarlandı
        elevation: 6, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Diğer elemanların üstünde olması için
    } as ViewStyle,
});

export default BookmarkScreen;