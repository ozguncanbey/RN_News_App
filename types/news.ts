// types/news.ts

// Haber makalesi veri yapısını tanımlar
export interface NewsArticle {
    id?: string | null; // Kaynak ID'si (bazı API'lerde null olabilir)
    title: string;
    description: string | null;
    content: string | null;
    author: string | null;
    url: string;
    urlToImage: string | null; 
    publishedAt: string; // Yayınlanma tarihi (ISO 8601 formatında string olarak gelmesi yaygındır)
    source: {
        id: string | null;
        name: string;
    };
}

export interface NewsApiResponse {
    status: string; // "ok" veya "error"
    totalResults: number;
    articles: NewsArticle[]; // Haber makaleleri listesi
}