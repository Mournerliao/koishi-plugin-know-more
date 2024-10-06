import { Context, Logger } from 'koishi';
import { NewsResponse, validateNewsResponse } from './types';
import { NewsCacheTable } from '../../types/koishi';

const DAILY_NEWS_API = 'https://60s.viki.moe/60s?v2=1';

function handleError(error: unknown, logger: Logger) {
  if (error instanceof Error) {
    logger.error('Error:', error.message);
  } else {
    logger.error('Unexpected error:', error);
  }
}

export async function fetchDailyNews(ctx: Context): Promise<NewsResponse['data']> {
  const logger = new Logger('fetchDailyNews');

  try {
    logger.info('Fetching daily news...');
    const response = await ctx.http.get(DAILY_NEWS_API, { timeout: 5000 });

    logger.debug('Raw response:', response);

    // 验证响应数据
    if (!validateNewsResponse(response)) {
      throw new Error('Invalid response format');
    }

    logger.success('Successfully fetched and validated daily news.');
    return response.data;
  } catch (error) {
    handleError(error, logger);
    throw new Error('Failed to fetch daily news');
  }
}

export async function getCachedNews(ctx: Context): Promise<NewsResponse['data'] | null> {
  const cachedNews = await ctx.database.get('news_cache', { id: 'latest' }) as NewsCacheTable[];
  if (cachedNews && cachedNews.length > 0) {
    return cachedNews[0].data;
  }
  return null;
}

export async function updateCachedNews(ctx: Context, newsData: NewsResponse['data']): Promise<void> {
  await ctx.database.upsert('news_cache', [
    {
      id: 'latest',
      data: newsData,
      updatedAt: new Date(),
    } as NewsCacheTable
  ]);
}
