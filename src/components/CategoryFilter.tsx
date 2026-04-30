import React from 'react';
import { useNews } from '../context/NewsContext';

const CategoryFilter: React.FC = () => {
  const { state, dispatch } = useNews();

  return (
    <div className="category-filter">
      <label className="filter-label">Фильтр по категориям:</label>
      <div className="categories-container">
        {state.categories.map((category) => (
          <button
            key={category}
            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
            className={`category-button ${
              state.selectedCategory === category ? 'active' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="category-stats">
        <span className="stats-icon">📊</span>
        <span className="stats-text">
          {state.selectedCategory === 'Все'
            ? `Все новости: ${state.filteredNews.length}`
            : `${state.selectedCategory}: ${state.filteredNews.length}`}
        </span>
      </div>
    </div>
  );
};

export default CategoryFilter;