import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconComponent } from '../icon/icon.component';
import { Router, RouterLink } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  path: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [NgFor, IconComponent, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  private router = inject(Router);
  activeRoute = '';

  sideNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'yibiaopan',
      path: 'dashboard',
    },
    {
      label: 'Todos',
      icon: 'todo',
      active: true,
      path: 'todos',
    },
    {
      label: 'Users',
      icon: 'customer',
      path: 'users',
    },
    {
      label: 'Ariticls',
      icon: 'wenzhang',
      path: '/admin/articles',
    },
    {
      label: 'Roles',
      icon: 'customer',
      path: 'roles',
    },
    {
      label: 'Permissions',
      icon: 'logistics-warehouse',
      path: 'permissions',
    },
  ];

  ngOnInit(): void {
    this.activeRoute = this.router.url;

    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  selectItem(item: NavItem): void {
    this.sideNavItems.forEach((i) => (i.active = false));

    item.active = true;
  }

  isActive(path: string): boolean {
    return this.activeRoute.includes(path);
  }
}
