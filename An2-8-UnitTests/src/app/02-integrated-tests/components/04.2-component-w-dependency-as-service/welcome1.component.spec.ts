/**
 * Тестирование компонента с зависимостью.
 * Пример внедрения компонента с помощью провайдера и доступ к его экземпляру
 */

import { TestBed } from '@angular/core/testing';
import { Welcome1Component } from './welcome1.component';
import { Welcome1Service } from './welcome1.service';

// stub WelcomeService для тестирования компонента
const welcomeServiceStub = {
  isLoggedIn: true,
  user: { name: 'Test User' }
};

describe('WelcomeComponent', () => {
  let component: Welcome1Component;
  let welcomeService: Welcome1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // компонент добавлен в провайдеры!
      providers: [
        Welcome1Component,
        { provide: Welcome1Service, useValue: welcomeServiceStub }
      ]
    });
    // получаем компонент и сервис из инжектора
    component = TestBed.get(Welcome1Component);
    welcomeService = TestBed.get(Welcome1Service);
  });

  it('should not have welcome message after construction', () => {
    expect(component.content).toBeUndefined();
  });

  it('should welcome logged in user after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.content).toContain(welcomeService.user.name);
  });

  it('should ask user to log in if not logged in after ngOnInit', () => {
    welcomeService.isLoggedIn = false;
    component.ngOnInit();
    expect(component.content).not.toContain(welcomeService.user.name);
    expect(component.content).toContain('log in');
  });
});
