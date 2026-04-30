import React from 'react';
import type { INews } from '../types/news';

interface NewsCardProps {
  news: INews;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="news-card">
      <div className="news-card-image">
        <img
          src={news.urlToImage}
          alt={news.title}
          className="news-image"
        />
      </div>
      <div className="news-card-content">
        <div className="news-card-header">
          <span className="news-category">{news.category}</span>
          <span className="news-date">{formatDate(news.publishedAt)}</span>
        </div>
        <h3 className="news-title-card">{news.title}</h3>
        <p className="news-description">{news.description}</p>
        <div className="news-card-footer">
          <span className="news-source">{news.source.name}</span>
          <a href={news.url} className="read-more">Читать далее →</a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;