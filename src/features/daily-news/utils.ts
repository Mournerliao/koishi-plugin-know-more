import { NewsResponse } from '../../api/daily-news/types';
import { addSpaceBetweenChineseAndOther } from '../../utils';

function formatNewsContent(newsData: NewsResponse['data']): string {
  const formattedNews = newsData.news.map((item, index) => {
    return `${index + 1}. ${addSpaceBetweenChineseAndOther(item)}。`;
  }).join('\n\n');

  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedDate = addSpaceBetweenChineseAndOther(currentDate);

  return `📅 ${formattedDate}\n\n${formattedNews}\n\n🔗 详情链接：${newsData.url}`;
}

export { formatNewsContent };
