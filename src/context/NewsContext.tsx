import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import type { NewsState, INews } from '../types/news';
import { NewsApiService } from '../services/newsApi';

type NewsAction =
  | { type: 'SET_NEWS'; payload: INews[] }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_MORE' }
  | { type: 'FILTER_NEWS' };

// Используем категории из сервиса
const categories = NewsApiService.getCategories();

const initialState: NewsState = {
  news: [],
  filteredNews: [],
  categories: categories,
  selectedCategory: 'Все',
  searchQuery: '',
  isLoading: true, // Начинаем с загрузки
  currentPage: 1,
  itemsPerPage: 8,
  hasMore: false,
};

const newsReducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case 'SET_NEWS':
      return { ...state, news: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload, currentPage: 1 };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    
    case 'LOAD_MORE':
      return { ...state, currentPage: state.currentPage + 1 };
    
    case 'FILTER_NEWS':
      let filtered = state.news;
      
      if (state.selectedCategory !== 'Все') {
        filtered = filtered.filter(item => item.category === state.selectedCategory);
      }
      
      if (state.searchQuery) {
        const lowerQuery = state.searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
        );
      }
      
      const displayedItems = state.currentPage * state.itemsPerPage;
      const paginated = filtered.slice(0, displayedItems);
      const hasMoreItems = displayedItems < filtered.length;
      
      return { ...state, filteredNews: paginated, hasMore: hasMoreItems };
    
    default:
      return state;
  }
};

const NewsContext = createContext<{
  state: NewsState;
  dispatch: React.Dispatch<NewsAction>;
}>({ state: initialState, dispatch: () => null });

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  // Загрузка новостей при монтировании
  useEffect(() => {
    const loadNews = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const news = await NewsApiService.getTopHeadlines(1, 50, 'Все');
        console.log('Загружено новостей:', news.length);
        dispatch({ type: 'SET_NEWS', payload: news });
        dispatch({ type: 'FILTER_NEWS' });
      } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadNews();
  }, []);

  // Фильтрация при изменении категории, поиска или страницы
  useEffect(() => {
    dispatch({ type: 'FILTER_NEWS' });
  }, [state.selectedCategory, state.searchQuery, state.currentPage]);

  return (
    <NewsContext.Provider value={{ state, dispatch }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);