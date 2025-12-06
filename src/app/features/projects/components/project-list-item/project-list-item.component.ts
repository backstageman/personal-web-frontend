import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-list-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './project-list-item.component.html',
    styleUrl: './project-list-item.component.scss'
})
export class ProjectListItemComponent {
    @Input() project: any;
}
