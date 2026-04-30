import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';

const SearchBar: React.FC = () => {
  const { dispatch } = useNews();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: inputValue });
  }, [inputValue, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Поиск новостей..."
          className="search-input"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="clear-button"
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      {inputValue && (
        <p className="search-query">
          Поиск по запросу: <span className="query-text">"{inputValue}"</span>
        </p>
      )}
    </div>
  );
};

export default SearchBar;