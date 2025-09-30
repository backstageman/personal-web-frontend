import { Component, inject } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-admin',
  imports: [
    SidenavComponent,
    TopBarComponent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    RouterOutlet,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private route = inject(Router);
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    const flag = this.authService.isAuthenticated();
    console.log('flag  login>>>', flag);
    if (flag) {
      this.route.navigate(['admin/articles']);
    } else {
      alert('你还没有登录');
      setTimeout(() => {
        this.route.navigate(['login']);
      }, 3000);
    }
  }
}
