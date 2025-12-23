# 前端项目路由关系文档

> 适用于记录 **Personal Web Frontend** 项目的路由设计，用于开发协作、维护与交接。

---

## 1. 文档说明

- **项目名称**：Personal Web Frontend
- **框架**：Angular (Standalone Components)
- **路由模式**：History API
- **是否启用懒加载**：是
- **权限控制**：基于 Guard (AuthGuard)

---

## 2. 路由总体结构

```text
/
├── (home)
├── blog
│   └── :id
├── about
├── projects
│   └── article/:id
├── contact
├── login
└── admin
    ├── dashboard
    ├── articles
    │   ├── new
    │   ├── edit/:id
    │   ├── view/:id
    │   └── detail/:id
    ├── todos
    ├── users
    ├── roles
    └── permissions
```

---

## 3. 路由表（Route Table）

| 路径 Path | 组件 Component | 模块/文件 Import | 是否懒加载 | 权限要求 | 说明 |
|---------|---------------|-----------------|------------|----------|------|
| `/` | MainLayoutComponent | features/main-layout | 否 | 无 | 主布局 |
| `/` (Child) | HomeComponent | features/home | 否 | 无 | 首页 |
| `/blog` | BlogComponent | features/blog | 是 | 无 | 博客列表 |
| `/blog/:id` | ArticlePreviewComponent | features/articles/article-preview | 是 | 无 | 文章预览 |
| `/about` | ResumeComponent | features/resume | 是 | 无 | 关于/简历 |
| `/projects` | ProjectsComponent | features/projects | 是 | 无 | 项目列表 |
| `/projects/article/:id` | ArticleDetailEnhancedComponent | features/articles/article-detail-enhanced | 是 | 无 | 项目文章详情 |
| `/contact` | ContactComponent | features/contact | 是 | 无 | 联系页 |
| `/login` | LoginComponent | features/login | 是 | 无 | 登录页 |
| `/admin` | AdminComponent | pages/admin | 否 | authGuard | 后台管理布局 |
| `/admin/articles` | ArticlesComponent | components/articles | 否 | authGuard | 文章管理列表 |
| `/admin/articles/new` | ArticleCreatePageComponent | components/article-create-page | 是 | authGuard | 新建文章 |
| `/admin/articles/edit/:id` | ArticleEditPageComponent | components/article-edit-page | 是 | authGuard | 编辑文章 |
| `/admin/articles/view/:id` | ArticleViewPageComponent | components/article-view-page | 是 | authGuard | 查看文章 |
| `/admin/articles/detail/:id` | ArticleDetailComponent | features/articles/article-detail | 是 | authGuard | 文章详情 (后台) |
| `/admin/dashboard` | TodosComponent | components/todos | 是 | authGuard | 控制台 (暂用 Todos) |
| `/admin/todos` | TodosComponent | components/todos | 是 | authGuard | 待办事项 |
| `/admin/users` | TodosComponent | components/todos | 是 | authGuard | 用户管理 (暂用 Todos) |
| `/admin/roles` | TodosComponent | components/todos | 是 | authGuard | 角色管理 (暂用 Todos) |
| `/admin/permissions` | TodosComponent | components/todos | 是 | authGuard | 权限管理 (暂用 Todos) |

---

## 4. 路由配置示例（代码）

### 4.1 根路由（app.routes.ts）

```ts
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: MainHome,
      },
      // ... lazy loaded routes
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      // ... admin child routes
    ],
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
```

---

## 5. 路由守卫说明（Guards）

| Guard 名称 | 类型 | 作用 |
|-----------|------|------|
| authGuard | canActivate | 校验用户是否登录，保护 `/admin` 及其子路由 |

---

## 6. 动态路由与参数说明

| 路由 | 参数 | 说明 |
|------|------|------|
| `/blog/:id` | id | 博客文章 ID |
| `/projects/article/:id` | id | 项目文章 ID |
| `/admin/articles/edit/:id` | id | 文章 ID (编辑) |
| `/admin/articles/view/:id` | id | 文章 ID (查看) |
| `/admin/articles/detail/:id` | id | 文章 ID (详情) |

---

## 7. 特殊说明

- **Standalone Components**: 项目全面使用 Angular Standalone Components，路由配置中使用 `loadComponent` 进行懒加载。
- **Admin 子路由复用**: 目前 `/admin/dashboard`, `/admin/users`, `/admin/roles`, `/admin/permissions` 均暂时复用了 `TodosComponent`，后续需替换为实际组件。
- **MainLayout**: 前台页面主要由 `MainLayoutComponent` 包裹，共享头部和底部。

---

## 8. 变更记录

| 日期 | 修改人 | 内容 |
|------|--------|------|
| 2025-12-15 | User | 初始版本 |
