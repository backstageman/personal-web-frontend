import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { TableComponent } from './components/table/table.component';
import { TodosComponent } from './components/todos/todos.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { ArticleForm2Component } from './components/article-form2/article-form2.component';
import { ArticleCreatePageComponent } from './components/article-create-page/article-create-page.component';
import { ArticleViewPageComponent } from './components/article-view-page/article-view-page.component';
import { ArticleEditPageComponent } from './components/article-edit-page/article-edit-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'articles',
        component: ArticlesComponent,
      },
      {
        path: 'articles/new',
        component: ArticleCreatePageComponent,
      },
      {
        path: 'articles/edit/:id',
        component: ArticleEditPageComponent,
      },
      {
        path: 'articles/view/:id',
        component: ArticleViewPageComponent,
      },
      {
        path: 'todos',
        component: TodosComponent,
      },
    ],
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
