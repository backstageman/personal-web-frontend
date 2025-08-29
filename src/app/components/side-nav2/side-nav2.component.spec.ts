import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNav2Component } from './side-nav2.component';

describe('SideNav2Component', () => {
  let component: SideNav2Component;
  let fixture: ComponentFixture<SideNav2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNav2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNav2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
