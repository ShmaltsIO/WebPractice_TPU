class NewsPortal {
    constructor() {
        this.newsData = [];
        this.init();
    }

    async init() {
        await this.loadNewsData();
        this.renderNewsCards();
        this.renderTopNews();
        this.attachEventListeners();
    }

    async loadNewsData() {
        if (window.location.protocol === 'file:') {
            console.log('Локальный запуск, использую встроенные данные');
            this.newsData = this.getFallbackData();
            return;
        }
    
        try {
            const response = await fetch('../Static/content.txt');
            if (!response.ok) throw new Error('Файл не найден');
            const text = await response.text();
            this.newsData = text.trim().split('\n').map(line => {
                const [title, date, category, summary] = line.split(';');
                return { title: title.trim(), date: date.trim(), category: category.trim(), summary: summary.trim() };
            });
        } catch (error) {
            this.newsData = this.getFallbackData();
        }
    }

    getFallbackData() {
        return [
            {
                title: "Китай запустил новый спутник для наблюдения за Землей",
                date: "2024-01-15",
                category: "Наука",
                summary: "Китай успешно вывел на орбиту новый спутник дистанционного зондирования Земли. Аппарат будет использоваться для мониторинга окружающей среды, прогнозирования погоды и помощи в ликвидации последствий стихийных бедствий."
            },
            {
                title: "Футболист сборной России переходит в европейский клуб",
                date: "2024-01-14",
                category: "Спорт",
                summary: "Известный нападающий подписал контракт с итальянским клубом. Переход состоялся за рекордную для российского футбола сумму. Игрок будет выступать в Серии А с следующего сезона."
            },
            {
                title: "Новые меры поддержки малого бизнеса",
                date: "2024-01-13",
                category: "Экономика",
                summary: "Правительство announced новые льготные программы кредитования для малого и среднего бизнеса. Особое внимание уделяется предприятиям в сфере IT и зеленых технологий."
            },
            {
                title: "Ученые открыли новый вид морских организмов",
                date: "2024-01-12",
                category: "Наука",
                summary: "В глубинах Тихого океана обнаружены неизвестные ранее существа, обладающие уникальными биолюминесцентными свойствами. Открытие может привести к breakthroughs в медицине и биотехнологиях."
            },
            {
                title: "Изменения в правилах дорожного движения",
                date: "2024-01-11",
                category: "Общество",
                summary: "С 1 февраля вступают в силу новые поправки в ПДР, касающиеся использования электросамокатов и других средств индивидуальной мобильности."
            },
            {
                title: "Кинопремия 'Оскар' объявила номинантов",
                date: "2024-01-10",
                category: "Культура",
                summary: "Опубликован список фильмов, претендующих на золотую статуэтку. В этом году в основной конкурсной программе представлено рекордное количество картин от стриминговых платформ."
            }
        ];
    }

    renderNewsCards() {
        const newsGrid = document.getElementById('news-grid');
        const newsToDisplay = this.newsData.slice(0, 5);

        if (newsToDisplay.length === 0) {
            newsGrid.innerHTML = '<p>Новости не найдены</p>';
            return;
        }

        newsGrid.innerHTML = newsToDisplay.map((news, index) => `
            <article class="news-card" data-index="${index}">
                <h2 class="news-title">${news.title}</h2>
                <div class="news-meta">
                    <span class="news-date">${this.formatDate(news.date)}</span>
                    <span class="news-category">${news.category}</span>
                </div>
                <div class="news-summary" id="summary-${index}">
                    <p>${news.summary}</p>
                </div>
                <button class="read-more-btn" data-index="${index}">Читать далее</button>
            </article>
        `).join('');
    }

    renderTopNews() {
        const topNewsList = document.getElementById('top-news-list');
        const topNews = [...this.newsData]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        topNewsList.innerHTML = topNews.map(news => `
            <li>
                <a href="#" onclick="return false;">${news.title}</a>
            </li>
        `).join('');
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-more-btn')) {
                this.toggleNewsSummary(e.target.dataset.index);
            }
        });
    }

    toggleNewsSummary(index) {
        const summary = document.getElementById(`summary-${index}`);
        const button = document.querySelector(`.read-more-btn[data-index="${index}"]`);
        
        if (summary.classList.contains('expanded')) {
            summary.classList.remove('expanded');
            button.textContent = 'Читать далее';
        } else {
            document.querySelectorAll('.news-summary.expanded').forEach(item => {
                item.classList.remove('expanded');
            });
            document.querySelectorAll('.read-more-btn').forEach(btn => {
                btn.textContent = 'Читать далее';
            });
            summary.classList.add('expanded');
            button.textContent = 'Свернуть';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new NewsPortal();
});