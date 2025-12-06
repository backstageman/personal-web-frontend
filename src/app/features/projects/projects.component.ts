import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListItemComponent } from './components/project-list-item/project-list-item.component';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, ProjectListItemComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
    // Placeholder data for static design
    projects = [
        {
            title: 'Learn CSS Grid by Building a Magazine Layout',
            image: 'https://cdn.freecodecamp.org/platform/english/images/learn-css-grid-by-building-a-magazine-layout.png', // Placeholder image
            author: 'Joy Shaheb',
            date: 'May 25, 2022',
            tags: ['#CSS']
        },
        {
            title: 'How to Create a Responsive Navigation Bar',
            image: 'https://cdn.freecodecamp.org/platform/english/images/how-to-create-a-responsive-navigation-bar.png',
            author: 'John Doe',
            date: 'June 10, 2022',
            tags: ['#HTML', '#CSS']
        },
        {
            title: 'JavaScript Array Methods Explained',
            image: 'https://cdn.freecodecamp.org/platform/english/images/javascript-array-methods-explained.png',
            author: 'Jane Smith',
            date: 'July 15, 2022',
            tags: ['#JavaScript']
        },
        {
            title: 'Learn CSS Grid by Building a Magazine Layout',
            image: 'https://cdn.freecodecamp.org/platform/english/images/learn-css-grid-by-building-a-magazine-layout.png', // Placeholder image
            author: 'Joy Shaheb',
            date: 'May 25, 2022',
            tags: ['#CSS']
        },
        {
            title: 'How to Create a Responsive Navigation Bar',
            image: 'https://cdn.freecodecamp.org/platform/english/images/how-to-create-a-responsive-navigation-bar.png',
            author: 'John Doe',
            date: 'June 10, 2022',
            tags: ['#HTML', '#CSS']
        },
        {
            title: 'JavaScript Array Methods Explained',
            image: 'https://cdn.freecodecamp.org/platform/english/images/javascript-array-methods-explained.png',
            author: 'Jane Smith',
            date: 'July 15, 2022',
            tags: ['#JavaScript']
        }
    ];
}
