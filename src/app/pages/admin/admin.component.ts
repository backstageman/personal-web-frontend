import { Component, ViewChild, OnInit } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatedTabHeader } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink, RouterOutlet } from '@angular/router';

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
export class AdminComponent implements OnInit {
  filterForm!: FormGroup;
  checked = false;
  displayedColumns: string[] = ['title'];
  dataSource = new MatTableDataSource<any>([
    { title: '这是一个表格，有分页。', name: '文章标题' },
    { title: '任务2', name: '文章标题' },
    { title: '任务3', name: '文章标题' },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      field1: [''],
      field2: [''],
      field3: [''],
      field4: [''],
      field5: [''],
      field6: [''],
    });

    this.dataSource.paginator = this.paginator;
  }

  onSearch() {
    console.log('搜索表单', this.filterForm.value);
  }

  onReset() {
    this.filterForm.reset();
  }
}
