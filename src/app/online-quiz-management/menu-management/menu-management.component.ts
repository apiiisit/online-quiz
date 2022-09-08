import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss']
})
export class MenuManagementComponent implements OnInit {

  items!: MenuItem[];
  styleConfig: any;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.items = [
      {
        label: 'หน้าหลัก',
        routerLink: '/online-quiz/management/',
        command: () => setTimeout(() => this.ngOnInit())
      },
      {
        label: 'All quiz',
        icon: 'pi pi-star-fill',
        routerLink: '/online-quiz/management/quiz',
        command: () => setTimeout(() => this.ngOnInit())
      },
      {
        label: 'Results',
        icon: 'pi pi-check-circle',
        routerLink: '/online-quiz/management/results',
        command: () => setTimeout(() => this.ngOnInit())
      },
      {
        label: 'Category',
        icon: 'pi pi-tags',
        routerLink: '/online-quiz/management/category',
        command: () => setTimeout(() => this.ngOnInit())
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/online-quiz/management/users',
        command: () => setTimeout(() => this.ngOnInit())
      }
    ];

    this.styleConfig = {
      'border-left': '10px solid #5b6cbf'
    }

    const path = this.router.url.split('/');
    const pathName = path[path.length - 1]
    const index = this.items.findIndex(item => item.label?.toLowerCase().includes(pathName));
    if (index > -1) this.items[index]['style'] = this.styleConfig;

  }

}
