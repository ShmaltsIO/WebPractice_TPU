import { NewsProvider } from './context/NewsContext';
import NewsList from './components/NewsList';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';

function App() {
  return (
    <NewsProvider>
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">📰</div>
              <h1 className="logo-text">Новостная лента</h1>
            </div>
            
            <div className="header-info">
              <p>
                📰 Приветствуем! Здесь вы найдете самые свежие новости из разных категорий.
                Используйте поиск и фильтры для навигации.
              </p>
            </div>
            
            <div className="controls-grid">
              <div className="search-section">
                <SearchBar />
              </div>
              <div className="filter-section">
                <CategoryFilter />
              </div>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <NewsList />
        </main>
        
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <div>📰</div>
              <span className="footer-logo-text">News SPA</span>
            </div>
            <p className="footer-text">
              © 2024 Одностраничное приложение для просмотра новостей
            </p>
            <p className="footer-subtext">
              Разработано с использованием React и TypeScript
            </p>
          </div>
        </footer>
      </div>
    </NewsProvider>
  );
}

export default App;