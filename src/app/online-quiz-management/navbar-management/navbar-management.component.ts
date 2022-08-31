import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar-management',
  templateUrl: './navbar-management.component.html',
  styleUrls: ['./navbar-management.component.scss']
})
export class NavbarManagementComponent implements OnInit {

  items!: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.items = [{
      label: 'Options',
      items: [
        {
          label: 'Edit profile',
          icon: 'pi pi-user-edit'
        },
        {
          label: 'Change password',
          icon: 'pi pi-lock',
        },
        {
          separator: true
        },
        {
          label: 'Quit',
          icon: 'pi pi-fw pi-power-off'
        }
      ]
    }
    ];
  }

}
