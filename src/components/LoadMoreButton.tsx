import React from 'react';
import { useNews } from '../context/NewsContext';

const LoadMoreButton: React.FC = () => {
  const { state, dispatch } = useNews();

  const handleLoadMore = () => {
    dispatch({ type: 'LOAD_MORE' });
  };

  const totalNews = state.news.length;
  const shownNews = state.filteredNews.length;
  
  return (
    <div className="load-more-container">
      <div className="load-more-divider">
        <div className="divider-line"></div>
        <button
          onClick={handleLoadMore}
          disabled={state.isLoading || !state.hasMore}
          className="load-more-button"
        >
          <span className="button-text">
            {state.isLoading ? 'Загрузка...' : 'Загрузить еще'}
          </span>
          <span className="button-count">
            (Показано: {shownNews} из {totalNews})
          </span>
        </button>
      </div>
      {state.hasMore ? (
        <p className="load-more-hint">
          Нажмите, чтобы загрузить больше новостей
        </p>
      ) : (
        <p className="load-more-hint">
          Все новости загружены
        </p>
      )}
    </div>
  );
};

export default LoadMoreButton;