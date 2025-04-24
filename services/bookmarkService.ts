import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsArticle } from '../types/news';

// AsyncStorage'de bookmarkları saklamak için kullanılacak anahtar
const BOOKMARKS_STORAGE_KEY = '@news_app_bookmarks';

// AsyncStorage'den bookmarkları asenkron olarak çeker
const getStoredBookmarks = async (): Promise<NewsArticle[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
        // Eğer veri yoksa veya null ise boş bir array döndür
        return jsonValue != null ? JSON.parse(jsonValue) as NewsArticle[] : [];
    } catch (e) {
        console.error('Error getting bookmarks from AsyncStorage:', e);
        // Hata durumunda da boş bir array döndürmek güvenlidir
        return [];
    }
};

// Bookmarkları AsyncStorage'e asenkron olarak kaydeder
const saveBookmarks = async (bookmarks: NewsArticle[]): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(bookmarks);
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, jsonValue);
    } catch (e) {
        console.error('Error saving bookmarks to AsyncStorage:', e);
    }
};

const BookmarkService = {
    // Yeni bir haberi bookmarklara ekler
    async addBookmark(article: NewsArticle): Promise<void> {
        const currentBookmarks = await getStoredBookmarks();
        // Haber zaten eklenmiş mi kontrol et
        if (!currentBookmarks.find(b => b.url === article.url)) {
            const updatedBookmarks = [...currentBookmarks, article];
            await saveBookmarks(updatedBookmarks);
            console.log('Bookmark Added:', article.title);
        } else {
            console.log('Bookmark already exists:', article.title);
        }
    },

    // Belirtilen URL'ye sahip haberi bookmarklardan kaldırır
    async removeBookmark(articleUrl: string): Promise<void> {
        const currentBookmarks = await getStoredBookmarks();
        const updatedBookmarks = currentBookmarks.filter(b => b.url !== articleUrl);
        // Eğer liste gerçekten değiştiyse kaydet
        if (updatedBookmarks.length < currentBookmarks.length) {
            await saveBookmarks(updatedBookmarks);
            console.log('Bookmark Removed:', articleUrl);
        } else {
            console.log('Bookmark not found to remove:', articleUrl);
        }
    },

    // Belirtilen URL'ye sahip haberin bookmarklarda olup olmadığını kontrol eder
    async isBookmarked(articleUrl: string): Promise<boolean> {
        const currentBookmarks = await getStoredBookmarks();
        return currentBookmarks.some(b => b.url === articleUrl);
    },

    // Tüm bookmarklanmış haberleri getirir
    async getBookmarks(): Promise<NewsArticle[]> {
        return await getStoredBookmarks();
    }

    // İsteğe bağlı: Tüm bookmarkları temizlemek için bir fonksiyon
    // async clearBookmarks(): Promise<void> {
    //     try {
    //         await AsyncStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    //         console.log('All bookmarks cleared.');
    //     } catch (e) {
    //         console.error('Error clearing bookmarks:', e);
    //     }
    // }
};

export default BookmarkService;
