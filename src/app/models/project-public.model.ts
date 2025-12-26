export interface Author {
  id: number;
  email: string;
}

export interface ProjectPublic {
  id: number;
  title: string;
  description?: string; // 项目描述
  content?: string; // 项目详细内容
  htmlContent?: string; // HTML 内容
  slug?: string; // SEO 友好的 URL
  coverImage?: string; // 项目封面图URL
  image?: string; // 兼容项目列表组件中使用的 image 字段
  viewCount?: number; // 浏览次数
  tags?: string[]; // 标签
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold'; // 项目状态
  startDate?: Date; // 开始日期
  endDate?: Date; // 结束日期
  technologies?: string[]; // 使用的技术栈
  githubUrl?: string; // GitHub 链接
  liveUrl?: string; // 在线演示链接
  authorAvatar?: string; // 作者头像，兼容项目列表组件
  author?: Author; // 作者信息
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPublicResponse {
  data: ProjectPublic[];
  limit: number;
  page: number;
  total: number;
}
