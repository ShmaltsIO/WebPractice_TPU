// import type { INews } from '../types/news';
// import { normalizeCategory } from '../data/mockNews';

// // Функция для нормализации данных от NewsAPI
// export const normalizeNewsApiData = (apiData: any[]): INews[] => {
//   return apiData.map((item, index) => ({
//     id: `news-${index + 1}`,
//     title: item.title || 'Без названия',
//     description: item.description || 'Описание отсутствует',
//     url: item.url || '#',
//     urlToImage: item.urlToImage || `https://picsum.photos/400/300?random=${index}`,
//     publishedAt: item.publishedAt || new Date().toISOString(),
//     source: {
//       name: item.source?.name || 'Неизвестный источник'
//     },
//     category: normalizeCategory(item.category || 'general') // Нормализуем категорию
//   }));
// };

// // Функция для преобразования категорий из NewsAPI в наши
// export const normalizeCategories = (apiCategories: string[]): string[] => {
//   const normalized = apiCategories.map(cat => normalizeCategory(cat));
//   // Убираем дубликаты и добавляем "Все"
//   return ['Все', ...Array.from(new Set(normalized))];
// };