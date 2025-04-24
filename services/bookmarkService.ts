import { NewsArticle } from '../types/news';

// Bu sadece bir placeholder servistir.
// Gerçek bir uygulamada AsyncStorage veya başka bir depolama çözümü kullanılmalıdır.
const Bookmarks: NewsArticle[] = []; // Geçici olarak haberleri bir array'de saklayalım

const BookmarkService = {
    async addBookmark(article: NewsArticle): Promise<void> {
        if (!Bookmarks.find(b => b.url === article.url)) {
            Bookmarks.push(article);
            console.log('Bookmark Added:', article.title);
        }
    },

    async removeBookmark(articleUrl: string): Promise<void> {
        const initialLength = Bookmarks.length;
        const updatedBookmarks = Bookmarks.filter(b => b.url !== articleUrl);
        Bookmarks.length = 0; // Array'i temizle
        Bookmarks.push(...updatedBookmarks); // Güncellenmiş listeyi ekle
        if (Bookmarks.length < initialLength) {
            console.log('Bookmark Removed:', articleUrl);
        } else {
            console.log('Bookmark not found to remove:', articleUrl);
        }
    },

    async isBookmarked(articleUrl: string): Promise<boolean> {
        return Bookmarks.some(b => b.url === articleUrl);
    },

    // Eğer gerekirse tüm bookmarkları getirecek bir fonksiyon da eklenebilir
    async getBookmarks(): Promise<NewsArticle[]> {
        return [...Bookmarks]; // Array'in bir kopyasını döndür
    }
};

export default BookmarkService;