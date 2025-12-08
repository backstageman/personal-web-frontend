import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormField,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  filterForm!: FormGroup;
  checked = false;
  displayedColumns: string[] = ['title'];
  dataSource = new MatTableDataSource<any>([
    { title: '这是一个表格，有分页。', name: '文章标题' },
    { title: '任务2', name: '文章标题' },
    { title: '任务3', name: '文章标题' },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder) { }

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
    // console.log('搜索表单', this.filterForm.value);
  }

  onReset() {
    this.filterForm.reset();
  }
}
