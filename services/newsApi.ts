// services/newsApi.ts

import { NewsArticle, NewsApiResponse } from '../types/news';
import { NEWS_API_KEY, NEWS_API_BASE_URL } from '../constants/api';

interface FetchNewsParams {
    query?: string; // Arama kelimesi (boşsa top headlines gelir)
    sortType?: 'popularity' | 'publishedAt'; 
    country?: string; 
    page?: number; 
    pageSize?: number; 
}

export const fetchNewsArticles = async (
    params: FetchNewsParams = {} // Varsayılan boş obje
): Promise<{ articles: NewsArticle[]; totalResults: number }> => {
    try {
        const { query = '', sortType = 'publishedAt', country = 'us', page = 1, pageSize = 20 } = params;

        const urlParams = new URLSearchParams();
        urlParams.append('apiKey', NEWS_API_KEY);
        urlParams.append('page', page.toString());
        urlParams.append('pageSize', pageSize.toString());

        let endpoint;

        if (query.trim() === '') {
            // Top Headlines endpoint'i
            endpoint = `${NEWS_API_BASE_URL}/top-headlines`;
            urlParams.append('country', country);
            // NewsAPI top-headlines'ta 'q' parametresiyle sortType kullanılmaz.
            if (params.query) urlParams.append('q', encodeURIComponent(params.query)); // Yine de opsiyonel q'yu ekleyelim
        } else {
            // Everything endpoint'i
            endpoint = `${NEWS_API_BASE_URL}/everything`;
            urlParams.append('q', encodeURIComponent(query));
            urlParams.append('sortBy', sortType);
            // NewsAPI everything'te 'country' parametresi kullanılmaz.
            // language varsayılan olarak 'en' ayarlıydı, onu da ekleyelim eğer gerekirse params'a eklenebilir.
            urlParams.append('language', 'en');
        }

        const url = `${endpoint}?${urlParams.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            // HTTP hata durumlarını yakala
            const errorBody = await response.text();
            console.error(`API HTTP Error: ${response.status}`, errorBody);
            throw new Error(`API isteği başarısız oldu: ${response.status}`);
        }

        const data: NewsApiResponse = await response.json();

        if (data.status !== 'ok') {
            console.error('API Status Error');
            throw new Error('Haberler alınamadı');
        }

        const articles: NewsArticle[] = data.articles;

        return {
            articles: articles,
            totalResults: data.totalResults,
        };

    } catch (error: any) { 
        console.error('fetchNewsArticles try-catch error:', error.message);

        throw new Error(`Haberler getirilirken bir hata oluştu: ${error.message}`);
    }
};