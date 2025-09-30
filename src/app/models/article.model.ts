import { User } from './user.model';

export interface Author {
  id: number;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  slug?: string; // SEO 友好的 URL，如 "my-first-blog"
  coverImage?: string; //封面图URL
  viewCount?: number; //阅读次数
  tags?: string[]; //标签
  isPublished: boolean; //是否发布, 默认不发布
  isDeleted: boolean; // 逻辑删除
  createdAt: Date;
  updatedAt: Date;
  // author?: User; // 这个数据如何在前端的接口定义呢？
  // authorId?: number;
  author?: Author;
}

export interface ArticleResponse {
  data: Article[];
  limit: number;
  page: number;
  total: number;
}
