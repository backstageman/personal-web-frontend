import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface NavItem {
  label: string;
  icon?: string;
  active?: boolean;
  checkbox?: boolean;
  checked?: boolean;
}

@Component({
  selector: 'app-side-nav2',
  imports: [MatIconModule, MatCheckboxModule, FormsModule],
  templateUrl: './side-nav2.component.html',
  styleUrl: './side-nav2.component.scss',
})
export class SideNav2Component {
  mainMenuItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      active: true,
      checkbox: true,
      checked: true,
    },
    { label: 'Products', icon: 'shopping_bag', checkbox: true, checked: false },
    { label: 'Favorites', icon: 'favorite', checkbox: true, checked: false },
    { label: 'Inbox', icon: 'inbox', checkbox: true, checked: false },
    { label: 'Order Lists', icon: 'list_alt', checkbox: true, checked: false },
    {
      label: 'Product Stock',
      icon: 'inventory_2',
      checkbox: true,
      checked: false,
    },
  ];

  pageMenuItems: NavItem[] = [
    { label: 'Pricing', checkbox: true, checked: false },
    { label: 'Calendar', checkbox: true, checked: false },
    { label: 'To-Do', checkbox: true, checked: false },
    { label: 'Contact', checkbox: true, checked: false },
    { label: 'Invoice', checkbox: true, checked: false },
    { label: 'UI Elements', checkbox: true, checked: false },
    { label: 'Team', checkbox: true, checked: false },
    { label: 'Table', checkbox: true, checked: false },
  ];

  selectItem(item: NavItem): void {
    // Reset all active states
    this.mainMenuItems.forEach((i) => (i.active = false));
    this.pageMenuItems.forEach((i) => (i.active = false));

    // Set current item as active
    item.active = true;

    // Here you would typically navigate to the corresponding route
    // console.log(`Navigating to ${item.label}`);
  }

  openSettings(): void {
    // console.log('Opening settings');
    // Navigate to settings page
  }

  logout(): void {
    // console.log('Logging out');
    // Implement logout logic
  }
}
