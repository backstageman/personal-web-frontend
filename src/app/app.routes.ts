import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { ArticlesComponent } from './components/articles/articles.component';
import { HomeComponent as MainHome } from './features/home/home.component';
import { MainLayoutComponent } from './features/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: MainHome,
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'blog/:id',
        loadComponent: () =>
          import(
            './features/articles/article-detail/article-detail.component'
          ).then((m) => m.ArticleDetailComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/resume/resume.component').then(
            (m) => m.ResumeComponent
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    // 后台管理系统的页面
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'articles',
        component: ArticlesComponent,
      },
      {
        path: 'articles/new',
        loadComponent: () =>
          import(
            './components/article-create-page/article-create-page.component'
          ).then((m) => m.ArticleCreatePageComponent),
      },
      {
        path: 'articles/edit/:id',
        loadComponent: () =>
          import(
            './components/article-edit-page/article-edit-page.component'
          ).then((m) => m.ArticleEditPageComponent),
      },
      {
        path: 'articles/view/:id',
        loadComponent: () =>
          import(
            './components/article-view-page/article-view-page.component'
          ).then((m) => m.ArticleViewPageComponent),
      },
      {
        path: 'articles/detail/:id',
        loadComponent: () =>
          import(
            './features/articles/article-detail/article-detail.component'
          ).then((m) => m.ArticleDetailComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
      {
        path: 'todos',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
      {
        path: 'permissions',
        loadComponent: () =>
          import('./components/todos/todos.component').then(
            (m) => m.TodosComponent
          ),
      },
    ],
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
