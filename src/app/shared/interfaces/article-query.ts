import { ArticleType } from '../../core/auth/models/article-type.enum';

export interface ArticleQuery {
  page?: number;
  limit?: number;
  type?: ArticleType;
}
