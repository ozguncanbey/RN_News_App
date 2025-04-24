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
    refetch: (params?: UseFetchNewsParams) => Promise<void>;
}

export const useFetchNews = (params: UseFetchNewsParams = {}): UseFetchNewsResult => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchNewsArticles(params);
                setArticles(data.articles);
            } catch (err: any) {
                setError(err.message || "Haberler yüklenirken bir hata oluştu.");
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();

        return () => {
        };

    }, [params.query, params.sortType, params.country, params.page, params.pageSize]);

    return {
        articles, isLoading, error, refetch: async (newParams) => { // refetch fonksiyonu burada tanımlandı
            const paramsToUse = newParams ? newParams : params;
            const paramsToSend = {
                ...paramsToUse,
                country: paramsToUse.query?.trim() === '' ? paramsToUse.country : undefined,
                sortType: paramsToUse.query?.trim() !== '' ? paramsToUse.sortType : undefined,
            };
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchNewsArticles(paramsToSend);
                setArticles(data.articles);
            } catch (err: any) {
                setError(err.message || "Haberler yüklenirken bir hata oluştu.");
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        }
    };
};
