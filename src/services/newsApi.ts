import axios from 'axios';
import type { INews } from '../types/news';
import { mockNews, allCategories } from '../data/mockNews'; // Импортируем моки

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

const cache = new Map();

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }>;
}

// Используем категории из моковых данных, чтобы они совпадали
const categoryMapping: Record<string, string> = {
  'Все': '',
  'Наука': 'science',
  'Экономика': 'business', 
  'Политика': 'politics',
  'Технологии': 'technology',
  'Общество': 'general'
};

const getFallbackImage = (index: number) => {
  const images = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&h=300&fit=crop'
  ];
  return images[index % images.length];
};

export class NewsApiService {
  static async getTopHeadlines(
    page: number = 1,
    pageSize: number = 30,
    category: string = 'Все',
    country: string = 'us'
  ): Promise<INews[]> {
    // ЕСЛИ НЕТ КЛЮЧА API → ВОЗВРАЩАЕМ МОКОВЫЕ ДАННЫЕ
    if (!API_KEY) {
      console.log('API ключ отсутствует, используем моковые данные');
      
      if (category === 'Все') {
        // Возвращаем все моковые новости
        return mockNews;
      }
      
      // Фильтруем моковые новости по категории
      // Нормализуем категорию (на случай различий в регистре)
      const normalizedCategory = category.trim();
      const filtered = mockNews.filter(news => 
        news.category && news.category.trim() === normalizedCategory
      );
      
      console.log(`Моковые данные: категория "${category}", найдено ${filtered.length} новостей`);
      return filtered;
    }
    
    // ЕСТЬ КЛЮЧ API → ДЕЛАЕМ ЗАПРОС К NEWSAPI
    const cacheKey = `top-headlines-${category}-${page}-${pageSize}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const actualPageSize = Math.min(pageSize, 100);
    
    try {
      const newsCategory = categoryMapping[category] || '';
      let url = `${BASE_URL}/top-headlines?country=${country}&pageSize=${actualPageSize}&page=${page}&apiKey=${API_KEY}`;
      
      if (category !== 'Все' && newsCategory !== '') {
        url += `&category=${newsCategory}`;
      }

      console.log('Запрос к NewsAPI:', url.replace(API_KEY, '***'));

      const response = await axios.get<NewsApiResponse>(url);
      
      if (response.data.status !== 'ok') {
        throw new Error('Ошибка при получении новостей');
      }

      const mappedNews: INews[] = response.data.articles
        .filter(article => article.title && article.title !== '[Removed]')
        .map((article, index) => ({
          id: `news-${Date.now()}-${index}`,
          title: article.title,
          description: article.description || 'Нет описания',
          url: article.url,
          urlToImage: article.urlToImage || getFallbackImage(index),
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name || 'Неизвестный источник'
          },
          category: category === 'Все' ? 'Общество' : category
        }));

      cache.set(cacheKey, mappedNews);
      setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

      return mappedNews;
    } catch (error) {
      console.error('Ошибка при загрузке новостей из API, используем моковые данные:', error);
      // При ошибке API тоже возвращаем моковые данные
      if (category === 'Все') {
        return mockNews;
      }
      return mockNews.filter(news => news.category === category);
    }
  }

  static async searchNews(
    query: string,
    page: number = 1,
    pageSize: number = 10,
    country: string = 'us'
  ): Promise<INews[]> {
    // ЕСЛИ НЕТ КЛЮЧА API → МОКОВЫЕ ДАННЫЕ
    if (!API_KEY) {
      console.log('API ключ отсутствует, используем моковые данные для поиска');
      
      if (!query.trim()) {
        return mockNews;
      }
      
      const lowerQuery = query.toLowerCase();
      return mockNews.filter(news =>
        news.title.toLowerCase().includes(lowerQuery) ||
        news.description.toLowerCase().includes(lowerQuery) ||
        (news.source.name && news.source.name.toLowerCase().includes(lowerQuery))
      );
    }
    
    // ЕСТЬ КЛЮЧ API → ДЕЛАЕМ ЗАПРОС К NEWSAPI
    const cacheKey = `search-${query}-${page}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&page=${page}&language=${country}&apiKey=${API_KEY}`;
      
      console.log('Поиск в NewsAPI:', url.replace(API_KEY, '***'));

      const response = await axios.get<NewsApiResponse>(url);
      
      if (response.data.status !== 'ok') {
        throw new Error('Ошибка при поиске новостей');
      }

      const mappedNews: INews[] = response.data.articles
        .filter(article => article.title && article.title !== '[Removed]')
        .map((article, index) => ({
          id: `search-${Date.now()}-${index}`,
          title: article.title,
          description: article.description || 'Нет описания',
          url: article.url,
          urlToImage: article.urlToImage || getFallbackImage(index),
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name || 'Неизвестный источник'
          },
          category: 'Общество'
        }));

      cache.set(cacheKey, mappedNews);
      setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);

      return mappedNews;
    } catch (error) {
      console.error('Ошибка при поиске новостей, используем моковые данные:', error);
      // При ошибке API возвращаем моковые данные
      if (!query.trim()) {
        return mockNews;
      }
      
      const lowerQuery = query.toLowerCase();
      return mockNews.filter(news =>
        news.title.toLowerCase().includes(lowerQuery) ||
        news.description.toLowerCase().includes(lowerQuery)
      );
    }
  }

  // Метод для получения доступных категорий - используем из моковых данных
  static getCategories(): string[] {
    return allCategories;
  }
}