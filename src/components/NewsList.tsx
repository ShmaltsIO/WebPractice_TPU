import React from 'react';
import { useNews } from '../context/NewsContext';
import NewsCard from './NewsCard';
import LoadMoreButton from './LoadMoreButton';
import LoadingSpinner from './LoadingSpinner';

const NewsList: React.FC = () => {
  const { state } = useNews();

  if (state.isLoading && state.filteredNews.length === 0) {
    return <LoadingSpinner />;
  }

  if (state.filteredNews.length === 0 && !state.isLoading) {
    return (
      <div className="no-news">
        <div className="no-news-icon">📰</div>
        <h3 className="no-news-title">Новости не найдены</h3>
        <p className="no-news-text">
          {state.searchQuery 
            ? `По запросу "${state.searchQuery}" ничего не найдено`
            : 'Попробуйте выбрать другую категорию'}
        </p>
      </div>
    );
  }

  const totalNews = state.news.length;
  const shownNews = state.filteredNews.length;

  return (
    <div>
      <div className="news-header">
        <h2 className="news-title">
          {state.selectedCategory === 'Все' ? 'Все новости' : state.selectedCategory}
        </h2>
        <p className="news-count">
          Показано {shownNews} из {totalNews} новостей
        </p>
      </div>

      <div className="news-grid">
        {state.filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      {state.hasMore && <LoadMoreButton />}
    </div>
  );
};

export default NewsList;