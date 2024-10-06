declare module 'koishi' {
  interface Tables {
    news_cache: NewsCacheTable
  }
}

export interface NewsCacheTable {
  id: string
  data: any
  updatedAt: Date
}
