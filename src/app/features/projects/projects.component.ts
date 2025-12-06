import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';
import {
  ProjectPublic,
  ProjectPublicResponse,
} from '../../models/project-public.model';
import { ProjectsPublicService } from '../../services/projects-public.service';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, ProjectListItemComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
    projects: ProjectPublic[] = [];

    constructor(private projectService: ProjectsPublicService) {}

    ngOnInit(): void {
        this.fetchProjects();
    }

    fetchProjects(page: number = 1, limit: number = 10): void {
        this.projectService.getAllProjects(page, limit).subscribe({
            next: (result: ProjectPublicResponse) => {
                this.projects = result.data;
                console.log('Fetched projects:', this.projects);
            },
            error: (error) => {
                console.error('Error fetching projects:', error);
            },
        });
    }
}
