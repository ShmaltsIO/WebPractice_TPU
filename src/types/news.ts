export interface INews {
    id: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      name: string;
    };
    category: string;
  }
  
  export interface NewsState {
    news: INews[];
    filteredNews: INews[];
    categories: string[];
    selectedCategory: string;
    searchQuery: string;
    isLoading: boolean;
    currentPage: number;
    itemsPerPage: number;
    hasMore: boolean;
  }