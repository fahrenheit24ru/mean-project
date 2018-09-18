import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// Customs
import { AuthService } from '../../services/auth.service';
import { MaterialService } from '../../services/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef: ElementRef;
  links = [
    {
      url: '/overview',
      name: 'Обзор'
    },
    {
      url: '/analytics',
      name: 'Аналитика'
    },
    {
      url: '/history',
      name: 'История'
    },
    {
      url: '/order',
      name: 'Добавление заказа'
    },
    {
      url: '/categories',
      name: 'Ассортимент'
    }
  ];

  constructor(private _auth: AuthService, private _router: Router) {}

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this._auth.logout();
    this._router.navigate(['/login']);
  }
}
