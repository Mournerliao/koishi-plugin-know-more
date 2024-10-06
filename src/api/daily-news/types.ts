export interface NewsResponse {
  status: number;
  message: string;
  data: {
    news: string[];
    tip: string;
    updated: number;
    url: string;
    cover: string;
  };
}

export function validateNewsResponse(data: any): data is NewsResponse {
  return (
    typeof data === 'object' &&
    typeof data.status === 'number' &&
    typeof data.message === 'string' &&
    typeof data.data === 'object' &&
    Array.isArray(data.data.news) &&
    data.data.news.every((item: any) => typeof item === 'string') &&
    typeof data.data.tip === 'string' &&
    typeof data.data.updated === 'number' &&
    typeof data.data.url === 'string' &&
    typeof data.data.cover === 'string'
  );
}

