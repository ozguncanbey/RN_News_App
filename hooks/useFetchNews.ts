import { useState, useEffect } from 'react';
import { fetchNewsArticles } from '../services/newsApi';
import { NewsArticle } from '../types/news';

interface UseFetchNewsParams {
    query?: string;
    sortType?: 'popularity' | 'publishedAt';
    country?: string;
    page?: number;
    pageSize?: number;
}

interface UseFetchNewsResult {
    articles: NewsArticle[];
    isLoading: boolean;
    error: string | null;
    // İhtiyaç olursa veri çekmeyi yeniden tetikleyecek bir fonksiyon da eklenebilir
    // refetch: () => void;
}

export const useFetchNews = (params: UseFetchNewsParams = {}): UseFetchNewsResult => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            setIsLoading(true);
            setError(null); // Yeni yüklemede eski hatayı temizle

            try {
                const data = await fetchNewsArticles(params);
                setArticles(data.articles);
            } catch (err: any) {
                setError(err.message || "Haberler yüklenirken bir hata oluştu.");
                setArticles([]); // Hata durumunda listeyi temizle
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();

        // useEffect temizleme fonksiyonu: Eğer component unmount edilirse devam eden fetch işlemini iptal etmek için kullanılabilir,
        // ancak fetch API'nin kendisi doğrudan iptali biraz zahmetli yapar.
        // Daha gelişmiş fetch kütüphaneleri (axios gibi) veya AbortController kullanılabilir.
        // Şimdilik basit tutalım.
        return () => {
            // Cleanup logic here if needed
        };

    }, [params.query, params.sortType, params.country, params.page, params.pageSize]); // Parametreler değiştiğinde useEffect tekrar çalışsın

    return { articles, isLoading, error };
};