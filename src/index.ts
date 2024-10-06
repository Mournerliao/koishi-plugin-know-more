import { on } from 'events'
import { Context, extend, Schema } from 'koishi'
import { join } from 'path'
import { send } from 'process'
import { info } from 'console'
import { stringify } from 'querystring'

// features
import { applyDailyNewsFeature } from './features/daily-news';

export const name = 'know-more'

// 对于整体依赖的服务，使用 inject 属性声明依赖关系
export const inject = {
  required: ['database'],
}

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // 获取每日新闻
  applyDailyNewsFeature(ctx);
}
