import { ArticleType } from './article-type.enum';

type SelectOption<T> = {
  value: T;
  label: string;
};

export const ARTICLE_TYPE_OPTIONS: SelectOption<ArticleType>[] = [
  {
    value: ArticleType.TECH,
    label: '技术文章',
  },
  {
    value: ArticleType.NON_TECH,
    label: '非技术文章',
  },
] as const;
