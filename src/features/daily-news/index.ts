import { Context } from 'koishi';
import { fetchDailyNews } from '../../api/daily-news';
import { NewsResponse } from '../../api/daily-news/types';

// Commands
import { FETCH_DAILY_NEWS, UPDATE_DAILY_NEWS } from './commands';

// Constants
import { LOG_TIP } from './constants';

// Utils
import { formatNewsContent } from './utils';

async function getCachedNews(ctx: Context): Promise<NewsResponse['data'] | null> {
  const cachedNews = await ctx.database.get('news_cache', { id: 'latest' });
  if (cachedNews && cachedNews.length > 0) {
    return cachedNews[0].data;
  }
  return null;
}

async function updateCachedNews(ctx: Context, newsData: NewsResponse['data']): Promise<void> {
  await ctx.database.upsert('news_cache', [
    {
      id: 'latest',
      data: newsData,
      updatedAt: new Date(),
    }
  ]);
}

async function updateNewsCache(ctx: Context): Promise<NewsResponse['data']> {
  const newNews = await fetchDailyNews(ctx);
  const cachedNews = await getCachedNews(ctx);

  if (!cachedNews || JSON.stringify(newNews) !== JSON.stringify(cachedNews)) {
    await updateCachedNews(ctx, newNews);
    ctx.logger(LOG_TIP).success('News cache updated');
  } else {
    ctx.logger(LOG_TIP).info('News unchanged, cache not updated');
  }

  return newNews;
}

export function applyDailyNewsFeature(ctx: Context) {
  // 创建数据库表
  ctx.model.extend('news_cache', {
    id: 'string',
    data: 'json',
    updatedAt: 'date',
  }, {
    primary: 'id',
  });

  // 每天早上 8 点更新新闻缓存
  ctx.setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      await updateNewsCache(ctx);
    }
  }, 60000); // 每分钟检查一次

  ctx.command(FETCH_DAILY_NEWS)
    .action(async ({ session }) => {
      try {
        const cachedNews = await getCachedNews(ctx);

        // 如果有缓存，直接返回新闻
        if (cachedNews) {
          const formattedNews = formatNewsContent(cachedNews);
          await session.send(formattedNews);
          return;
        }

        // 如果没有缓存，发送即时反馈
        await session.send('正在获取最新新闻，请稍候...');

        let timeoutId = setTimeout(async () => {
          await session.send('获取新闻时间较长，请继续等待...')
        }, 15000);

        const newsData = await updateNewsCache(ctx);

        clearTimeout(timeoutId);  // 清除超时定时器

        const formattedNews = formatNewsContent(newsData);
        await session.send(formattedNews);
      } catch (error) {
        ctx.logger(LOG_TIP).error('Error fetching news:', error);
        await session.send('抱歉，获取新闻时出现错误。请稍后再试。');
      }
    });

  // 可选：添加一个强制更新缓存的命令
  ctx.command(UPDATE_DAILY_NEWS, { authority: 1 })
    .action(async ({ session }) => {
      try {
        await session.send('正在强制更新新闻缓存...');
        await updateNewsCache(ctx);
        await session.send('新闻缓存已更新。');
      } catch (error) {
        ctx.logger(LOG_TIP).error('Error updating news cache:', error);
        await session.send('抱歉，更新新闻缓存时出现错误。请稍后再试。');
      }
    });
}
