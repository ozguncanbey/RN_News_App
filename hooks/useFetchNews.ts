import { useState, useEffect, useCallback } from 'react'; // useCallback import edildi
import { fetchNewsArticles } from '../services/newsApi';
import { NewsArticle } from '../types/news';

// Hook'a dışarıdan verilebilecek başlangıç parametreleri
interface UseFetchNewsInitialParams { // İsim initialParams olarak güncellendi
    query?: string;
    sortType?: 'popularity' | 'publishedAt';
    country?: string;
    initialPageSize?: number; // Başlangıç sayfa boyutu eklendi
}

// Hook'un döndürdüğü değerlerin tipi
interface UseFetchNewsResult { // Tip güncellendi
    articles: NewsArticle[];
    isLoading: boolean; // İlk yüklenme durumu
    isLoadingMore: boolean; // Daha fazla yüklenme durumu eklendi
    error: string | null;
    refetch: (params?: UseFetchNewsInitialParams) => Promise<void>; // Yeniden çekme (sayfa 1'e döner)
    loadMore: () => Promise<void>; // Sonraki sayfayı yükle eklendi
    totalResults: number; // API'den gelen toplam sonuç sayısı eklendi
    hasMore: boolean; // Yüklenecek daha fazla sayfa olup olmadığı eklendi
}

export const useFetchNews = (initialParams: UseFetchNewsInitialParams = {}): UseFetchNewsResult => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false); // isLoadingMore state'i eklendi
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1); // Sayfa state'i eklendi ve 1'den başlatıldı
    const [totalResults, setTotalResults] = useState(0); // Toplam sonuç state'i eklendi
    const pageSize = initialParams.initialPageSize || 10; // Sayfa boyutu initialParams'tan alındı veya varsayılan 20

    // Mevcut filtre ve arama parametrelerini tutan state
    const [currentParams, setCurrentParams] = useState<UseFetchNewsInitialParams>(initialParams); // currentParams state'i eklendi

    // API'den veri çekme işlemini gerçekleştiren iç fonksiyon
    // Bu fonksiyon tam olarak hangi sayfa ve boyutta veri çekeceğini parametre olarak alır
    const loadNews = useCallback(async (paramsToFetch: { query?: string, sortType?: 'popularity' | 'publishedAt', country?: string, page: number, pageSize: number }, isLoadMore = false) => { // Parametre tipi ve isLoadMore eklendi
        if (isLoadMore) { // isLoadMore durumuna göre yüklenme state'i ayarlandı
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            setError(null);
        }

        try {
            const data = await fetchNewsArticles(paramsToFetch); // paramsToFetch kullanıldı

            setTotalResults(data.totalResults || 0); // Toplam sonuç sayısı kaydedildi

            if (isLoadMore) { // isLoadMore durumuna göre makaleler eklendi veya set edildi
                // Yeni makaleleri mevcutlara ekle
                setArticles(prevArticles => {
                    // Aynı makalelerin tekrar eklenmesini önlemek için basit bir kontrol
                    const newArticles = data.articles.filter(
                        newArt => !prevArticles.some(existingArt => existingArt.url === newArt.url)
                    );
                    return [...prevArticles, ...newArticles];
                });
            } else {
                // İlk yüklemede makaleleri set et
                setArticles(data.articles);
            }

        } catch (err: any) {
            console.error("Haber çekerken hata oluştu:", err);
            setError(err.message || "Haberler yüklenirken bir hata oluştu.");
            if (!isLoadMore) { // İlk yüklemede hata olursa listeyi temizle
                setArticles([]);
                setTotalResults(0);
            }
        } finally { // Finally bloğu tamamlandı
            if (isLoadMore) {
                setIsLoadingMore(false);
            } else {
                setIsLoading(false);
            }
        }
    }, []); // Bu fonksiyonun bağımlılığı yok, dış state'e doğrudan bağlı değil

    // initialParams veya sayfa değiştiğinde veri çekmeyi tetikleyen effect
    // Bu effect SADECE initialParams (filtre/arama değiştiğinde) veya page state'i değiştiğinde çalışır
    useEffect(() => { // useEffect bağımlılıkları güncellendi
        // fetchNewsArticles'a gönderilecek tam parametre setini oluştur
        const paramsToSend = {
            ...currentParams, // Mevcut filtre/arama parametreleri
            page: page, // Mevcut sayfa state'i
            pageSize: pageSize, // Sabit sayfa boyutu
            // NewsAPI endpoint'ine göre country ve sortType ayarı fetchNewsArticles içinde yapılıyor
        };
        console.log(`Fetching data - Page: ${page}, Query: ${paramsToSend.query}, Country: ${paramsToSend.country}, Sort: ${paramsToSend.sortType}`);

        loadNews(paramsToSend, page > 1); // Eğer sayfa 1'den büyükse isLoadMore true gönder

    }, [currentParams, page, pageSize, loadNews]); // Bağımlılıklar: filtre/arama, sayfa, sayfa boyutu, loadNews fonksiyonu

    // Veri çekme işlemini dışarıdan manuel olarak tetiklemek için fonksiyon (Sayfa 1'e döner)
    const refetch = useCallback(async (params?: UseFetchNewsInitialParams) => { // refetch fonksiyonu eklendi
        const paramsToUse = params ? params : initialParams;

        // Yeni parametreler geldiyse currentParams state'ini güncelle
        setCurrentParams(paramsToUse);
        // Sayfa state'ini 1'e sıfırla. Bu useEffect'i tetikleyerek yeni veriyi çekecek.
        setPage(1);

    }, [initialParams]); // initialParams değiştiğinde refetch yeniden oluşturulmalı

    // Daha fazla haber yüklemek için fonksiyon
    const loadMore = useCallback(async () => { // loadMore fonksiyonu eklendi
        // Yükleme devam ediyorsa veya yüklenecek daha fazla haber yoksa işlemi durdur
        const loadedArticleCount = articles.length;
        const totalAvailable = Math.min(totalResults, 100); // NewsAPI ücretsiz limitini uygula

        if (isLoading || isLoadingMore || loadedArticleCount >= totalAvailable) {
            console.log("Load more stopped:", { isLoading, isLoadingMore, loadedArticleCount, totalAvailable });
            return;
        }

        const nextPage = page + 1;
        console.log("Loading more - Page:", nextPage);

        // Sayfa state'ini artır. Bu, useEffect'i tetikleyerek yeni sayfayı çekecek.
        setPage(nextPage);

    }, [articles.length, totalResults, page, isLoading, isLoadingMore]); // Bağımlılıklar güncellendi

    // Yüklenecek daha fazla haber olup olmadığını belirle
    // Toplam yüklenen makale sayısı, toplam sonuç sayısından (veya 100 limitinden) az ise daha fazla var demektir.
    const hasMore = articles.length < Math.min(totalResults, 100); // hasMore hesaplaması eklendi

    return { // Dönüş değeri güncellendi
        articles,
        isLoading,
        isLoadingMore,
        error,
        refetch,
        loadMore,
        totalResults,
        hasMore,
    };
};
