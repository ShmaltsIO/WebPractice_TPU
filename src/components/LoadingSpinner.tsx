import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle-spinning"></div>
      </div>
      <p className="loading-text">Загрузка новостей...</p>
      <p className="loading-subtext">Пожалуйста, подождите</p>
    </div>
  );
};

export default LoadingSpinner;